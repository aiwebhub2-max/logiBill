'use server'

import { getAuthenticatedCompanyId } from './utils'
import { revalidatePath } from 'next/cache'
import { Database } from '@/types/supabase'
import { z } from 'zod'

type Client = Database['public']['Tables']['clients']['Row']

const clientSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(100),
  email: z.string().email("L'adresse email est invalide").or(z.literal('')),
  phone: z.string().max(30).optional().or(z.literal('')),
  address: z.string().max(255).optional().or(z.literal('')),
})

export async function getClients() {
  const { companyId, supabase } = await getAuthenticatedCompanyId()
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching clients:', error)
    return []
  }

  // Adding mock fields to match the UI expectation if not present in DB
  return data.map(client => ({
    ...client,
    total_invoiced: 0, // This would ideally be calculated with a join or view
    invoices_count: 0
  }))
}

export async function createClient(formData: FormData) {
  const { companyId, supabase } = await getAuthenticatedCompanyId()
  
  const parsed = clientSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email') || '',
    phone: formData.get('phone') || '',
    address: formData.get('address') || '',
  })

  if (!parsed.success) {
    console.error('Validation error:', parsed.error)
    throw new Error('Données client invalides')
  }

  const newClient = {
    company_id: companyId,
    name: parsed.data.name,
    email: parsed.data.email || null, // Ensure empty strings are stored as null if expected by DB or handled properly
    phone: parsed.data.phone || null,
    address: parsed.data.address || null,
  }

  const { data, error } = await supabase.from('clients').insert(newClient).select().single()
  
  if (error) {
    console.error('Error creating client:', error)
    throw new Error('Échec lors de la création du client')
  }

  revalidatePath('/clients')
  return data
}

export async function deleteClient(id: string) {
  const { supabase } = await getAuthenticatedCompanyId()
  const { error } = await supabase.from('clients').delete().eq('id', id)
  
  if (error) {
    console.error('Error deleting client:', error)
    throw new Error('Failed to delete client')
  }

  revalidatePath('/clients')
}
