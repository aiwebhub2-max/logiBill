import Link from "next/link";
import { Package, AlertTriangle, ArrowLeft, Plus } from "lucide-react";
import { formatFC } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { getInventoryItems } from "@/app/actions/inventory";
import DeleteButton from "./DeleteButton";

export default async function InventoryPage() {
  const inventoryItems = await getInventoryItems();

  const stockAlerts = inventoryItems.filter(
    (item) => item.stock_quantity <= item.stock_alert_threshold
  );

  const totalStockValue = inventoryItems.reduce(
    (sum, item) => sum + item.unit_price * item.stock_quantity,
    0
  );

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-[1400px] mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventaire</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {inventoryItems.length} articles · Valeur totale:{" "}
            <span className="text-gray-900 font-semibold">{formatFC(totalStockValue)}</span>
          </p>
        </div>
        <Link href="/inventory/new">
          <button className="btn-primary text-sm" id="add-item-btn">
            <Plus className="w-4 h-4" />
            Ajouter un article
          </button>
        </Link>
      </div>

      {/* Stock alert banner */}
      {stockAlerts.length > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-300">
              {stockAlerts.length} article{stockAlerts.length > 1 ? "s" : ""} en dessous du seuil d&apos;alerte
            </p>
            <p className="text-xs text-red-400/70 mt-0.5">
              {stockAlerts.map((i) => i.name).join(", ")}
            </p>
          </div>
        </div>
      )}

      {/* Items table */}
      <div className="card">
        <div className="p-4 border-b border-surface-border">
          <h2 className="text-sm font-semibold text-gray-900">Liste des articles</h2>
        </div>
        <div className="table-container">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-border">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Article</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">SKU</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Catégorie</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Prix unit.</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Valeur stock</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventoryItems.map((item, index) => {
                const isLowStock = item.stock_quantity <= item.stock_alert_threshold;
                const stockValue = item.unit_price * item.stock_quantity;
                const stockPercent = Math.min(100, Math.round((item.stock_quantity / (item.stock_alert_threshold * 3)) * 100));

                return (
                  <tr
                    key={item.id}
                    className="border-b border-surface-border/50 hover:bg-gray-100/50 transition-colors animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                          isLowStock ? "bg-red-500/15" : "bg-emerald-500/15"
                        )}>
                          <Package className={cn("w-4 h-4", isLowStock ? "text-red-400" : "text-emerald-400")} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{item.name}</p>
                          {item.description && (
                            <p className="text-[10px] text-gray-500 truncate max-w-[160px]">{item.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <span className="text-xs text-gray-600 font-mono bg-surface-muted px-2 py-0.5 rounded">
                        {item.sku || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <span className="text-xs text-gray-600">{item.category || "—"}</span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className="font-semibold text-gray-900">{formatFC(item.unit_price)}</span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className={cn(
                          "text-sm font-bold",
                          isLowStock ? "text-red-400" : "text-gray-900"
                        )}>
                          {item.stock_quantity}
                        </span>
                        <div className="w-16 h-1 bg-surface-muted rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all",
                              isLowStock ? "bg-red-500" : "bg-emerald-500"
                            )}
                            style={{ width: `${stockPercent}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right hidden sm:table-cell">
                      <span className="font-semibold text-gray-700">{formatFC(stockValue)}</span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {isLowStock ? (
                        <span className="badge badge-overdue">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                          Faible
                        </span>
                      ) : (
                        <span className="badge badge-paid">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          OK
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <DeleteButton id={item.id} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
