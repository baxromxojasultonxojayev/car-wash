import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Header from "./header";
import Sidebar from "./sidebar";
import { X } from "lucide-react";
import { useAuth } from "@/lib/auth";
import showToast from "@/lib/toast";

export function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);

  useEffect(() => {
    setIsPageLoading(false);
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    showToast.logoutSuccess();
    navigate("/login", { replace: true });
  };

  const handleNavigateStart = () => {
    setIsPageLoading(true);
  };

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Mobile overlay - closes sidebar on click */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-40 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`fixed md:static inset-y-0 left-0 w-64 bg-sidebar border-r border-sidebar-border/20 z-50 h-screen md:h-full transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Mobile close button inside sidebar */}
        <div className="md:hidden absolute top-4 right-4 z-10">
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X size={20} className="text-muted-foreground" />
          </button>
        </div>
        <Sidebar onLogout={handleLogout} onNavigateStart={handleNavigateStart} />
      </div>

      <div className="flex-1 flex flex-col h-screen md:h-full overflow-hidden">
        {/* Header with hamburger */}
        <Header 
          onLogout={handleLogout} 
          onMenuClick={() => setIsSidebarOpen(true)}
          isSidebarOpen={isSidebarOpen}
        />

        <div className="relative flex-1 overflow-y-auto">
          {isPageLoading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/60 backdrop-blur-sm">
              <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            </div>
          )}

          <div
            className={`p-4 sm:p-6 transition-opacity ${
              isPageLoading ? "opacity-50 pointer-events-none" : "opacity-100"
            }`}
          >
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
