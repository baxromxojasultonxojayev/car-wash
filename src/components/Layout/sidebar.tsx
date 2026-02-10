import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../lib/auth";
import {
  LayoutDashboard,
  Building2,
  Users,
  QrCode,
  Zap,
  DollarSign,
  Megaphone,
  BarChart3,
  Tag,
  UserCheck,
  LogOut,
} from "lucide-react";

type SidebarProps = {
  onLogout: () => void;
  onNavigateStart?: () => void;
};

export default function Sidebar({ onLogout, onNavigateStart }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { user } = useAuth();

  const isSuperAdmin = user?.role === 'super_admin';

  // Super Admin menu
  const superAdminMenu = [
    { id: "dashboard", label: t("dashboard"), icon: LayoutDashboard, path: "/dashboard" },
    { id: "organizations", label: t("organizations"), icon: Building2, path: "/organizations" },
    { id: "accounts", label: t("accounts"), icon: Users, path: "/accounts" },
    { id: "qrCodes", label: t("qrCodes"), icon: QrCode, path: "/qr-codes" },
    { id: "allUsers", label: t("allUsers"), icon: UserCheck, path: "/users" },
  ];

  // Client Admin menu
  const clientAdminMenu = [
    { id: "dashboard", label: t("dashboard"), icon: LayoutDashboard, path: "/dashboard" },
    { id: "kiosks", label: t("kiosks"), icon: Zap, path: "/kiosks" },
    { id: "priceGoods", label: t("priceGoods"), icon: DollarSign, path: "/price-goods" },
    { id: "advertisements", label: t("advertisements"), icon: Megaphone, path: "/advertisements" },
    { id: "statistics", label: t("statistics"), icon: BarChart3, path: "/statistics" },
    { id: "promotions", label: t("promotions"), icon: Tag, path: "/promotions" },
    { id: "workers", label: t("workers"), icon: UserCheck, path: "/workers" },
  ];

  const menuItems = isSuperAdmin ? superAdminMenu : clientAdminMenu;

  const navigateTo = (path: string) => {
    console.log('path',path);
    
    // if (path === location.pathname) return;
    // onNavigateStart?.();
    navigate(path);
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
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || 
            location.pathname.startsWith(item.path + '/');

          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/30 hover:text-sidebar-foreground"
              }`}
            >
              <Icon size={20} className="flex-shrink-0" />
              <span className="flex-1 text-left text-sm">{item.label}</span>
            </button>
          );
        })}
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
