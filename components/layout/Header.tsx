"use client";

import { Bell, Search, Menu, Plus, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { signout } from "@/app/login/actions";

interface HeaderProps {
  onMenuToggle: () => void;
  title?: string;
  subtitle?: string;
}

export default function Header({ onMenuToggle, title, subtitle }: HeaderProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    if (notifOpen || userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notifOpen, userMenuOpen]);

  const notifications = [
    { id: 1, text: "Facture FAC-2024-0003 en retard", time: "Il y a 2h", type: "danger" },
    { id: 2, text: "Stock Câble Cat6 sous le seuil", time: "Il y a 5h", type: "warning" },
    { id: 3, text: "Paiement reçu: 855 500 FC", time: "Hier", type: "success" },
  ];

  const notifColors = {
    danger: "bg-red-500",
    warning: "bg-amber-500",
    success: "bg-emerald-500",
  };

  return (
    <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-xl border-b border-surface-border px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
      {/* Left: Hamburger + Title */}
      <div className="flex items-center gap-4 min-w-0">
        <button
          onClick={onMenuToggle}
          className="lg:hidden btn-icon"
          aria-label="Ouvrir le menu"
          id="hamburger-menu-btn"
        >
          <Menu className="w-5 h-5" />
        </button>

        {title && (
          <div className="hidden sm:block min-w-0">
            <h1 className="text-base font-semibold text-gray-900 truncate">{title}</h1>
            {subtitle && (
              <p className="text-xs text-gray-500 truncate">{subtitle}</p>
            )}
          </div>
        )}
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-sm hidden md:block">
        <div
          className={`relative flex items-center transition-all duration-300 ease-out ${
            searchFocused ? "scale-[1.03] ring-4 ring-brand-500/20 shadow-lg rounded-xl" : ""
          }`}
        >
          <Search className="absolute left-3 w-4 h-4 text-gray-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Rechercher factures, clients..."
            className="w-full pl-9 pr-4 py-2 bg-surface-muted border border-surface-border rounded-xl text-sm text-gray-700 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-600/40 focus:border-brand-600/40 transition-all"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            id="global-search-input"
          />
          <kbd className="absolute right-3 text-[10px] text-gray-600 bg-surface-border px-1.5 py-0.5 rounded font-mono hidden lg:block">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* New Invoice CTA */}
        <Link href="/invoices/new" id="new-invoice-btn">
          <button className="hidden sm:flex btn-primary text-sm py-1.5">
            <Plus className="w-4 h-4" />
            <span className="hidden lg:inline">Nouvelle facture</span>
          </button>
        </Link>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            id="notifications-btn"
            onClick={() => setNotifOpen(!notifOpen)}
            className="btn-icon relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-surface" />
          </button>

          {/* Notification dropdown */}
          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 card shadow-card-hover border border-surface-border z-50 animate-fade-in overflow-hidden">
              <div className="px-4 py-3 border-b border-surface-border flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900">Notifications</span>
                <span className="text-xs text-brand-400 font-medium cursor-pointer hover:text-brand-300">
                  Tout marquer comme lu
                </span>
              </div>
              <div className="divide-y divide-surface-border">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                        notifColors[notif.type as keyof typeof notifColors]
                      }`}
                    />
                    <div>
                      <p className="text-xs text-gray-700">{notif.text}</p>
                      <p className="text-[10px] text-gray-600 mt-0.5">{notif.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-surface-border text-center">
                <button className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
                  Voir toutes les notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="relative" ref={userMenuRef}>
          <button
            id="user-avatar-btn"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-gray-100 transition-colors group"
          >
            <div className="w-8 h-8 rounded-xl bg-gray-200 flex items-center justify-center text-gray-700 font-semibold text-sm">
              U
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-600 group-hover:text-gray-900 transition-colors hidden sm:block" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 card shadow-card-hover border border-surface-border z-50 animate-fade-in overflow-hidden">
              <div className="divide-y divide-surface-border">
                <form action={signout}>
                  <button className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-gray-50 transition-colors">
                    Déconnexion
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
