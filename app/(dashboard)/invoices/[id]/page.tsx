import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Printer,
  Send,
  CheckCircle,
  Download,
  Calendar,
  User,
  FileText,
  Clock,
} from "lucide-react";
import { mockInvoices } from "@/lib/mock-data";
import { formatFC, formatDate, invoiceStatusConfig } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface PageProps {
  params: { id: string };
}

export default function InvoiceDetailPage({ params }: PageProps) {
  const invoice = mockInvoices.find((i) => i.id === params.id);

  if (!invoice) notFound();

  const statusConfig = invoiceStatusConfig[invoice.status];

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/invoices" className="btn-icon">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold text-gray-900">{invoice.invoice_number}</h1>
              <span className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
                statusConfig.bgColor,
                statusConfig.textColor
              )}>
                <span className={cn("w-1.5 h-1.5 rounded-full", statusConfig.dotColor)} />
                {statusConfig.label}
              </span>
            </div>
            <p className="text-gray-500 text-sm mt-0.5">
              Émise le {formatDate(invoice.issue_date)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary text-sm" id="print-invoice-btn">
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Imprimer</span>
          </button>
          <button className="btn-secondary text-sm" id="download-invoice-btn">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">PDF</span>
          </button>
          {invoice.status !== "paid" && (
            <button className="btn-primary text-sm" id="mark-paid-btn">
              <CheckCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Marquer payée</span>
            </button>
          )}
        </div>
      </div>

      {/* Invoice card */}
      <div className="card p-6 sm:p-8 space-y-6">
        
        {/* Company + Client header */}
        <div className="flex flex-col sm:flex-row justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center">
                <span className="text-xs font-bold text-gray-900">ME</span>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">MonEntreprise SARL</p>
                <p className="text-xs text-gray-500">NRC: KIN-24-12345</p>
              </div>
            </div>
            <div className="text-xs text-gray-500 space-y-0.5">
              <p>Boulevard du 30 Juin, Kinshasa</p>
              <p>facturation@monentreprise.cd</p>
              <p>+243 81 000 0000</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Facturé à</p>
            <p className="text-sm font-bold text-gray-900">{invoice.client?.name}</p>
            <div className="text-xs text-gray-500 space-y-0.5 mt-1">
              {invoice.client?.email && <p>{invoice.client.email}</p>}
              {invoice.client?.phone && <p>{invoice.client.phone}</p>}
              {invoice.client?.address && <p>{invoice.client.address}</p>}
            </div>
          </div>
        </div>

        <div className="glow-line" />

        {/* Invoice meta */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: FileText, label: "N° Facture", value: invoice.invoice_number },
            { icon: Calendar, label: "Date émission", value: formatDate(invoice.issue_date) },
            { icon: Clock, label: "Échéance", value: formatDate(invoice.due_date) },
            { icon: User, label: "Client", value: invoice.client?.name || "—" },
          ].map((meta) => {
            const Icon = meta.icon;
            return (
              <div key={meta.label} className="p-3 rounded-xl bg-surface-muted border border-surface-border">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Icon className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
                    {meta.label}
                  </span>
                </div>
                <p className="text-xs font-semibold text-gray-900 truncate">{meta.value}</p>
              </div>
            );
          })}
        </div>

        {/* Invoice lines */}
        <div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-border">
                <th className="pb-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                <th className="pb-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Qté</th>
                <th className="pb-2 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Prix unit.</th>
                <th className="pb-2 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/50">
              {invoice.lines.map((line) => (
                <tr key={line.id}>
                  <td className="py-3 text-gray-800">{line.description}</td>
                  <td className="py-3 text-center text-gray-600">{line.quantity}</td>
                  <td className="py-3 text-right text-gray-600">{formatFC(line.unit_price)}</td>
                  <td className="py-3 text-right font-semibold text-gray-900">
                    {formatFC(line.quantity * line.unit_price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-full max-w-xs space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Sous-total HT</span>
              <span className="text-gray-800">{formatFC(invoice.subtotal || 0)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">TVA (18%)</span>
              <span className="text-gray-800">{formatFC(invoice.tax_amount || 0)}</span>
            </div>
            <div className="glow-line" />
            <div className="flex justify-between">
              <span className="font-bold text-gray-900">Total TTC</span>
              <span className="text-xl font-bold text-gray-900">{formatFC(invoice.total || 0)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="p-4 rounded-xl bg-surface-muted border border-surface-border">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1.5">Notes</p>
            <p className="text-sm text-gray-700">{invoice.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
