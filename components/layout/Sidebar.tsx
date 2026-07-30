"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  Package,
  CreditCard,
  Settings,
  ChevronRight,
  Zap,
  TrendingUp,
  X,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/dashboard",
    label: "Tableau de bord",
    icon: LayoutDashboard,
    description: "Vue d'ensemble",
  },
  {
    href: "/invoices",
    label: "Factures",
    icon: FileText,
    description: "Gérer les factures",
  },
  {
    href: "/clients",
    label: "Clients",
    icon: Users,
    description: "Base clients",
  },
  {
    href: "/inventory",
    label: "Inventaire",
    icon: Package,
    description: "Stock & articles",
    badgeColor: "bg-red-500",
  },
  {
    href: "/payments",
    label: "Paiements",
    icon: CreditCard,
    description: "Encaissements",
  },
];

const bottomItems = [
  { href: "/settings", label: "Paramètres", icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  invoicesCount?: number;
  inventoryAlertsCount?: number;
}

export default function Sidebar({ isOpen, onClose, invoicesCount = 0, inventoryAlertsCount = 0 }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 flex flex-col",
          "bg-surface-card border-r border-surface-border",
          "transition-transform duration-300 ease-out",
          "lg:relative lg:translate-x-0 lg:flex",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo / Brand */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-surface-border">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-9 h-9 bg-gradient-brand rounded-xl flex items-center justify-center shadow-glow-brand">
                <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div className="absolute -inset-1 bg-gradient-brand rounded-xl opacity-20 blur-lg group-hover:opacity-40 transition-opacity" />
            </div>
            <div>
              <span className="text-base font-bold text-gray-900 tracking-tight">
                logi<span className="gradient-text">Bill</span>
              </span>
              <p className="text-[10px] text-gray-500 font-medium -mt-0.5">
                Gestion & Facturation
              </p>
            </div>
          </Link>

          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="lg:hidden btn-icon"
            aria-label="Fermer le menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Company info */}
        <div className="mx-3 mt-4 px-3 py-3 rounded-xl bg-surface-muted border border-surface-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-600 to-purple-600 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-4 h-4 text-gray-900" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-900 truncate">
                MonEntreprise SARL
              </p>
              <p className="text-[10px] text-gray-500 truncate">
                NRC: KIN-24-12345
              </p>
            </div>
          </div>
        </div>

        {/* Navigation principale */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-3 mb-3 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
            Menu principal
          </p>

          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            
            let badgeCount: number | undefined;
            if (item.href === "/invoices" && invoicesCount > 0) badgeCount = invoicesCount;
            if (item.href === "/inventory" && inventoryAlertsCount > 0) badgeCount = inventoryAlertsCount;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                  active
                    ? "text-gray-900/20 border border-brand-600/30"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-transparent"
                )}
              >
                {/* Active indicator */}
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-brand-500 rounded-r-full" />
                )}

                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200",
                    active
                      ? "bg-brand-600/30 text-brand-400"
                      : "bg-surface-muted text-gray-500 group-hover:bg-surface-border group-hover:text-gray-700"
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <span className="flex-1">{item.label}</span>

                {/* Badge */}
                {badgeCount !== undefined && (
                  <span
                    className={cn(
                      "flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold text-gray-900",
                      item.badgeColor || "bg-brand-600"
                    )}
                  >
                    {badgeCount}
                  </span>
                )}

                {badgeCount === undefined && active && (
                  <ChevronRight className="w-3.5 h-3.5 text-brand-400 opacity-60" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Promo card */}
        <div className="mx-3 mb-3 p-4 rounded-xl bg-gradient-to-br from-brand-600/20 to-purple-600/20 border border-brand-600/30">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-600/30 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-4 h-4 text-brand-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-900 mb-0.5">
                Plan Professionnel
              </p>
              <p className="text-[10px] text-gray-600 leading-relaxed">
                Factures illimitées, rapports avancés
              </p>
              <button className="mt-2 text-[10px] font-semibold text-brand-400 hover:text-brand-300 transition-colors">
                Mettre à niveau →
              </button>
            </div>
          </div>
        </div>

        {/* Bottom nav */}
        <div className="px-3 pb-4 border-t border-surface-border pt-3 space-y-1">
          {bottomItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  active
                    ? "text-gray-900 bg-gray-100 border border-surface-border"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* User profile */}
          <div className="mt-3 flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group">
            <div className="w-8 h-8 rounded-xl  flex-shrink-0">
              FM
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-800 truncate">Franck M.</p>
              <p className="text-[10px] text-gray-500 truncate">Administrateur</p>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-gray-600 transition-colors" />
          </div>
        </div>
      </aside>
    </>
  );
}
