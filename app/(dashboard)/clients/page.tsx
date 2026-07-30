import Link from "next/link";
import { ArrowLeft, Users, Plus, Phone, Mail, MapPin } from "lucide-react";
import { getClients } from "@/app/actions/clients";
import { formatFC } from "@/lib/utils";

export default async function ClientsPage() {
  const clients = await getClients();

  return (
    <div className="p-4 sm:p-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-600/20 flex items-center justify-center">
            <Users className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
            <p className="text-gray-500 text-sm">Gérez votre liste de clients</p>
          </div>
        </div>
        <Link href="/clients/new">
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nouveau Client
          </button>
        </Link>
      </div>

      <div className="card overflow-hidden">
        {clients.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400 opacity-50" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Aucun client
            </h2>
            <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
              Vous n&apos;avez pas encore ajouté de client.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-medium">Nom du Client</th>
                  <th className="px-6 py-4 font-medium">Contact</th>
                  <th className="px-6 py-4 font-medium">Adresse</th>
                  <th className="px-6 py-4 font-medium text-right">Total Facturé</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {client.name}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      <div className="flex flex-col gap-1">
                        {client.email && (
                          <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {client.email}</span>
                        )}
                        {client.phone && (
                          <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {client.phone}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {client.address || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-medium">
                      {formatFC(client.total_invoiced || 0)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/clients/${client.id}`} className="text-brand-600 hover:text-brand-700 font-medium">
                        Voir
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
