import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../lib/auth";
import {
  LogOut,
  ChevronDown,
  ChevronRight,
  Zap
} from "lucide-react";
import { getMenuStructure, MenuItem } from "../../constants/menu-items";

type SidebarProps = {
  onLogout: () => void;
  onNavigateStart?: () => void;
};

export default function Sidebar({ onLogout, onNavigateStart }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    orgs: true,
  });

  const toggleMenu = (id: string) => {
    setOpenMenus(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const isSuperAdmin = user?.role === 'super_admin';
  const menuStructure = getMenuStructure(t);

  const navigateTo = (path: string) => {
    if (onNavigateStart) onNavigateStart();
    navigate(path);
  };

  const renderMenuItem = (item: MenuItem, isSubItem = false) => {
    const Icon = item.icon;
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isOpen = openMenus[item.id];
    const isActive = item.path ? (location.pathname === item.path || location.pathname.startsWith(item.path + '/')) : false;
    const isChildActive = item.subItems?.some(sub => location.pathname === sub.path || location.pathname.startsWith(sub.path + '/'));

    return (
      <div key={item.id} className="w-full">
        <button
          onClick={() => hasSubItems ? toggleMenu(item.id) : item.path && navigateTo(item.path)}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 ${isSubItem ? 'pl-11' : ''} ${
            isActive || (hasSubItems && isChildActive)
              ? "text-primary-foreground shadow-sm"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          }`}
          style={{
            background: (isActive || (hasSubItems && isChildActive && !isOpen))
              ? `linear-gradient(135deg, var(--theme-color) 0%, oklch(from var(--theme-color) calc(l - 0.1) c h) 100%)`
              : undefined,
          }}
        >
          <Icon 
            size={isSubItem ? 18 : 20} 
            className={`flex-shrink-0 transition-transform duration-300 ${(isActive || isChildActive) ? 'scale-110' : ''}`} 
          />
          <span className={`flex-1 text-left ${isSubItem ? 'text-xs' : 'text-sm'}`}>{item.label}</span>
          {hasSubItems && (
            isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />
          )}
        </button>
        
        {hasSubItems && isOpen && (
          <div className="mt-1 space-y-1 animate-in slide-in-from-top-2 duration-200">
            {item.subItems!.map(sub => renderMenuItem(sub, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-sidebar">
      {/* Logo / title */}
      <div className="px-6 py-6 border-b border-sidebar-border/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <Zap size={20} className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">
              CarWash
            </h1>
            <p className="text-xs text-sidebar-foreground/60">
              {isSuperAdmin ? t("superAdmin") : user?.organizationName || t("admin")}
            </p>
          </div>
        </div>
      </div>

      {/* Menu items */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto custom-scrollbar">
        {menuStructure.map(item => renderMenuItem(item))}
      </nav>

      {/* User info & Logout */}
      <div className="px-3 py-4 border-t border-sidebar-border/20">
        <div className="px-4 py-2 mb-2">
          <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name}</p>
          <p className="text-xs text-sidebar-foreground/50 truncate">{user?.phone}</p>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
        >
          <LogOut size={20} />
          <span>{t("logout")}</span>
        </button>
      </div>
    </div>
  );
}
