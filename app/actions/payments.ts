'use server'

import { getAuthenticatedCompanyId } from './utils'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const paymentSchema = z.object({
  invoice_id: z.string().uuid(),
  amount: z.number().positive(),
  method: z.string().min(1),
  payment_date: z.string().min(1),
  notes: z.string().optional().or(z.literal('')),
})

export async function getPayments() {
  const { companyId, supabase } = await getAuthenticatedCompanyId()
  
  // Fetch payments with invoice details (and invoice client details)
  const { data, error } = await supabase
    .from('payments')
    .select(`
      *,
      invoices (
        *,
        clients (*)
      )
    `)
    .eq('company_id', companyId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching payments:', error)
    return []
  }

  // Format data to match UI expectations if necessary
  return data.map(payment => {
    // The UI might expect payment.invoice.invoice_number or payment.invoice.client.name
    return {
      ...payment,
      invoice: payment.invoices
    }
  })
}

export async function createPayment(paymentData: any) {
  const { companyId, supabase } = await getAuthenticatedCompanyId()

  const parsed = paymentSchema.safeParse(paymentData)
  
  if (!parsed.success) {
    console.error('Validation error:', parsed.error)
    throw new Error('Données de paiement invalides')
  }

  const { data, error } = await supabase
    .from('payments')
    .insert({
      company_id: companyId,
      invoice_id: parsed.data.invoice_id,
      amount: parsed.data.amount,
      method: parsed.data.method,
      payment_date: parsed.data.payment_date,
      notes: parsed.data.notes || null,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating payment:', error)
    throw new Error('Échec lors de la création du paiement')
  }

  // If a payment is created, we might want to update the invoice status
  // e.g. checking if total payments >= invoice total to set status to 'paid'
  // For simplicity, we assume the user handles status manually or we do it here.

  revalidatePath('/payments')
  revalidatePath('/invoices') // because invoice status might have changed, or at least balances
  return data.id
}
