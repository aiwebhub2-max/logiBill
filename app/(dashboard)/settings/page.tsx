import { Settings, Building2, Bell, Shield, CreditCard } from "lucide-react";

const sections = [
  { icon: Building2, title: "Entreprise", desc: "Informations de votre société" },
  { icon: Bell, title: "Notifications", desc: "Alertes et emails" },
  { icon: Shield, title: "Sécurité", desc: "Mot de passe et authentification" },
  { icon: CreditCard, title: "Facturation", desc: "TVA, devise et modèles" },
];

export default function SettingsPage() {
  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Configuration de votre compte et entreprise
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title} className="card-hover p-5 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-600/20 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-brand-400" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">{section.title}</h2>
                  <p className="text-xs text-gray-500">{section.desc}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
