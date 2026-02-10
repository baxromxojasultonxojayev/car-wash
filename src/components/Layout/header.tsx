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
import { Globe, LogOut, Sun, Moon, Menu } from "lucide-react";

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
    <div className="bg-card border-b border-border/20 px-4 sm:px-6 py-4 flex items-center justify-between">
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
        <h2 className="text-lg sm:text-xl font-bold text-foreground">{title}</h2>
      </div>

      {/* Right side - controls */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-accent rounded-lg transition-colors"
          title={t("changeTheme")}
        >
          {theme === "dark" ? (
            <Sun size={20} className="text-muted-foreground hover:text-foreground transition-colors" />
          ) : (
            <Moon size={20} className="text-muted-foreground hover:text-foreground transition-colors" />
          )}
        </button>

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
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => changeLanguage("uz")}>
              O'zbek (UZ)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLanguage("ru")}>
              Русский (RU)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLanguage("en")}>
              English (EN)
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
