import type { Metadata } from "next";
import "./globals.css";
import { PHProvider } from './providers'
import dynamic from 'next/dynamic'

const PostHogPageView = dynamic(() => import('./PostHogPageView'), {
  ssr: false,
})

export const metadata: Metadata = {
  title: {
    default: "logiBill — Gestion de facturation et stocks",
    template: "%s | logiBill",
  },
  description: "Solution SaaS de facturation et gestion de stocks pour entrepreneurs africains. Créez des factures professionnelles en FC, gérez votre inventaire.",
  keywords: ["facturation", "gestion stock", "CDF", "Congo", "SaaS", "facture"],
  authors: [{ name: "logiBill" }],
  openGraph: {
    type: "website",
    locale: "fr_CD",
    title: "logiBill — Gérez vos factures et votre stock",
    description: "Solution SaaS de facturation professionnelle pour entrepreneurs congolais",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-surface text-gray-800 min-h-screen antialiased">
        <PHProvider>
          <PostHogPageView />
          {children}
        </PHProvider>
      </body>
    </html>
  );
}
