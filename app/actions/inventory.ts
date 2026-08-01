'use server'

import { getAuthenticatedCompanyId } from './utils'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const inventoryItemSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(100),
  category: z.string().max(50).optional().or(z.literal('')),
  sku: z.string().max(50).optional().or(z.literal('')),
  stock_quantity: z.number().int().nonnegative(),
  unit_price: z.number().nonnegative(),
  stock_alert_threshold: z.number().int().nonnegative(),
})

export async function getInventoryItems() {
  const { companyId, supabase } = await getAuthenticatedCompanyId()
  const { data, error } = await supabase
    .from('inventory_items')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching inventory items:', error)
    return []
  }

  // Adding mock status field to match UI expectations
  return data.map(item => ({
    ...item,
    status: item.stock_quantity === 0 ? 'out_of_stock' : item.stock_quantity <= item.stock_alert_threshold ? 'low_stock' : 'in_stock'
  }))
}

export async function createInventoryItem(formData: FormData) {
  const { companyId, supabase } = await getAuthenticatedCompanyId()
  
  const parsed = inventoryItemSchema.safeParse({
    name: formData.get('name'),
    category: formData.get('category') || '',
    sku: formData.get('sku') || '',
    stock_quantity: parseInt(formData.get('stock_quantity') as string) || 0,
    unit_price: parseFloat(formData.get('unit_price') as string) || 0,
    stock_alert_threshold: parseInt(formData.get('stock_alert_threshold') as string) || 5,
  })

  if (!parsed.success) {
    console.error('Validation error:', parsed.error)
    throw new Error('Données d\'inventaire invalides')
  }

  const newItem = {
    company_id: companyId,
    name: parsed.data.name,
    category: parsed.data.category || null,
    sku: parsed.data.sku || null,
    stock_quantity: parsed.data.stock_quantity,
    unit_price: parsed.data.unit_price,
    stock_alert_threshold: parsed.data.stock_alert_threshold,
  }

  const { error } = await supabase.from('inventory_items').insert(newItem)
  
  if (error) {
    console.error('Error creating inventory item:', error)
    throw new Error('Échec lors de la création de l\'article')
  }

  revalidatePath('/inventory')
}

export async function deleteInventoryItem(id: string) {
  const { supabase } = await getAuthenticatedCompanyId()
  const { error } = await supabase.from('inventory_items').delete().eq('id', id)
  
  if (error) {
    console.error('Error deleting inventory item:', error)
    throw new Error('Failed to delete inventory item')
  }

  revalidatePath('/inventory')
}
