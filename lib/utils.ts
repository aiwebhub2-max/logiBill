import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Invoice, InvoiceLine, InvoiceStatus } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formate un montant en Franc Congolais (FC)
 */
export const formatFC = (amount: number): string => {
  return new Intl.NumberFormat("fr-CD", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + " FC";
};

/**
 * Formate une date au format JJ/MM/AAAA
 */
export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("fr-CD", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

/**
 * Formate une date relative (il y a X jours)
 */
export const formatRelativeDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return "Hier";
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaine${Math.floor(diffDays / 7) > 1 ? "s" : ""}`;
  return formatDate(dateStr);
};

/**
 * Calcule les totaux d'une facture
 */
export const calculateInvoiceTotals = (lines: InvoiceLine[], taxRate = 0.18) => {
  const subtotal = lines.reduce((sum, l) => sum + l.quantity * l.unit_price, 0);
  const tax = subtotal * taxRate;
  return { subtotal, tax, total: subtotal + tax };
};

/**
 * Détermine le statut d'une facture automatiquement
 */
export const getInvoiceStatus = (invoice: Invoice): InvoiceStatus => {
  if (invoice.paid_at) return "paid";
  if (new Date(invoice.due_date) < new Date()) return "overdue";
  return invoice.sent_at ? "sent" : "draft";
};

/**
 * Labels et couleurs des statuts de facture
 */
export const invoiceStatusConfig: Record<InvoiceStatus, {
  label: string;
  bgColor: string;
  textColor: string;
  dotColor: string;
}> = {
  draft: {
    label: "Brouillon",
    bgColor: "bg-surface-muted",
    textColor: "text-gray-400",
    dotColor: "bg-gray-400",
  },
  sent: {
    label: "Envoyée",
    bgColor: "bg-amber-500/15",
    textColor: "text-amber-400",
    dotColor: "bg-amber-400",
  },
  paid: {
    label: "Payée",
    bgColor: "bg-emerald-500/15",
    textColor: "text-emerald-400",
    dotColor: "bg-emerald-400",
  },
  overdue: {
    label: "En retard",
    bgColor: "bg-red-500/15",
    textColor: "text-red-400",
    dotColor: "bg-red-400",
  },
};

/**
 * Nom du mois en français
 */
export const getMonthName = (monthIndex: number): string => {
  const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];
  return months[monthIndex];
};

/**
 * Génère un numéro de facture
 */
export const generateInvoiceNumber = (count: number): string => {
  const year = new Date().getFullYear();
  return `FAC-${year}-${String(count).padStart(4, "0")}`;
};

/**
 * Abréger un montant pour les graphiques
 */
export const abbreviateAmount = (amount: number): string => {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}K`;
  return amount.toString();
};
