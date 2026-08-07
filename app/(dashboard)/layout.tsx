import type { Metadata } from "next";
import DashboardLayoutClient from "./DashboardLayoutClient";

import { createClient } from "@/utils/supabase/server";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: {
    template: "%s | logiBill",
    default: "Dashboard | logiBill",
  },
};

async function getDashboardData() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { counts: { invoices: 0, inventoryAlerts: 0 }, company: null, user: null };
  }

  const { data: company } = await supabase.from('companies').select('*').limit(1).single();
  
  if (!company) {
    return { counts: { invoices: 0, inventoryAlerts: 0 }, company: null, user };
  }
  
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
    counts: {
      invoices: invoicesCount || 0,
      inventoryAlerts
    },
    company,
    user
  };
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await getDashboardData();

  return (
    <DashboardLayoutClient 
      invoicesCount={data.counts.invoices} 
      inventoryAlertsCount={data.counts.inventoryAlerts}
      user={data.user}
      company={data.company}
    >
      {children}
    </DashboardLayoutClient>
  );
}
