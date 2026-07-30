import { X, Printer } from "lucide-react";
import { formatFC, formatDate } from "@/lib/utils";

interface InvoicePreviewProps {
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  clientAddress?: string;
  issueDate: string;
  dueDate: string;
  notes: string;
  lines: any[];
  subtotal: number;
  tax: number;
  total: number;
  taxRate: number;
  invoiceNumber: string;
  onClose: () => void;
}

export function InvoicePreview({
  clientName,
  clientEmail,
  clientPhone,
  clientAddress,
  issueDate,
  dueDate,
  notes,
  lines,
  subtotal,
  tax,
  total,
  taxRate,
  invoiceNumber,
  onClose,
}: InvoicePreviewProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-semibold text-gray-900">Aperçu de la facture</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="btn-secondary py-1.5 px-3 text-sm"
            >
              <Printer className="w-4 h-4" />
              Imprimer
            </button>
            <button onClick={onClose} className="btn-icon bg-white border border-gray-200">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Invoice Content (A4 style) */}
        <div className="overflow-y-auto p-4 sm:p-8 bg-gray-50 flex-1 printable-area">
          <div className="max-w-[21cm] min-h-[29.7cm] mx-auto bg-white p-8 sm:p-12 shadow-sm rounded-lg">
            
            {/* Top Section */}
            <div className="flex justify-between items-start mb-12">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">FACTURE</h1>
                <p className="text-gray-500 mt-1 font-medium">{invoiceNumber}</p>
              </div>
              <div className="text-right text-sm">
                <p className="font-bold text-gray-900 text-lg">Ma Super Entreprise</p>
                <p className="text-gray-500 mt-1">123 Rue de la République</p>
                <p className="text-gray-500">contact@masuperentreprise.com</p>
                <p className="text-gray-500">+33 1 23 45 67 89</p>
              </div>
            </div>

            {/* Info Section */}
            <div className="flex justify-between items-start mb-12 pb-8 border-b border-gray-100">
              <div className="space-y-1 text-sm">
                <p className="text-gray-500 font-medium mb-2 uppercase tracking-wider text-xs">Facturé à</p>
                <p className="font-bold text-gray-900 text-base">{clientName || "Client inconnu"}</p>
                {clientAddress && <p className="text-gray-600">{clientAddress}</p>}
                {clientEmail && <p className="text-gray-600">{clientEmail}</p>}
                {clientPhone && <p className="text-gray-600">{clientPhone}</p>}
              </div>
              <div className="space-y-3 text-sm text-right">
                <div>
                  <p className="text-gray-500 font-medium text-xs uppercase tracking-wider mb-1">Date d&apos;émission</p>
                  <p className="font-medium text-gray-900">{issueDate ? formatDate(issueDate) : "-"}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium text-xs uppercase tracking-wider mb-1">Date d&apos;échéance</p>
                  <p className="font-medium text-gray-900">{dueDate ? formatDate(dueDate) : "-"}</p>
                </div>
              </div>
            </div>

            {/* Table */}
            <table className="w-full text-left text-sm mb-8">
              <thead>
                <tr className="border-b-2 border-gray-900">
                  <th className="py-3 font-semibold text-gray-900">Description</th>
                  <th className="py-3 font-semibold text-gray-900 text-center">Qté</th>
                  <th className="py-3 font-semibold text-gray-900 text-right">Prix Unitaire</th>
                  <th className="py-3 font-semibold text-gray-900 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line, index) => {
                  const lineTotal = line.quantity * line.unit_price;
                  if (!line.description && !line.unit_price) return null; // Skip totally empty lines
                  return (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-4 text-gray-800">{line.description || "-"}</td>
                      <td className="py-4 text-gray-600 text-center">{line.quantity}</td>
                      <td className="py-4 text-gray-600 text-right">{formatFC(line.unit_price || 0)}</td>
                      <td className="py-4 font-medium text-gray-900 text-right">{formatFC(lineTotal)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end mb-12">
              <div className="w-1/2 sm:w-1/3 space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total HT</span>
                  <span className="font-medium text-gray-900">{formatFC(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>TVA ({Math.round(taxRate * 100)}%)</span>
                  <span className="font-medium text-gray-900">{formatFC(tax)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-gray-900 pt-3 border-t border-gray-200">
                  <span>Total TTC</span>
                  <span>{formatFC(total)}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {notes && (
              <div className="text-sm text-gray-500 pt-8 border-t border-gray-100">
                <p className="font-medium text-gray-900 mb-2">Notes / Conditions</p>
                <p className="whitespace-pre-line">{notes}</p>
              </div>
            )}

            <div className="mt-16 text-center text-xs text-gray-400">
              <p>Merci pour votre confiance.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
