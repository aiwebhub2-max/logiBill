# SaaS Facturation & Gestion des Stocks - Documentation Projet

Ce fichier résume l'état actuel de l'application pour aider les futurs modèles d'IA à comprendre le projet.

## 1. Ce que l'application fait
C'est une application SaaS (Software as a Service) de facturation et de gestion des stocks conçue pour aider les entreprises à gérer leurs clients, leur inventaire, l'émission de factures et le suivi des paiements. Elle propose un tableau de bord analytique pour suivre les performances financières.

## 2. Fonctionnalités implémentées
Bien que le backend ne soit pas encore connecté (utilisation de données mockées), la structure front-end gère les entités suivantes :
*   **Tableau de bord (Dashboard) :** Affichage des statistiques clés (total facturé, payé, en attente, en retard) et graphique des revenus mensuels.
*   **Gestion des Clients :** Liste et détails des clients de l'entreprise.
*   **Gestion des Factures :** Création, suivi (brouillon, envoyée, payée, en retard) et affichage des factures avec leurs lignes de détail.
*   **Gestion de l'Inventaire (Stocks) :** Suivi des articles, des prix unitaires, des quantités en stock et des seuils d'alerte.
*   **Gestion des Paiements :** Enregistrement des paiements (espèces, mobile money, virement bancaire, carte) liés aux factures.
*   **Paramètres :** Section pour la configuration de l'entreprise.

## 3. Structure des fichiers
Le projet suit l'architecture classique d'un projet Next.js avec l'App Router :
*   `app/` : Contient le système de routage (Next.js App Router).
    *   `app/(dashboard)/` : Regroupe toutes les pages nécessitant le layout du tableau de bord (`clients`, `dashboard`, `inventory`, `invoices`, `payments`, `settings`).
*   `components/` : Composants UI réutilisables.
    *   `components/layout/` : Composants de structure globale (Header, Sidebar, Breadcrumb).
    *   `components/dashboard/` : Composants spécifiques au tableau de bord (StatCard, RevenueChart, InvoiceTable).
*   `lib/` : Fichiers utilitaires.
    *   `lib/mock-data.ts` : Contient toutes les données de test (clients, factures, inventaire, paiements) pour le développement frontend.
    *   `lib/utils.ts` : Fonctions utilitaires générales.
    *   `lib/constants.ts` : Constantes de l'application.
*   `types/` : Définitions TypeScript.
    *   `types/index.ts` : Interfaces principales (Invoice, Client, InventoryItem, Payment, DashboardStats, etc.).

## 4. Technologies utilisées
*   **Framework Core :** Next.js 14.2 (App Router)
*   **Bibliothèque UI :** React 18
*   **Langage :** TypeScript (strict typing)
*   **Styling :** Tailwind CSS 3.4
*   **Graphiques :** Recharts 2.12
*   **Icônes :** Lucide React
*   **Utilitaires CSS :** `clsx` et `tailwind-merge` pour la composition dynamique des classes Tailwind.

## 5. Décisions de design
*   **Architecture Frontend-First :** Le développement a commencé par la création de l'interface utilisateur en utilisant des données factices (`mock-data.ts`) définies selon un schéma strict (`types/index.ts`), permettant de valider l'UX/UI avant l'intégration d'un backend ou d'une base de données.
*   **App Router :** Utilisation de l'App Router de Next.js avec des groupes de routes (comme `(dashboard)`) pour partager des layouts de manière isolée sans affecter l'URL.
*   **Composants Modulaires :** Séparation claire entre les composants de layout (Header, Sidebar) et les composants de contenu (Tableaux, Graphiques).
*   **Stylisation Utilitaire :** Utilisation exclusive de Tailwind CSS pour un design rapide, responsive et cohérent.

## 6. Instructions pour un futur modèle IA
Lorsque vous intervenez sur ce projet, veuillez respecter les règles suivantes :
1.  **Typage Strict :** Utilisez toujours TypeScript. Consultez `types/index.ts` avant de créer de nouvelles structures de données. Si vous ajoutez une fonctionnalité, mettez à jour les types en premier.
2.  **Gestion des Données :** L'application utilise actuellement `lib/mock-data.ts`. Si vous devez développer des fonctionnalités d'affichage, basez-vous sur ces données. Si l'objectif est d'ajouter un backend, prévoyez de remplacer ces imports par des appels API/Server Actions tout en conservant les interfaces TypeScript.
3.  **Styling :** Utilisez Tailwind CSS. Pour fusionner des classes conditionnelles, utilisez la fonction utilitaire `cn()` (probablement définie dans `lib/utils.ts` utilisant `clsx` et `tailwind-merge`) au lieu de concaténer des chaînes de caractères brutes.
4.  **Structure des Composants :** Placez les composants réutilisables dans les sous-dossiers appropriés de `components/`. Évitez de surcharger les fichiers de pages (`page.tsx`) dans le dossier `app/`.
5.  **Routage :** Respectez le paradigme de l'App Router (`app/nom-de-route/page.tsx`). Pour les pages internes du SaaS, placez-les sous le groupe `(dashboard)` pour qu'elles héritent du layout incluant la sidebar et le header.
