import type { Metadata } from "next";
import DashboardLayoutClient from "./DashboardLayoutClient";

import { supabase } from "@/lib/supabase";

export const metadata: Metadata = {
  title: {
    template: "%s | logiBill",
    default: "Dashboard | logiBill",
  },
};

async function getSidebarCounts() {
  const { data: company } = await supabase.from('companies').select('id').limit(1).single();
  if (!company) return { invoices: 0, inventoryAlerts: 0 };
  
  const { count: invoicesCount } = await supabase
    .from('invoices')
    .select('*', { count: 'exact', head: true })
    .eq('company_id', company.id)
    .in('status', ['draft', 'sent', 'overdue']);
    
  const { data: items } = await supabase
    .from('inventory_items')
    .select('stock_quantity, stock_alert_threshold')
    .eq('company_id', company.id);
    
  let inventoryAlerts = 0;
  if (items) {
    inventoryAlerts = items.filter(i => i.stock_quantity <= i.stock_alert_threshold).length;
  }
  
  return {
    invoices: invoicesCount || 0,
    inventoryAlerts
  };
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const counts = await getSidebarCounts();

  return (
    <DashboardLayoutClient 
      invoicesCount={counts.invoices} 
      inventoryAlertsCount={counts.inventoryAlerts}
    >
      {children}
    </DashboardLayoutClient>
  );
}
