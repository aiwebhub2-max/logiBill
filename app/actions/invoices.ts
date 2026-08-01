'use server'

import { getAuthenticatedCompanyId } from './utils'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const invoiceSchema = z.object({
  client_id: z.string().uuid(),
  invoice_number: z.string().min(1),
  issue_date: z.string().min(1),
  due_date: z.string().min(1),
  status: z.enum(['draft', 'sent', 'paid', 'overdue']).default('draft'),
  tax_rate: z.number().nonnegative().default(0),
  notes: z.string().optional().or(z.literal('')),
})

const invoiceLineSchema = z.object({
  item_id: z.string().uuid().optional().nullable(),
  description: z.string().min(1),
  quantity: z.number().positive(),
  unit_price: z.number().nonnegative(),
})

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

  const parsedInvoice = invoiceSchema.safeParse(invoiceData)
  if (!parsedInvoice.success) {
    console.error('Validation error (invoice):', parsedInvoice.error)
    throw new Error('Données de facture invalides')
  }

  const parsedLines = z.array(invoiceLineSchema).safeParse(linesData)
  if (!parsedLines.success) {
    console.error('Validation error (lines):', parsedLines.error)
    throw new Error('Données de lignes de facture invalides')
  }

  // 1. Insert Invoice
  const { data: invoice, error: invoiceError } = await supabase
    .from('invoices')
    .insert({
      company_id: companyId,
      client_id: parsedInvoice.data.client_id,
      invoice_number: parsedInvoice.data.invoice_number,
      issue_date: parsedInvoice.data.issue_date,
      due_date: parsedInvoice.data.due_date,
      status: parsedInvoice.data.status,
      tax_rate: parsedInvoice.data.tax_rate,
      notes: parsedInvoice.data.notes || null,
    })
    .select()
    .single()

  if (invoiceError || !invoice) {
    console.error('Error creating invoice:', invoiceError)
    throw new Error('Échec lors de la création de la facture')
  }

  // 2. Insert Lines
  const formattedLines = parsedLines.data.map((line, index) => ({
    invoice_id: invoice.id,
    item_id: line.item_id || null, // null if custom item
    description: line.description, // Supabase schema requires description string
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
    throw new Error('Échec lors de la création des lignes de facture')
  }

  revalidatePath('/invoices')
  return invoice.id
}
