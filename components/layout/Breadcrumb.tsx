"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

const pathLabels: Record<string, string> = {
  dashboard: "Tableau de bord",
  invoices: "Factures",
  new: "Nouveau",
  clients: "Clients",
  inventory: "Inventaire",
  payments: "Paiements",
  settings: "Paramètres",
};

export default function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length <= 1) return null;

  return (
    <nav className="flex items-center gap-1.5 text-xs text-gray-500 px-6 py-2 border-b border-surface-border bg-surface/50">
      <Link href="/dashboard" className="hover:text-gray-700 transition-colors">
        <Home className="w-3.5 h-3.5" />
      </Link>
      {segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/");
        const isLast = index === segments.length - 1;
        const label = pathLabels[segment] || segment;

        return (
          <span key={segment} className="flex items-center gap-1.5">
            <ChevronRight className="w-3 h-3 text-gray-700" />
            {isLast ? (
              <span className="text-gray-700 font-medium">{label}</span>
            ) : (
              <Link
                href={href}
                className="hover:text-gray-700 transition-colors"
              >
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
