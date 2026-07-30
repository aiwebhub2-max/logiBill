"use client";

import Link from "next/link";
import { Invoice, InvoiceStatus } from "@/types";
import { formatFC, formatDate, invoiceStatusConfig } from "@/lib/utils";
import { Eye, MoreHorizontal, Send, CheckCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface InvoiceTableProps {
  invoices: Invoice[];
  limit?: number;
  showActions?: boolean;
}

function StatusBadge({ status }: { status: InvoiceStatus }) {
  const config = invoiceStatusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
        config.bgColor,
        config.textColor
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", config.dotColor)} />
      {config.label}
    </span>
  );
}

export default function InvoiceTable({
  invoices,
  limit,
  showActions = true,
}: InvoiceTableProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const displayed = limit ? invoices.slice(0, limit) : invoices;

  return (
    <div className="table-container rounded-xl">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-surface-border">
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              N° Facture
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Client
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
              Date émission
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
              Échéance
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Montant
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Statut
            </th>
            {showActions && (
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {displayed.map((invoice, index) => (
            <tr
              key={invoice.id}
              className={cn(
                "border-b border-surface-border/50 transition-colors duration-150 hover:bg-gray-100/50",
                "animate-fade-in"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Invoice number */}
              <td className="px-4 py-3.5">
                <Link
                  href={`/invoices/${invoice.id}`}
                  className="text-brand-400 font-semibold hover:text-brand-300 transition-colors"
                  id={`invoice-link-${invoice.id}`}
                >
                  {invoice.invoice_number}
                </Link>
              </td>

              {/* Client */}
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-600/40 to-purple-600/40 flex items-center justify-center text-[10px] font-bold text-brand-300 flex-shrink-0">
                    {invoice.client?.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-gray-800 truncate max-w-[150px]">
                    {invoice.client?.name || "—"}
                  </span>
                </div>
              </td>

              {/* Date émission */}
              <td className="px-4 py-3.5 text-gray-600 hidden md:table-cell">
                {formatDate(invoice.issue_date)}
              </td>

              {/* Échéance */}
              <td className="px-4 py-3.5 hidden lg:table-cell">
                <span
                  className={cn(
                    "text-sm",
                    invoice.status === "overdue"
                      ? "text-red-400 font-medium"
                      : "text-gray-600"
                  )}
                >
                  {formatDate(invoice.due_date)}
                </span>
              </td>

              {/* Montant */}
              <td className="px-4 py-3.5 text-right">
                <span className="font-bold text-gray-900">
                  {formatFC(invoice.total || 0)}
                </span>
              </td>

              {/* Statut */}
              <td className="px-4 py-3.5 text-center">
                <StatusBadge status={invoice.status} />
              </td>

              {/* Actions */}
              {showActions && (
                <td className="px-4 py-3.5">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/invoices/${invoice.id}`} id={`view-invoice-${invoice.id}`}>
                      <button className="btn-icon" title="Voir la facture">
                        <Eye className="w-4 h-4" />
                      </button>
                    </Link>

                    <div className="relative">
                      <button
                        id={`more-actions-${invoice.id}`}
                        className="btn-icon"
                        title="Plus d'actions"
                        onClick={() =>
                          setOpenMenu(openMenu === invoice.id ? null : invoice.id)
                        }
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>

                      {openMenu === invoice.id && (
                        <div className="absolute right-0 top-full mt-1 w-44 card border border-surface-border shadow-card-hover z-10 animate-fade-in overflow-hidden">
                          {invoice.status === "draft" && (
                            <button className="flex items-center gap-2.5 w-full px-3 py-2.5 text-xs text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                              <Send className="w-3.5 h-3.5" />
                              Envoyer au client
                            </button>
                          )}
                          {invoice.status !== "paid" && (
                            <button className="flex items-center gap-2.5 w-full px-3 py-2.5 text-xs text-emerald-400 hover:text-emerald-300 hover:bg-gray-100 transition-colors">
                              <CheckCircle className="w-3.5 h-3.5" />
                              Marquer payée
                            </button>
                          )}
                          <Link
                            href={`/invoices/${invoice.id}`}
                            className="flex items-center gap-2.5 px-3 py-2.5 text-xs text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Voir / Modifier
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {displayed.length === 0 && (
        <div className="empty-state py-12">
          <p className="text-gray-500 text-sm">Aucune facture à afficher</p>
        </div>
      )}
    </div>
  );
}
