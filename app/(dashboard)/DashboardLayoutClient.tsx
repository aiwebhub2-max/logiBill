"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { usePathname } from "next/navigation";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": { title: "Tableau de bord", subtitle: "Vue d'ensemble de votre activité" },
  "/invoices": { title: "Factures", subtitle: "Gérez toutes vos factures" },
  "/invoices/new": { title: "Nouvelle facture", subtitle: "Créer une facture professionnelle" },
  "/clients": { title: "Clients", subtitle: "Votre base clients" },
  "/inventory": { title: "Inventaire", subtitle: "Gestion de stock et articles" },
  "/payments": { title: "Paiements", subtitle: "Encaissements et règlements" },
  "/settings": { title: "Paramètres", subtitle: "Configuration de votre compte" },
};

export default function DashboardLayoutClient({
  children,
  invoicesCount,
  inventoryAlertsCount,
}: {
  children: React.ReactNode;
  invoicesCount?: number;
  inventoryAlertsCount?: number;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const pageInfo = pageTitles[pathname] || { title: "logiBill", subtitle: "" };

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        invoicesCount={invoicesCount}
        inventoryAlertsCount={inventoryAlertsCount}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <Header
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          title={pageInfo.title}
          subtitle={pageInfo.subtitle}
        />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-surface">
          <div className="bg-gradient-glow min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
