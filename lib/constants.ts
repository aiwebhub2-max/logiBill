export const TVA_RATE = 0.18;
export const CURRENCY = "FC";
export const CURRENCY_CODE = "CDF";
export const COMPANY_NAME = "MonEntreprise";
export const APP_NAME = "FacturePro";
export const APP_DESCRIPTION = "Gestion de facturation et stocks pour entrepreneurs africains";

export const INVOICE_STATUSES = [
  { value: "all", label: "Tous" },
  { value: "draft", label: "Brouillon" },
  { value: "sent", label: "Envoyée" },
  { value: "paid", label: "Payée" },
  { value: "overdue", label: "En retard" },
] as const;

export const PAYMENT_METHODS = [
  { value: "cash", label: "Espèces" },
  { value: "mobile_money", label: "Mobile Money" },
  { value: "bank_transfer", label: "Virement bancaire" },
  { value: "card", label: "Carte bancaire" },
] as const;

export const ITEM_CATEGORIES = [
  "Fournitures",
  "Électronique",
  "Matériaux",
  "Mobilier",
  "Services",
  "Alimentaire",
  "Santé",
  "Autre",
] as const;

export const NAVIGATION_ITEMS = [
  { href: "/dashboard", label: "Tableau de bord", icon: "LayoutDashboard" },
  { href: "/invoices", label: "Factures", icon: "FileText" },
  { href: "/clients", label: "Clients", icon: "Users" },
  { href: "/inventory", label: "Inventaire", icon: "Package" },
  { href: "/payments", label: "Paiements", icon: "CreditCard" },
  { href: "/settings", label: "Paramètres", icon: "Settings" },
] as const;
