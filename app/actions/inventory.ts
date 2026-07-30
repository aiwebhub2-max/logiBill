'use server'

import { getAuthenticatedCompanyId } from './utils'
import { revalidatePath } from 'next/cache'

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
  
  const newItem = {
    company_id: companyId,
    name: formData.get('name') as string,
    category: formData.get('category') as string || null,
    sku: formData.get('sku') as string || null,
    stock_quantity: parseInt(formData.get('stock_quantity') as string) || 0,
    unit_price: parseFloat(formData.get('unit_price') as string) || 0,
    stock_alert_threshold: parseInt(formData.get('stock_alert_threshold') as string) || 5,
  }

  const { error } = await supabase.from('inventory_items').insert(newItem)
  
  if (error) {
    console.error('Error creating inventory item:', error)
    throw new Error('Failed to create inventory item')
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
