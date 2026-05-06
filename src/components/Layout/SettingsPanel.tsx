import React, { useState, useEffect } from "react";
import { Settings as SettingsIcon, Sun, Moon, Check } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import { Button, Switch, Divider, Drawer, Space } from "antd";
import {
  themeColors,
  applyHeaderColor,
  getStoredHeaderColor,
  applySidebarTheme,
  getStoredSidebarTheme
} from "@/lib/theme-utils";
import "./SettingsPanel.scss";

export default function SettingsPanel() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [headerColor, setHeaderColor] = useState(getStoredHeaderColor());
  const [sidebarTheme, setSidebarTheme] = useState<'light' | 'dark'>(getStoredSidebarTheme());

  const ready = i18n.isInitialized;

  // Apply stored values on mount
  useEffect(() => {
    applyHeaderColor(headerColor);
    applySidebarTheme(sidebarTheme);
  }, []);

  const handleColorChange = (color: string) => {
    setHeaderColor(color);
    applyHeaderColor(color);
  };

  const handleSidebarThemeChange = (checked: boolean) => {
    const newTheme = checked ? 'dark' : 'light';
    setSidebarTheme(newTheme);
    applySidebarTheme(newTheme);
  };

  return (
    <>
      {/* Floating Gear Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="floating-settings-btn"
        aria-label="Open settings"
      >
        <SettingsIcon className="gear-icon" />
      </button>

      {/* Settings Drawer */}
      <Drawer
        title={ready ? t('settingsPanel') : 'Settings'}
        placement="right"
        onClose={() => setIsOpen(false)}
        open={isOpen}
        size={400}
        className="antd-settings-drawer"
        styles={{
          body: { padding: '24px' },
          header: { borderBottom: '1px solid var(--border)' }
        }}
      >
        <div className="space-y-8">
          {/* Select Layout Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              {ready ? t('selectLayout') : 'Select Layout'}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Light Layout Card */}
              <button
                onClick={() => setTheme('light')}
                className={`layout-card ${theme === 'light' ? 'active' : ''}`}
              >
                <div className="layout-preview light">
                  <div className="flex gap-1">
                    <div className="w-4 h-12 bg-white border rounded" />
                    <div className="flex-1 space-y-1">
                      <div className="h-2 w-full bg-white border rounded" />
                      <div className="h-8 w-full bg-white border rounded" />
                    </div>
                  </div>
                </div>
                <div className="layout-label">
                  <Sun className="h-3 w-3" />
                  {ready ? t('light') : 'Light'}
                </div>
              </button>

              {/* Dark Layout Card */}
              <button
                onClick={() => setTheme('dark')}
                className={`layout-card ${theme === 'dark' ? 'active' : ''}`}
              >
                <div className="layout-preview dark">
                  <div className="flex gap-1">
                    <div className="w-4 h-12 bg-slate-800 border-slate-700 rounded" />
                    <div className="flex-1 space-y-1">
                      <div className="h-2 w-full bg-slate-800 border-slate-700 rounded" />
                      <div className="h-8 w-full bg-slate-800 border-slate-700 rounded" />
                    </div>
                  </div>
                </div>
                <div className="layout-label">
                  <Moon className="h-3 w-3" />
                  {ready ? t('dark') : 'Dark'}
                </div>
              </button>
            </div>
          </div>

          <Divider />

          {/* Sidebar Menu Color Section */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-foreground">{ready ? t('sidebarMenuColor') : 'Sidebar Menu Color'}</h3>
              <p className="text-[11px] text-muted-foreground font-medium">{ready ? t('toggleSidebarTheme') : 'Toggle Sidebar'}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold uppercase transition-colors ${sidebarTheme === 'light' ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`}>
                {ready ? t('light') : 'Light'}
              </span>
              <Switch
                checked={sidebarTheme === 'dark'}
                onChange={handleSidebarThemeChange}
                className="bg-slate-300 dark:bg-slate-700"
              />
              <span className={`text-[10px] font-bold uppercase transition-colors ${sidebarTheme === 'dark' ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`}>
                {ready ? t('dark') : 'Dark'}
              </span>
            </div>
          </div>

          <Divider />

          {/* Color Theme Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{ready ? t('colorTheme') : 'Color Theme'}</h3>
            <div className="flex flex-wrap gap-3">
              {/* Default transparent option */}
              <button
                onClick={() => handleColorChange('transparent')}
                className={`color-swatch border-2 ${headerColor === 'transparent' ? 'border-primary' : 'border-border'}`}
                title={t('default')}
              >
                <div className="w-full h-full rounded-full bg-card" />
                {headerColor === 'transparent' && (
                  <Check className="absolute h-4 w-4 text-primary" />
                )}
              </button>

              {themeColors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => handleColorChange(color.value)}
                  className="color-swatch"
                  style={{ backgroundColor: color.value }}
                  title={color.label}
                >
                  {headerColor === color.value && (
                    <Check className="h-4 w-4 text-white drop-shadow-md animate-in zoom-in-50 duration-300" />
                  )}
                  <span className="swatch-label">
                    {color.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Footer Info */}
          <div className="pt-8 text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full border border-primary/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{ready ? t('customizingUI') : 'Customizing UI'}</span>
            </div>
            <p className="text-[11px] text-muted-foreground font-medium">{ready ? t('changesApplied') : 'Changes applied locally'}</p>
          </div>
        </div>
      </Drawer>

      <style dangerouslySetInnerHTML={{
        __html: `
        .antd-settings-drawer .ant-drawer-content {
          background-color: var(--card) !important;
          color: var(--foreground) !important;
        }
        .antd-settings-drawer .ant-drawer-header-title {
          flex-direction: row-reverse !important;
        }
        .antd-settings-drawer .ant-drawer-title {
          color: var(--foreground) !important;
          font-weight: 700 !important;
        }
        .antd-settings-drawer .ant-drawer-close {
          color: var(--muted-foreground) !important;
          margin-inline-end: 0 !important;
          margin-inline-start: 12px !important;
        }
        .antd-settings-drawer .ant-divider {
          border-color: var(--border) !important;
          opacity: 0.5 !important;
        }
      `}} />
    </>
  );
}
