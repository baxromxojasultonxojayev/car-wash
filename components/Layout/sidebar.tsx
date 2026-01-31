"use client";

import React from "react";
import {
  LayoutDashboard,
  Users,
  Building2,
  Zap,
  CreditCard,
  FileText,
  Settings,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

type SidebarProps = {
  onLogout: () => void;
  onNavigateStart?: () => void;
};

export default function Sidebar({ onLogout, onNavigateStart }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();

  const menuItems = [
    {
      id: "dashboard",
      label: t("dashboard"),
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    { id: "users", label: t("users"), icon: Users, path: "/users" },
    {
      id: "companies",
      label: t("companies"),
      icon: Building2,
      path: "/companies",
    },
    { id: "kiosks", label: t("kiosks"), icon: Zap, path: "/kiosks" },
    {
      id: "rfidCards",
      label: t("rfidCards"),
      icon: CreditCard,
      path: "/cards",
    },
    { id: "reports", label: t("reports"), icon: FileText, path: "/reports" },
    { id: "services", label: t("services"), icon: Settings, path: "/services" },
  ];

  const navigateTo = (path: string) => {
    if (path === pathname) return;
    onNavigateStart?.();
    router.push(path);
  };

  return (
    <div className="flex flex-col h-full bg-sidebar">
      {/* Logo / title */}
      <div className="px-6 py-6 border-b border-sidebar-border/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <ZapIcon />
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">
              CarWash
            </h1>
            <p className="text-xs text-sidebar-foreground/60">{t("admin")}</p>
          </div>
        </div>
      </div>

      {/* Menu items */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/20"
              }`}
            >
              <Icon size={20} className="flex-shrink-0" />
              <span className="flex-1 text-left text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-6 border-t border-sidebar-border/20">
        <button
          onClick={onLogout}
          className="w-full px-4 py-3 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/20 rounded-lg transition-colors"
        >
          {t("logout")}
        </button>
      </div>
    </div>
  );
}

function ZapIcon() {
  return <Zap size={20} className="text-primary-foreground" />;
}
