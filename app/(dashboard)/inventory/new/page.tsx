import Link from "next/link";
import { ArrowLeft, Save, Package, Tag, Hash, DollarSign, Layers, AlertTriangle } from "lucide-react";
import { createInventoryItem } from "@/app/actions/inventory";
import { redirect } from "next/navigation";

export default function NewInventoryItemPage() {
  async function handleSubmit(formData: FormData) {
    "use server";
    await createInventoryItem(formData);
    redirect("/inventory");
  }

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/inventory" className="btn-icon">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Nouvel article</h1>
      </div>

      <div className="card p-5 sm:p-8">
        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            
            {/* Informations principales */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="label" htmlFor="name">
                  <div className="flex items-center gap-2 mb-1 text-gray-700">
                    <Package className="w-4 h-4 text-brand-400" />
                    Nom de l&apos;article *
                  </div>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Ex: Ordinateur Portable HP"
                  className="input"
                />
              </div>

              <div>
                <label className="label" htmlFor="category">
                  <div className="flex items-center gap-2 mb-1 text-gray-700">
                    <Layers className="w-4 h-4 text-purple-400" />
                    Catégorie
                  </div>
                </label>
                <input
                  id="category"
                  name="category"
                  type="text"
                  placeholder="Ex: Électronique"
                  className="input"
                />
              </div>

              <div>
                <label className="label" htmlFor="sku">
                  <div className="flex items-center gap-2 mb-1 text-gray-700">
                    <Hash className="w-4 h-4 text-gray-400" />
                    SKU / Référence
                  </div>
                </label>
                <input
                  id="sku"
                  name="sku"
                  type="text"
                  placeholder="Ex: HP-ENVY-13"
                  className="input"
                />
              </div>
            </div>

            <div className="h-px bg-surface-border my-4" />

            {/* Tarification et Stock */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="label" htmlFor="unit_price">
                  <div className="flex items-center gap-2 mb-1 text-gray-700">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    Prix unitaire *
                  </div>
                </label>
                <input
                  id="unit_price"
                  name="unit_price"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  placeholder="0.00"
                  className="input"
                />
              </div>

              <div>
                <label className="label" htmlFor="stock_quantity">
                  <div className="flex items-center gap-2 mb-1 text-gray-700">
                    <Tag className="w-4 h-4 text-blue-400" />
                    Quantité en stock *
                  </div>
                </label>
                <input
                  id="stock_quantity"
                  name="stock_quantity"
                  type="number"
                  min="0"
                  required
                  defaultValue={0}
                  className="input"
                />
              </div>

              <div>
                <label className="label" htmlFor="stock_alert_threshold">
                  <div className="flex items-center gap-2 mb-1 text-gray-700">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    Seuil d&apos;alerte *
                  </div>
                </label>
                <input
                  id="stock_alert_threshold"
                  name="stock_alert_threshold"
                  type="number"
                  min="0"
                  required
                  defaultValue={5}
                  className="input"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-surface-border flex justify-end gap-3">
            <Link href="/inventory">
              <button type="button" className="btn-secondary">
                Annuler
              </button>
            </Link>
            <button type="submit" className="btn-primary">
              <Save className="w-4 h-4" />
              Ajouter l&apos;article
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
