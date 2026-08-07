import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle,
  ArrowRight,
  Package,
  Users,
  Plus,
  RefreshCw,
} from "lucide-react";

import StatCard from "@/components/dashboard/StatCard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import InvoiceTable from "@/components/dashboard/InvoiceTable";
import { getDashboardStats } from "@/app/actions/dashboard";
import { getInventoryItems } from "@/app/actions/inventory";
import { getClients } from "@/app/actions/clients";
import { createClient } from "@/utils/supabase/server";
import { formatFC, cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Tableau de bord | logiBill",
  description: "Vue d'ensemble de votre activité commerciale",
};

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const firstName = user?.user_metadata?.first_name || "Utilisateur";

  const stats = await getDashboardStats();
  const inventoryItems = await getInventoryItems();
  const clients = await getClients();

  // Stock alert items
  const stockAlerts = inventoryItems.filter(
    (item) => item.stock_quantity <= item.stock_alert_threshold
  );

  const recentInvoices = stats.recentInvoices;

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1400px] mx-auto">
      
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bonjour, {firstName} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Voici le résumé de votre activité du jour
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary text-sm py-2" id="refresh-dashboard-btn">
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Actualiser</span>
          </button>
          <Link href="/invoices/new">
            <button className="btn-primary text-sm" id="create-invoice-btn">
              <Plus className="w-4 h-4" />
              Nouvelle facture
            </button>
          </Link>
        </div>
      </div>

      {/* ===== STAT CARDS ===== */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total factures"
          value={stats.total_invoices}
          icon={FileText}
          iconColor="text-brand-400"
          iconBg="bg-brand-600/20"
          trend={12}
          trendLabel="vs mois dernier"
          glowColor="#6366f1"
          isCount
        />
        <StatCard
          title="Montant facturé"
          value={stats.total_invoiced}
          icon={TrendingUp}
          iconColor="text-purple-400"
          iconBg="bg-purple-600/20"
          trend={8}
          trendLabel="vs mois dernier"
          glowColor="#8b5cf6"
        />
        <StatCard
          title="Montant encaissé"
          value={stats.total_paid}
          icon={CheckCircle}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/20"
          trend={5}
          trendLabel="vs mois dernier"
          glowColor="#10b981"
        />
        <StatCard
          title="En attente"
          value={stats.total_pending + stats.total_overdue}
          icon={Clock}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/20"
          trend={-3}
          trendLabel="vs mois dernier"
          glowColor="#f59e0b"
        />
      </section>

      {/* ===== MAIN GRID ===== */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Revenue Chart — 2/3 width */}
        <div className="xl:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Revenus par mois
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Facturé vs Encaissé — 2024
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-gray-600">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                Facturé
              </span>
              <span className="flex items-center gap-1.5 text-gray-600">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-500" />
                Encaissé
              </span>
            </div>
          </div>
          <RevenueChart data={stats.monthly_revenue} />
        </div>

        {/* Right column */}
        <div className="space-y-4">

          {/* Stock Alerts */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">
                    Alertes stock
                  </h2>
                  <p className="text-[10px] text-gray-500">
                    {stockAlerts.length} article{stockAlerts.length > 1 ? "s" : ""} en rupture
                  </p>
                </div>
              </div>
              <Link href="/inventory" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
                Voir tout
              </Link>
            </div>

            <div className="space-y-2.5">
              {stockAlerts.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-surface-muted border border-red-500/20"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center">
                      <Package className="w-3.5 h-3.5 text-red-400" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-800 truncate max-w-[110px]">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-gray-500">
                        Seuil: {item.stock_alert_threshold}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-red-400">
                      {item.stock_quantity} unités
                    </p>
                    <p className="text-[10px] text-gray-600">restantes</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top clients */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-brand-600/20 flex items-center justify-center">
                  <Users className="w-4 h-4 text-brand-400" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">
                    Top clients
                  </h2>
                  <p className="text-[10px] text-gray-500">Par montant facturé</p>
                </div>
              </div>
              <Link href="/clients" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
                Voir tout
              </Link>
            </div>

            <div className="space-y-2.5">
              {clients.slice(0, 4).map((client, index) => {
                const percentage = Math.round(
                  ((client.total_invoiced || 0) /
                    (Math.max(...clients.map((c) => c.total_invoiced || 0)) || 1)) *
                    100
                );
                return (
                  <div key={client.id} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-600 w-3">
                          {index + 1}
                        </span>
                        <span className="text-xs text-gray-700 font-medium truncate max-w-[120px]">
                          {client.name}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-gray-900">
                        {formatFC(client.total_invoiced || 0)}
                      </span>
                    </div>
                    <div className="h-1 bg-surface-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-brand rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ===== RECENT INVOICES ===== */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Dernières factures
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Les 5 factures les plus récentes
            </p>
          </div>
          <Link
            href="/invoices"
            id="view-all-invoices-btn"
            className="flex items-center gap-1.5 text-sm text-brand-400 hover:text-brand-300 font-medium transition-colors"
          >
            Voir toutes
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <InvoiceTable invoices={recentInvoices} showActions={true} />
      </div>

      {/* ===== QUICK ACTIONS ===== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            href: "/invoices/new",
            icon: FileText,
            label: "Créer une facture",
            color: "text-brand-400",
            bg: "bg-brand-600/10 border-brand-600/20 hover:border-brand-600/40",
            id: "quick-create-invoice",
          },
          {
            href: "/clients/new",
            icon: Users,
            label: "Ajouter un client",
            color: "text-purple-400",
            bg: "bg-purple-600/10 border-purple-600/20 hover:border-purple-600/40",
            id: "quick-add-client",
          },
          {
            href: "/inventory/new",
            icon: Package,
            label: "Ajouter un article",
            color: "text-emerald-400",
            bg: "bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/40",
            id: "quick-add-item",
          },
          {
            href: "/payments",
            icon: CheckCircle,
            label: "Enregistrer un paiement",
            color: "text-amber-400",
            bg: "bg-amber-500/10 border-amber-500/20 hover:border-amber-500/40",
            id: "quick-add-payment",
          },
        ].map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.href} href={action.href} id={action.id}>
              <div
                className={cn(
                  "flex flex-col items-center justify-center gap-2.5 p-4 rounded-xl border transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-card",
                  action.bg
                )}
              >
                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", action.bg)}>
                  <Icon className={cn("w-5 h-5", action.color)} />
                </div>
                <span className="text-xs font-medium text-gray-700 text-center leading-tight">
                  {action.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
