'use server'

import { getAuthenticatedCompanyId } from './utils'
import { revalidatePath } from 'next/cache'
import { Database } from '@/types/supabase'

type Client = Database['public']['Tables']['clients']['Row']

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
  
  const newClient = {
    company_id: companyId,
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    address: formData.get('address') as string,
  }

  const { error } = await supabase.from('clients').insert(newClient)
  
  if (error) {
    console.error('Error creating client:', error)
    throw new Error('Failed to create client')
  }

  revalidatePath('/clients')
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
