import React, { useState, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../lib/auth";
import * as Collapsible from "@radix-ui/react-collapsible";
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
  // Helper to find parent IDs of the active path
  const getActiveParentIds = useCallback((items: MenuItem[], path: string): string[] => {
    const parents: string[] = [];
    
    const findInItems = (items: MenuItem[], currentPath: string): boolean => {
      for (const item of items) {
        // Check if this item is the active one
        if (item.path === currentPath || (item.path && item.path !== '/' && currentPath.startsWith(item.path + '/'))) {
          return true;
        }
        
        // Check sub items
        if (item.subItems && findInItems(item.subItems, currentPath)) {
          parents.push(item.id);
          return true;
        }
      }
      return false;
    };
    
    findInItems(items, path);
    return parents;
  }, []);

  // Initialize open menus based on current path
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() => {
    // We can't access menuStructure here because it's defined after, 
    // but we can call getMenuStructure(t) directly or wait for useEffect.
    // For now, let's start empty and let useEffect handle it immediately.
    return {};
  });

  const userRole = user?.role || 'client_admin';
  const isSuperAdmin = userRole === 'super_admin';
  
  // Filter menu structure by role
  const menuStructure = useMemo(() => {
    const filterItems = (items: MenuItem[]): MenuItem[] => {
      return items
        .filter(item => !item.roles || item.roles.includes(userRole))
        .map(item => ({
          ...item,
          subItems: item.subItems ? filterItems(item.subItems) : undefined
        }))
        .filter(item => {
          if (item.subItems && item.subItems.length > 0) return true;
          return !!item.path;
        });
    };
    return filterItems(getMenuStructure(t));
  }, [t, userRole]);

  // Sync open menus with current path
  React.useEffect(() => {
    const activeParents = getActiveParentIds(menuStructure, location.pathname);
    if (activeParents.length > 0) {
      setOpenMenus(prev => {
        const next = { ...prev };
        let changed = false;
        activeParents.forEach(id => {
          if (!next[id]) {
            next[id] = true;
            changed = true;
          }
        });
        return changed ? next : prev;
      });
    }
  }, [location.pathname, menuStructure, getActiveParentIds]);

  const toggleMenu = (id: string) => {
    setOpenMenus(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const navigateTo = (path: string) => {
    if (location.pathname === path) return;
    if (onNavigateStart) onNavigateStart();
    navigate(path);
  };

  const renderMenuItem = (item: MenuItem, isSubItem = false) => {
    const Icon = item.icon;
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isOpen = openMenus[item.id];
    
    const isActive = item.path 
      ? (location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path + '/'))) 
      : false;
      
    const isChildActive = item.subItems?.some(sub => 
      location.pathname === sub.path || (sub.path && sub.path !== '/' && location.pathname.startsWith(sub.path + '/'))
    );

    const isGroup = !item.path && hasSubItems && !isSubItem;

    if (isGroup) {
      return (
        <Collapsible.Root 
          key={item.id} 
          open={isOpen} 
          onOpenChange={() => toggleMenu(item.id)}
          className="mt-6 mb-2"
        >
          <Collapsible.Trigger asChild>
            <button className="w-full flex items-center justify-between px-4 py-2 text-xs font-bold uppercase tracking-wider text-sidebar-foreground/40 hover:text-sidebar-foreground transition-colors group cursor-pointer text-left">
              <div className="flex items-center gap-2 min-w-0">
                <Icon size={14} className="group-hover:text-primary transition-colors flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </div>
              <div className={`transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
                <ChevronDown size={14} />
              </div>
            </button>
          </Collapsible.Trigger>
          
          <Collapsible.Content className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
            <div className="mt-1 space-y-1 py-1">
              {item.subItems!.map(sub => renderMenuItem(sub, true))}
            </div>
          </Collapsible.Content>
        </Collapsible.Root>
      );
    }

    return (
      <div key={item.id} className="w-full">
        {hasSubItems ? (
          <Collapsible.Root open={isOpen} onOpenChange={() => toggleMenu(item.id)}>
            <Collapsible.Trigger asChild>
              <button
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 text-left ${isSubItem ? 'pl-11' : ''} ${
                  (isChildActive && !isOpen)
                    ? "text-primary-foreground shadow-md"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`}
                style={{
                  background: (isChildActive && !isOpen)
                    ? `linear-gradient(135deg, var(--theme-color) 0%, oklch(from var(--theme-color) calc(l - 0.1) c h) 100%)`
                    : undefined,
                }}
              >
                <Icon 
                  size={isSubItem ? 18 : 20} 
                  className={`flex-shrink-0 transition-transform duration-300 ${isChildActive ? 'scale-110' : ''}`} 
                />
                <span className={`flex-1 truncate ${isSubItem ? 'text-[13px]' : 'text-sm'}`}>{item.label}</span>
                <div className={`transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
                  <ChevronDown size={16} />
                </div>
              </button>
            </Collapsible.Trigger>
            <Collapsible.Content className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
              <div className="mt-1 space-y-1 py-1">
                {item.subItems!.map(sub => renderMenuItem(sub, true))}
              </div>
            </Collapsible.Content>
          </Collapsible.Root>
        ) : (
          <button
            onClick={() => item.path && navigateTo(item.path)}
            disabled={location.pathname === item.path}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 text-left ${isSubItem ? 'pl-11' : ''} ${
              isActive
                ? "text-primary-foreground shadow-md cursor-default"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            }`}
            style={{
              background: isActive
                ? `linear-gradient(135deg, var(--theme-color) 0%, oklch(from var(--theme-color) calc(l - 0.1) c h) 100%)`
                : undefined,
            }}
          >
            <Icon 
              size={isSubItem ? 18 : 20} 
              className={`flex-shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} 
            />
            <span className={`flex-1 truncate ${isSubItem ? 'text-[13px]' : 'text-sm'}`}>{item.label}</span>
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border/10">
      {/* Logo / title */}
      <div className="px-6 py-8 border-b border-sidebar-border/10">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Zap size={22} className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-sidebar-foreground tracking-tight">
              CarWash
            </h1>
            <p className="text-[11px] font-medium text-sidebar-foreground/40 uppercase tracking-widest">
              {isSuperAdmin ? t("superAdmin") : user?.organizationName || t("admin")}
            </p>
          </div>
        </div>
      </div>

      {/* Menu items */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
        {menuStructure.map(item => renderMenuItem(item))}
      </nav>

      {/* User info & Logout */}
      <div className="px-4 py-6 border-t border-sidebar-border/10 bg-sidebar-accent/20">
        <div className="px-4 py-3 mb-4 bg-sidebar/50 rounded-xl border border-sidebar-border/10">
          <p className="text-sm font-semibold text-sidebar-foreground truncate">{user?.name}</p>
          <p className="text-[11px] font-medium text-sidebar-foreground/40 truncate mt-0.5">{user?.phone}</p>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-destructive hover:bg-destructive/10 rounded-xl transition-all hover:gap-4 group"
        >
          <LogOut size={20} className="transition-transform group-hover:-translate-x-1" />
          <span>{t("logout")}</span>
        </button>
      </div>
    </div>
  );
}
