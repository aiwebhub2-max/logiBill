"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Send,
  User,
  Calendar,
  FileText,
  Package,
  Eye,
} from "lucide-react";
import { formatFC } from "@/lib/utils";
import { TVA_RATE } from "@/lib/constants";
import { InvoiceLine } from "@/types";
import { cn } from "@/lib/utils";
import { InvoicePreview } from "@/components/dashboard/InvoicePreview";
import { createInvoice } from "@/app/actions/invoices";
import { useRouter } from "next/navigation";

interface FormLine extends Omit<InvoiceLine, "id" | "invoice_id"> {
  id: string;
}

const emptyLine = (): FormLine => ({
  id: crypto.randomUUID(),
  description: "",
  quantity: 0,
  unit_price: 0,
  position: 0,
});

export default function NewInvoiceClient({ 
  initialClients, 
  initialInventoryItems 
}: { 
  initialClients: any[], 
  initialInventoryItems: any[] 
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientName, setClientName] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [issueDate, setIssueDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [lines, setLines] = useState<FormLine[]>([emptyLine()]);
  const [taxRate] = useState(TVA_RATE);

  // Calculations
  const subtotal = lines.reduce((sum, l) => sum + l.quantity * l.unit_price, 0);
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const addLine = () => setLines((l) => [...l, emptyLine()]);

  const removeLine = (id: string) =>
    setLines((l) => l.filter((line) => line.id !== id));

  const updateLine = (id: string, field: keyof FormLine, value: string | number) => {
    setLines((lines) =>
      lines.map((l) => (l.id === id ? { ...l, [field]: value } : l))
    );
  };

  const handleItemSelect = (lineId: string, itemId: string) => {
    const item = initialInventoryItems.find((i) => i.id === itemId);
    if (item) {
      setLines((lines) =>
        lines.map((l) =>
          l.id === lineId
            ? { ...l, description: item.name, unit_price: item.unit_price, item_id: item.id }
            : l
        )
      );
    }
  };

  const handleSubmit = async (status: "draft" | "sent" = "draft") => {
    try {
      setIsSubmitting(true);
      
      // Trouver le client ou s'attendre à ce qu'il soit créé plus tard (pour l'instant, on assume qu'il existe)
      let clientId = initialClients.find(c => c.name.toLowerCase() === clientName.toLowerCase())?.id;
      
      if (!clientId) {
        // En vrai, il faudrait appeler createClient ici
        alert("La création automatique de client arrive bientôt. Veuillez choisir un client existant pour l'instant.");
        setIsSubmitting(false);
        return;
      }

      await createInvoice({
        client_id: clientId,
        invoice_number: "FAC-2024-" + Math.floor(Math.random() * 10000).toString().padStart(4, "0"), // temporary
        issue_date: issueDate,
        due_date: dueDate || issueDate,
        status,
        tax_rate: taxRate,
        notes,
      }, lines);

      router.push("/invoices");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la création de la facture");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/invoices" className="btn-icon">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Nouvelle facture</h1>
            <p className="text-gray-500 text-sm">Créer une facture professionnelle</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowPreview(true)} className="btn-secondary text-sm" disabled={isSubmitting}>
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Aperçu</span>
          </button>
          <button onClick={() => handleSubmit("draft")} className="btn-secondary text-sm" disabled={isSubmitting} id="save-draft-btn">
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">Enregistrer brouillon</span>
          </button>
          <button onClick={() => handleSubmit("sent")} className="btn-primary text-sm" disabled={isSubmitting} id="send-invoice-btn">
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Envoyer</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main form */}
        <div className="lg:col-span-2 space-y-5">
          
          {/* Client selection */}
          <div className="card p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-brand-600/20 flex items-center justify-center">
                <User className="w-4 h-4 text-brand-400" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900">Client</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Nom du client *</label>
                <input
                  list="clients-list"
                  id="invoice-client-select"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="input"
                  placeholder="Tapez un nom ou choisissez..."
                />
                <datalist id="clients-list">
                  {initialClients.map((c) => (
                    <option key={c.id} value={c.name} />
                  ))}
                </datalist>
              </div>

              {clientName && (
                <div className="p-3 rounded-xl bg-surface-muted border border-surface-border">
                  {(() => {
                    const client = initialClients.find(
                      (c) => c.name.toLowerCase() === clientName.toLowerCase()
                    );
                    if (client) {
                      return (
                        <div>
                          <p className="text-xs font-semibold text-gray-900">{client.name}</p>
                          {client.email && <p className="text-xs text-gray-500 mt-0.5">{client.email}</p>}
                          {client.phone && <p className="text-xs text-gray-500">{client.phone}</p>}
                          {client.address && <p className="text-xs text-gray-500">{client.address}</p>}
                        </div>
                      );
                    }
                    return (
                      <div>
                        <p className="text-xs font-semibold text-gray-900">{clientName}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Nouveau client (sera créé)</p>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="card p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-purple-600/20 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-purple-400" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900">Dates</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label" htmlFor="issue-date-input">Date d&apos;émission *</label>
                <input
                  id="issue-date-input"
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="input"
                />
              </div>
              <div>
                <label className="label" htmlFor="due-date-input">Date d&apos;échéance *</label>
                <input
                  id="due-date-input"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="input"
                />
              </div>
            </div>
          </div>

          {/* Invoice lines */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <Package className="w-4 h-4 text-emerald-400" />
                </div>
                <h2 className="text-sm font-semibold text-gray-900">Articles / Prestations</h2>
              </div>
              <button
                onClick={addLine}
                className="btn-secondary text-xs py-1.5"
                id="add-line-btn"
              >
                <Plus className="w-3.5 h-3.5" />
                Ajouter une ligne
              </button>
            </div>

            {/* Column headers */}
            <div className="hidden sm:grid grid-cols-12 gap-2 px-1 mb-2">
              <div className="col-span-5 text-xs text-gray-500 font-medium uppercase tracking-wider">Article</div>
              <div className="col-span-3 text-xs text-gray-500 font-medium uppercase tracking-wider text-center">Qté</div>
              <div className="col-span-3 text-xs text-gray-500 font-medium uppercase tracking-wider text-right">Prix unitaire</div>
              <div className="col-span-1" />
            </div>

            <div className="space-y-2">
              {lines.map((line, index) => {
                const lineTotal = line.quantity * line.unit_price;
                return (
                  <div
                    key={line.id}
                    className="grid grid-cols-12 gap-2 p-3 rounded-xl bg-surface-muted border border-surface-border items-start"
                  >
                    {/* Article picker */}
                    <div className="col-span-12 sm:col-span-5">
                      <label className="sm:hidden label">Article stock</label>
                      <select
                        onChange={(e) => handleItemSelect(line.id, e.target.value)}
                        className="select text-xs"
                        id={`line-item-${index}`}
                      >
                        <option value="">Stock...</option>
                        {initialInventoryItems.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Quantity */}
                    <div className="col-span-5 sm:col-span-3">
                      <label className="sm:hidden label">Quantité</label>
                      <input
                        type="number"
                        min="1"
                        value={line.quantity || ""}
                        placeholder="0"
                        onChange={(e) => updateLine(line.id, "quantity", parseFloat(e.target.value) || 0)}
                        className="input text-sm text-center"
                        id={`line-qty-${index}`}
                      />
                    </div>

                    {/* Unit price */}
                    <div className="col-span-6 sm:col-span-3">
                      <label className="sm:hidden label">Prix unitaire (FC)</label>
                      <input
                        type="number"
                        min="0"
                        value={line.unit_price || ""}
                        placeholder="0"
                        onChange={(e) => updateLine(line.id, "unit_price", parseFloat(e.target.value) || 0)}
                        className="input text-sm text-right"
                        id={`line-price-${index}`}
                      />
                    </div>

                    {/* Delete */}
                    <div className="col-span-1 flex items-end justify-center pb-0.5">
                      <button
                        onClick={() => removeLine(line.id)}
                        disabled={lines.length === 1}
                        className={cn(
                          "btn-icon transition-all",
                          lines.length === 1 && "opacity-30 cursor-not-allowed"
                        )}
                        id={`remove-line-${index}`}
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                      </button>
                    </div>

                    {/* Line total */}
                    {lineTotal > 0 && (
                      <div className="col-span-12 flex justify-end">
                        <span className="text-xs text-gray-500">
                          Total ligne:{" "}
                          <span className="text-gray-900 font-semibold">{formatFC(lineTotal)}</span>
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div className="card p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <FileText className="w-4 h-4 text-amber-400" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900">Notes</h2>
            </div>
            <textarea
              id="invoice-notes"
              placeholder="Conditions de paiement, remarques particulières..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="input resize-none text-sm"
            />
          </div>
        </div>

        {/* Summary sidebar */}
        <div className="space-y-4">
          
          {/* Invoice number */}
          <div className="card p-5">
            <h2 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">
              Référence
            </h2>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-brand-600/10 border border-brand-600/20">
              <FileText className="w-4 h-4 text-brand-400 flex-shrink-0" />
              <span className="text-sm font-bold text-gray-900">FAC-2024-0007</span>
            </div>
          </div>

          {/* Totals */}
          <div className="card p-5 sticky top-20">
            <h2 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-4">
              Récapitulatif
            </h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Sous-total HT</span>
                <span className="text-gray-800 font-medium">{formatFC(subtotal)}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  TVA ({Math.round(taxRate * 100)}%)
                </span>
                <span className="text-gray-800 font-medium">{formatFC(tax)}</span>
              </div>

              <div className="glow-line my-2" />

              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900">Total TTC</span>
                <span className="text-lg font-bold text-gray-900">{formatFC(total)}</span>
              </div>
            </div>

            <div className="mt-5 space-y-2.5">
              <button
                className="btn-primary w-full justify-center text-sm"
                id="submit-invoice-btn"
                onClick={() => handleSubmit("sent")}
                disabled={isSubmitting}
              >
                <Send className="w-4 h-4" />
                Créer et envoyer
              </button>
              <button
                className="btn-secondary w-full justify-center text-sm"
                id="save-invoice-draft-btn"
                onClick={() => handleSubmit("draft")}
                disabled={isSubmitting}
              >
                <Save className="w-4 h-4" />
                Sauvegarder brouillon
              </button>
            </div>

            {/* Tax info */}
            <div className="mt-4 p-3 rounded-xl bg-surface-muted border border-surface-border">
              <p className="text-[10px] text-gray-500 leading-relaxed">
                TVA de 18% appliquée conformément à la législation fiscale de la RDC.
                Les montants sont affichés en Franc Congolais (FC).
              </p>
            </div>
          </div>
        </div>
      </div>

      {showPreview && (
        <InvoicePreview
          clientName={clientName}
          clientEmail={initialClients.find(c => c.name.toLowerCase() === clientName.toLowerCase())?.email}
          clientPhone={initialClients.find(c => c.name.toLowerCase() === clientName.toLowerCase())?.phone}
          clientAddress={initialClients.find(c => c.name.toLowerCase() === clientName.toLowerCase())?.address}
          issueDate={issueDate}
          dueDate={dueDate}
          notes={notes}
          lines={lines}
          subtotal={subtotal}
          tax={tax}
          total={total}
          taxRate={taxRate}
          invoiceNumber="FAC-2024-0007"
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}
