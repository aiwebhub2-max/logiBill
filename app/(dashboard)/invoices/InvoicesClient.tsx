"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import InvoiceTable from "@/components/dashboard/InvoiceTable";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  draft: "bg-gray-500/20 text-gray-600 border-gray-500/20",
  sent: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  paid: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  overdue: "bg-red-500/20 text-red-400 border-red-500/30",
  all: "bg-brand-600/20 text-brand-400 border-brand-600/30",
};

export default function InvoicesClient({ initialInvoices }: { initialInvoices: any[] }) {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const STATUS_FILTERS = [
    { value: "all", label: "Toutes", count: initialInvoices.length },
    { value: "draft", label: "Brouillon", count: initialInvoices.filter(i => i.status === "draft").length },
    { value: "sent", label: "Envoyées", count: initialInvoices.filter(i => i.status === "sent").length },
    { value: "paid", label: "Payées", count: initialInvoices.filter(i => i.status === "paid").length },
    { value: "overdue", label: "En retard", count: initialInvoices.filter(i => i.status === "overdue").length },
  ];

  const filtered = initialInvoices.filter((inv) => {
    const matchStatus = activeFilter === "all" || inv.status === activeFilter;
    const matchSearch =
      search === "" ||
      inv.invoice_number?.toLowerCase().includes(search.toLowerCase()) ||
      inv.client?.name?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-[1400px] mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Factures</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {initialInvoices.length} factures au total
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary text-sm" id="export-invoices-btn">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exporter</span>
          </button>
          <Link href="/invoices/new">
            <button className="btn-primary text-sm" id="new-invoice-page-btn">
              <Plus className="w-4 h-4" />
              Nouvelle facture
            </button>
          </Link>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter.value}
            id={`filter-${filter.value}`}
            onClick={() => setActiveFilter(filter.value)}
            className={cn(
              "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border whitespace-nowrap transition-all duration-200",
              activeFilter === filter.value
                ? statusColors[filter.value]
                : "bg-surface-muted border-surface-border text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            )}
          >
            {filter.label}
            <span
              className={cn(
                "px-1.5 py-0.5 rounded-full text-[10px] font-bold",
                activeFilter === filter.value
                  ? "bg-white/10"
                  : "bg-surface-border"
              )}
            >
              {filter.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search + table */}
      <div className="card">
        {/* Search bar */}
        <div className="flex items-center gap-3 p-4 border-b border-surface-border">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 w-4 h-4 text-gray-500 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="invoice-search-input"
              type="text"
              placeholder="Rechercher par N°, client..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-9 text-sm"
            />
          </div>
          <button className="btn-secondary text-sm py-2" id="invoice-filter-btn">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filtres</span>
          </button>
        </div>

        {/* Table */}
        <InvoiceTable invoices={filtered} showActions={true} />

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-surface-border">
          <p className="text-xs text-gray-500">
            Affichage de {filtered.length} sur {initialInvoices.length} factures
          </p>
          <div className="flex items-center gap-2">
            <button className="btn-secondary text-xs py-1.5 px-3" disabled id="prev-page-btn">
              <ChevronLeft className="w-3.5 h-3.5" />
              Précédent
            </button>
            <div className="flex items-center gap-1">
              <button className="w-7 h-7 rounded-lg bg-brand-600/20 border border-brand-600/30 text-brand-400 text-xs font-semibold">
                1
              </button>
            </div>
            <button className="btn-secondary text-xs py-1.5 px-3" disabled id="next-page-btn">
              Suivant
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
