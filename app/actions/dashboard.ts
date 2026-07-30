'use server'

import { getInvoices } from './invoices'

export async function getDashboardStats() {
  const invoices = await getInvoices()
  
  let total_invoices = invoices.length
  let total_invoiced = 0
  let total_paid = 0
  let total_pending = 0
  let total_overdue = 0

  // Initialize monthly revenue for the current year (12 months)
  const currentYear = new Date().getFullYear()
  const monthNames = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"]
  
  const monthly_revenue = monthNames.map(month => ({
    month,
    invoiced: 0,
    revenue: 0
  }))

  invoices.forEach(inv => {
    // Only consider non-draft invoices for billed amounts
    if (inv.status !== 'draft') {
      total_invoiced += inv.total_amount || 0
      
      const invDate = new Date(inv.issue_date)
      if (invDate.getFullYear() === currentYear) {
        monthly_revenue[invDate.getMonth()].invoiced += inv.total_amount || 0
      }
    }

    if (inv.status === 'paid') {
      total_paid += inv.total_amount || 0
      
      // If there is a paid_at date we could use it, otherwise fallback to issue_date
      const paidDate = inv.paid_at ? new Date(inv.paid_at) : new Date(inv.issue_date)
      if (paidDate.getFullYear() === currentYear) {
        monthly_revenue[paidDate.getMonth()].revenue += inv.total_amount || 0
      }
    } else if (inv.status === 'sent') {
      total_pending += inv.total_amount || 0
    } else if (inv.status === 'overdue') {
      total_overdue += inv.total_amount || 0
    }
  })

  return {
    total_invoices,
    total_invoiced,
    total_paid,
    total_pending,
    total_overdue,
    monthly_revenue,
    recentInvoices: invoices.slice(0, 5)
  }
}
