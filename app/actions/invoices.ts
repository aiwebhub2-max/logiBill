'use server'

import { getAuthenticatedCompanyId } from './utils'
import { revalidatePath } from 'next/cache'
import { Database } from '@/types/supabase'

export async function getInvoices() {
  const { companyId, supabase } = await getAuthenticatedCompanyId()
  
  // Fetch invoices with client details and invoice lines
  const { data, error } = await supabase
    .from('invoices')
    .select(`
      *,
      clients (*),
      invoice_lines (*)
    `)
    .eq('company_id', companyId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching invoices:', error)
    return []
  }

  // Calculate totals
  return data.map(invoice => {
    // We assume invoice_lines is loaded. Note that Supabase types might be arrays
    const lines = Array.isArray(invoice.invoice_lines) ? invoice.invoice_lines : []
    const subtotal = lines.reduce((sum: number, line: any) => sum + (line.quantity * line.unit_price), 0)
    const tax_amount = subtotal * (invoice.tax_rate || 0)
    const total_amount = subtotal + tax_amount

    return {
      ...invoice,
      client: invoice.clients, // alias for UI compatibility
      subtotal,
      tax_amount,
      total_amount
    }
  })
}

export async function createInvoice(invoiceData: any, linesData: any[]) {
  const { companyId, supabase } = await getAuthenticatedCompanyId()

  // 1. Insert Invoice
  const { data: invoice, error: invoiceError } = await supabase
    .from('invoices')
    .insert({
      company_id: companyId,
      client_id: invoiceData.client_id,
      invoice_number: invoiceData.invoice_number,
      issue_date: invoiceData.issue_date,
      due_date: invoiceData.due_date,
      status: invoiceData.status || 'draft',
      tax_rate: invoiceData.tax_rate || 0,
      notes: invoiceData.notes || null,
    })
    .select()
    .single()

  if (invoiceError || !invoice) {
    console.error('Error creating invoice:', invoiceError)
    throw new Error('Failed to create invoice')
  }

  // 2. Insert Lines
  const formattedLines = linesData.map((line, index) => ({
    invoice_id: invoice.id,
    item_id: line.item_id || null, // null if custom item
    description: line.description || '', // Supabase schema requires description string
    quantity: line.quantity,
    unit_price: line.unit_price,
    position: index
  }))

  const { error: linesError } = await supabase
    .from('invoice_lines')
    .insert(formattedLines)

  if (linesError) {
    console.error('Error creating invoice lines:', linesError)
    // Optional: rollback invoice creation here or handle via RPC transaction
    throw new Error('Failed to create invoice lines')
  }

  revalidatePath('/invoices')
  return invoice.id
}
