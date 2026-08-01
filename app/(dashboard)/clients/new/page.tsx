import Link from "next/link";
import { ArrowLeft, Save, User, Mail, Phone, MapPin } from "lucide-react";
import { createClient } from "@/app/actions/clients";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default function NewClientPage() {
  async function handleSubmit(formData: FormData) {
    "use server";
    await createClient(formData);
    redirect("/clients");
  }

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/clients" className="btn-icon">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Nouveau client</h1>
      </div>

      <div className="card p-5 sm:p-8">
        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="label" htmlFor="name">
                <div className="flex items-center gap-2 mb-1 text-gray-700">
                  <User className="w-4 h-4 text-brand-400" />
                  Nom complet ou Entreprise *
                </div>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Ex: Entreprise SARL"
                className="input"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label" htmlFor="email">
                  <div className="flex items-center gap-2 mb-1 text-gray-700">
                    <Mail className="w-4 h-4 text-purple-400" />
                    Adresse Email
                  </div>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="contact@exemple.com"
                  className="input"
                />
              </div>

              <div>
                <label className="label" htmlFor="phone">
                  <div className="flex items-center gap-2 mb-1 text-gray-700">
                    <Phone className="w-4 h-4 text-emerald-400" />
                    Numéro de téléphone
                  </div>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+243 81 000 0000"
                  className="input"
                />
              </div>
            </div>

            <div>
              <label className="label" htmlFor="address">
                <div className="flex items-center gap-2 mb-1 text-gray-700">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  Adresse physique
                </div>
              </label>
              <textarea
                id="address"
                name="address"
                rows={3}
                placeholder="Ex: 123 Avenue de la Paix, Kinshasa"
                className="input resize-none"
              ></textarea>
            </div>
          </div>

          <div className="pt-4 border-t border-surface-border flex justify-end gap-3">
            <Link href="/clients">
              <button type="button" className="btn-secondary">
                Annuler
              </button>
            </Link>
            <button type="submit" className="btn-primary">
              <Save className="w-4 h-4" />
              Enregistrer le client
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
