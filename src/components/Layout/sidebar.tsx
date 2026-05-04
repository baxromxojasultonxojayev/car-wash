import React, { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../lib/auth";
import { Menu, Button, Modal } from "antd";
import {
  LogOut,
  Zap,
  ChevronDown,
} from "lucide-react";
import { getMenuStructure, MenuItem } from "../../constants/menu-items";
import type { MenuProps } from 'antd';

type SidebarProps = {
  onLogout: () => void;
  onNavigateStart?: () => void;
};

type MenuItemType = Required<MenuProps>['items'][number];

export default function Sidebar({ onLogout, onNavigateStart }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [sidebarTheme, setSidebarTheme] = React.useState<'light' | 'dark'>('dark');

  React.useEffect(() => {
    const checkTheme = () => {
      const isLight = document.documentElement.classList.contains('sidebar-light');
      setSidebarTheme(isLight ? 'light' : 'dark');
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const handleLogout = () => {
    Modal.confirm({
      title: t("logoutConfirmTitle"),
      content: t("logoutConfirmMessage"),
      okText: t("logoutConfirmYes"),
      cancelText: t("logoutConfirmNo"),
      okButtonProps: { danger: true },
      centered: true,
      onOk: () => {
        onLogout();
      },
    });
  };

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

  // Convert MenuItem to Ant Design Menu items
  const antMenuItems: MenuItemType[] = useMemo(() => {
    const convert = (items: MenuItem[]): MenuItemType[] => {
      return items.map(item => {
        const Icon = item.icon;
        const hasSubItems = item.subItems && item.subItems.length > 0;
        
        if (hasSubItems) {
          return {
            key: item.id,
            label: item.label,
            icon: <Icon size={18} />,
            children: convert(item.subItems!),
          } as MenuItemType;
        }

        return {
          key: item.path || item.id,
          label: item.label,
          icon: <Icon size={18} />,
          onClick: () => {
            if (item.path) {
              if (onNavigateStart) onNavigateStart();
              navigate(item.path);
            }
          }
        } as MenuItemType;
      });
    };
    return convert(menuStructure);
  }, [menuStructure, navigate, onNavigateStart]);

  // Find active key and open keys
  const selectedKeys = [location.pathname];
  
  // Simple logic to find which submenus should be open based on current path
  const openKeys = useMemo(() => {
    const keys: string[] = [];
    const findParents = (items: MenuItem[], targetPath: string, path: string[] = []) => {
      for (const item of items) {
        if (item.path === targetPath) {
          keys.push(...path);
          return true;
        }
        if (item.subItems) {
          if (findParents(item.subItems, targetPath, [...path, item.id])) return true;
        }
      }
      return false;
    };
    findParents(menuStructure, location.pathname);
    return keys;
  }, [menuStructure, location.pathname]);

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
      <div className="flex-1 overflow-y-auto custom-scrollbar py-4 px-2">
        <Menu
          mode="inline"
          theme={sidebarTheme}
          selectedKeys={selectedKeys}
          defaultOpenKeys={openKeys}
          items={antMenuItems}
          style={{ 
            background: 'transparent', 
            border: 'none',
          }}
          inlineIndent={16}
          className="antd-sidebar-menu"
        />
      </div>

      {/* User info & Logout */}
      <div className="px-4 py-6 border-t border-sidebar-border/10 bg-sidebar-accent/20">
        <div className="px-4 py-3 mb-4 bg-sidebar/50 rounded-xl border border-sidebar-border/10">
          <p className="text-sm font-semibold text-sidebar-foreground truncate">{user?.name}</p>
          <p className="text-[11px] font-medium text-sidebar-foreground/40 truncate mt-0.5">{user?.phone}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-destructive hover:bg-destructive/10 rounded-xl transition-all hover:gap-4 group"
        >
          <LogOut size={20} className="transition-transform group-hover:-translate-x-1" />
          <span>{t("logout")}</span>
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .antd-sidebar-menu, 
        .antd-sidebar-menu .ant-menu-sub {
          background: transparent !important;
        }
        .antd-sidebar-menu .ant-menu-item-group-title {
          font-size: 11px !important;
          font-weight: 700 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
          color: var(--sidebar-foreground) !important;
          opacity: 0.5;
          padding: 16px 16px 8px !important;
        }
        .antd-sidebar-menu .ant-menu-item, 
        .antd-sidebar-menu .ant-menu-submenu-title {
          border-radius: 12px !important;
          margin: 4px 8px !important;
          width: calc(100% - 16px) !important;
          height: 44px !important;
          line-height: 44px !important;
          font-weight: 500 !important;
        }
        .antd-sidebar-menu .ant-menu-item-selected {
          background: linear-gradient(135deg, var(--primary) 0%, #2563eb 100%) !important;
          color: white !important;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3) !important;
        }
        .antd-sidebar-menu .ant-menu-item:hover:not(.ant-menu-item-selected),
        .antd-sidebar-menu .ant-menu-submenu-title:hover {
          background: var(--sidebar-accent) !important;
          opacity: 0.8;
        }
        .antd-sidebar-menu .ant-menu-submenu-arrow {
          color: var(--sidebar-foreground) !important;
          opacity: 0.6;
        }
      `}} />
    </div>
  );
}
