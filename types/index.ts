// Types principaux du SaaS Facturation & Stock

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";
export type PaymentMethod = "cash" | "mobile_money" | "bank_transfer" | "card";

export interface Company {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  logo_url?: string;
  tax_number?: string;
  currency: string;
  tax_rate: number;
}

export interface Client {
  id: string;
  company_id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at: string;
  total_invoiced?: number;
  invoices_count?: number;
}

export interface InventoryItem {
  id: string;
  company_id: string;
  name: string;
  description?: string;
  sku?: string;
  unit_price: number;
  stock_quantity: number;
  stock_alert_threshold: number;
  category?: string;
  created_at: string;
}

export interface InvoiceLine {
  id: string;
  invoice_id?: string;
  item_id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  position: number;
}

export interface Invoice {
  id: string;
  company_id: string;
  client_id: string;
  client?: Client;
  invoice_number: string;
  status: InvoiceStatus;
  issue_date: string;
  due_date: string;
  tax_rate: number;
  notes?: string;
  sent_at?: string;
  paid_at?: string;
  created_at: string;
  lines: InvoiceLine[];
  // Calculated
  subtotal?: number;
  tax_amount?: number;
  total?: number;
}

export interface Payment {
  id: string;
  invoice_id: string;
  company_id: string;
  amount: number;
  payment_date: string;
  method: PaymentMethod;
  notes?: string;
  created_at: string;
}

export interface DashboardStats {
  total_invoices: number;
  total_invoiced: number;
  total_paid: number;
  total_pending: number;
  total_overdue: number;
  monthly_revenue: MonthlyRevenue[];
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  invoiced: number;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}
