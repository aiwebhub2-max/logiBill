'use server'

import { getAuthenticatedCompanyId } from './utils'
import { revalidatePath } from 'next/cache'

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

  const { data, error } = await supabase
    .from('payments')
    .insert({
      company_id: companyId,
      invoice_id: paymentData.invoice_id,
      amount: paymentData.amount,
      method: paymentData.method,
      payment_date: paymentData.payment_date,
      notes: paymentData.notes || null,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating payment:', error)
    throw new Error('Failed to create payment')
  }

  // If a payment is created, we might want to update the invoice status
  // e.g. checking if total payments >= invoice total to set status to 'paid'
  // For simplicity, we assume the user handles status manually or we do it here.

  revalidatePath('/payments')
  revalidatePath('/invoices') // because invoice status might have changed, or at least balances
  return data.id
}
