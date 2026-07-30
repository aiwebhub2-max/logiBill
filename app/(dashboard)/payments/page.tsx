import Link from "next/link";
import { CreditCard, ArrowLeft } from "lucide-react";
import { getPayments } from "@/app/actions/payments";
import { formatFC, formatDate } from "@/lib/utils";

const methodLabels: Record<string, string> = {
  cash: "Espèces",
  mobile_money: "Mobile Money",
  bank_transfer: "Virement bancaire",
  card: "Carte bancaire",
};

export default async function PaymentsPage() {
  const payments = await getPayments();

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Paiements</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {payments.length} paiements enregistrés
          </p>
        </div>
      </div>

      <div className="card">
        <div className="p-4 border-b border-surface-border">
          <h2 className="text-sm font-semibold text-gray-900">Historique des paiements</h2>
        </div>
        <div className="table-container">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-border">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Facture</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Méthode</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Montant</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="border-b border-surface-border/50 hover:bg-gray-100/50 transition-colors">
                  <td className="px-4 py-3.5">
                    <Link href={`/invoices/${payment.invoice_id}`} className="text-brand-400 hover:text-brand-300 font-semibold">
                      {payment.invoice?.invoice_number || payment.invoice_id}
                    </Link>
                  </td>
                  <td className="px-4 py-3.5 text-gray-600">{formatDate(payment.payment_date)}</td>
                  <td className="px-4 py-3.5">
                    <span className="badge bg-brand-600/10 text-brand-400 border border-brand-600/20">
                      {methodLabels[payment.method] || payment.method}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <span className="font-bold text-emerald-400">{formatFC(payment.amount)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
