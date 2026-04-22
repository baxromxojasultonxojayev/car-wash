import React from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, LogOut, Sun, Moon, Menu, Check } from "lucide-react";

type HeaderProps = {
  email?: string;
  onLogout: () => void;
  onMenuClick?: () => void;
  isSidebarOpen?: boolean;
};

const routeTitleKey: Record<string, string> = {
  "/dashboard": "dashboard",
  "/users": "users",
  "/companies": "companies",
  "/kiosks": "kiosks",
  "/cards": "rfidCards",
  "/reports": "reports",
  "/services": "services",
};

export default function Header({ email, onLogout, onMenuClick, isSidebarOpen }: HeaderProps) {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();

  const titleKey = routeTitleKey[location.pathname] || "dashboard";
  const title = t(titleKey);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("language", lang);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div
      className="bg-card border-b border-border/20 px-4 sm:px-6 py-4 flex items-center justify-between transition-colors duration-300"
      style={{
        backgroundColor: 'var(--header-bg)',
        color: 'var(--header-fg)'
      }}
    >
      {/* Left side - hamburger + title */}
      <div className="flex items-center gap-3">
        {/* Mobile hamburger menu */}
        {onMenuClick && !isSidebarOpen && (
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 -ml-2 hover:bg-accent rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <Menu size={22} className="text-foreground" />
          </button>
        )}
        <h2 className="text-lg sm:text-xl font-bold transition-colors duration-300" style={{ color: 'inherit' }}>{title}</h2>
      </div>

      {/* Right side - controls */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Theme toggle */}
        {/* <button
          onClick={toggleTheme}
          className="p-2 hover:bg-accent rounded-lg transition-colors"
          title={t("changeTheme")}
        >
          {theme === "dark" ? (
            <Sun size={20} className="text-muted-foreground hover:text-foreground transition-colors" />
          ) : (
            <Moon size={20} className="text-muted-foreground hover:text-foreground transition-colors" />
          )}
        </button> */}

        {/* Language switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="p-2 hover:bg-accent rounded-lg transition-colors"
              title={t("changeLanguage")}
            >
              <Globe
                size={20}
                className="text-muted-foreground hover:text-foreground transition-colors"
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[150px]">
            <DropdownMenuItem
              onClick={() => changeLanguage("uz")}
              className="flex items-center justify-between gap-2 cursor-pointer"
            >
              <span>O'zbek (UZ)</span>
              {i18n.language === "uz" && <Check size={16} className="text-primary" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => changeLanguage("ru")}
              className="flex items-center justify-between gap-2 cursor-pointer"
            >
              <span>Русский (RU)</span>
              {i18n.language === "ru" && <Check size={16} className="text-primary" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => changeLanguage("en")}
              className="flex items-center justify-between gap-2 cursor-pointer"
            >
              <span>English (EN)</span>
              {i18n.language === "en" && <Check size={16} className="text-primary" />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Email / role - hidden on mobile */}
        <span className="text-sm text-muted-foreground hidden sm:inline">
          {email || t("admin")}
        </span>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="p-2 hover:bg-accent rounded-lg transition-colors"
          title={t("logout")}
        >
          <LogOut
            size={20}
            className="text-muted-foreground hover:text-foreground transition-colors"
          />
        </button>
      </div>
    </div>
  );
}
