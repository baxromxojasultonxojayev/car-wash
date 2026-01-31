"use client";

import type React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit2, Trash2, Search, AlertCircle, CheckCircle, Pause, Zap, X } from "lucide-react";
import KioskForm from "@/components/kiosks/kiosk-form";

type KioskStatus = "free" | "payment" | "active" | "pause" | "finish" | "error" | "closed";

interface Kiosk {
  id: string;
  name: string;
  status: KioskStatus;
  isActive: boolean;
  controllerMacAddress: string;
  companyId: string;
  branchOfficeId: string;
  patternId?: string;
  createdAt: string;
}

export default function KiosksPage() {
  const { t } = useTranslation();

  const [kiosks, setKiosks] = useState<Kiosk[]>([
    {
      id: "1",
      name: "Kiosk Premium 1",
      status: "active",
      isActive: true,
      controllerMacAddress: "00:1A:2B:3C:4D:5E",
      companyId: "1",
      branchOfficeId: "b1",
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      name: "Kiosk Standard 2",
      status: "payment",
      isActive: true,
      controllerMacAddress: "00:1A:2B:3C:4D:5F",
      companyId: "1",
      branchOfficeId: "b1",
      createdAt: "2024-01-20",
    },
    {
      id: "3",
      name: "Kiosk Standard 3",
      status: "free",
      isActive: true,
      controllerMacAddress: "00:1A:2B:3C:4D:60",
      companyId: "1",
      branchOfficeId: "b2",
      createdAt: "2024-02-01",
    },
    {
      id: "4",
      name: "Kiosk Error",
      status: "error",
      isActive: false,
      controllerMacAddress: "00:1A:2B:3C:4D:61",
      companyId: "2",
      branchOfficeId: "b3",
      createdAt: "2024-02-05",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<KioskStatus | "all">("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingKiosk, setEditingKiosk] = useState<Kiosk | null>(null);

  const statusColors: Record<KioskStatus, { bg: string; text: string; icon: React.ReactNode }> = {
    free: { bg: "bg-green-500/10", text: "text-green-500", icon: <CheckCircle size={14} /> },
    payment: { bg: "bg-blue-500/10", text: "text-blue-500", icon: <Zap size={14} /> },
    active: { bg: "bg-cyan-500/10", text: "text-cyan-500", icon: <Zap size={14} /> },
    pause: { bg: "bg-yellow-500/10", text: "text-yellow-500", icon: <Pause size={14} /> },
    finish: { bg: "bg-purple-500/10", text: "text-purple-500", icon: <CheckCircle size={14} /> },
    error: { bg: "bg-red-500/10", text: "text-red-500", icon: <AlertCircle size={14} /> },
    closed: { bg: "bg-gray-500/10", text: "text-gray-500", icon: <AlertCircle size={14} /> },
  };

  const getStatusLabel = (status: KioskStatus) => {
    const labels: Record<KioskStatus, string> = {
      free: t("statusFree"),
      payment: t("statusPayment"),
      active: t("statusActive"),
      pause: t("statusPause"),
      finish: t("statusFinish"),
      error: t("statusError"),
      closed: t("statusClosed"),
    };
    return labels[status];
  };

  const filteredKiosks = kiosks.filter((kiosk) => {
    const matchesSearch =
      kiosk.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kiosk.controllerMacAddress.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || kiosk.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddKiosk = (formData: Omit<Kiosk, "id" | "createdAt">) => {
    const newKiosk: Kiosk = {
      ...formData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split("T")[0],
    };
    setKiosks([...kiosks, newKiosk]);
    setIsFormOpen(false);
  };

  const handleUpdateKiosk = (formData: Omit<Kiosk, "id" | "createdAt">) => {
    if (!editingKiosk) return;
    const updatedKiosks = kiosks.map((kiosk) =>
      kiosk.id === editingKiosk.id ? { ...kiosk, ...formData } : kiosk
    );
    setKiosks(updatedKiosks);
    setEditingKiosk(null);
    setIsFormOpen(false);
  };

  const handleDeleteKiosk = (id: string) => {
    if (confirm(t("deleteKioskConfirm"))) {
      setKiosks(kiosks.filter((kiosk) => kiosk.id !== id));
    }
  };

  const handleEditKiosk = (kiosk: Kiosk) => {
    setEditingKiosk(kiosk);
    setIsFormOpen(true);
  };

  const closeModal = () => {
    setIsFormOpen(false);
    setEditingKiosk(null);
  };

  const statusCounts = {
    all: kiosks.length,
    active: kiosks.filter((k) => k.status === "active").length,
    error: kiosks.filter((k) => k.status === "error").length,
    free: kiosks.filter((k) => k.status === "free").length,
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{t("kiosks")}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("total")} {kiosks.length} ta
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingKiosk(null);
            setIsFormOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2 w-full sm:w-auto"
        >
          <Plus size={20} />
          {t("newKiosk")}
        </Button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
        <Card className="bg-card border border-border/20 p-3 sm:p-4">
          <p className="text-muted-foreground text-[10px] sm:text-sm mb-1">{t("total")}</p>
          <p className="text-xl sm:text-2xl font-bold text-foreground">{statusCounts.all}</p>
        </Card>
        <Card className="bg-card border border-border/20 p-3 sm:p-4">
          <p className="text-muted-foreground text-[10px] sm:text-sm mb-1">{t("statusActive")}</p>
          <p className="text-xl sm:text-2xl font-bold text-cyan-500">{statusCounts.active}</p>
        </Card>
        <Card className="bg-card border border-border/20 p-3 sm:p-4">
          <p className="text-muted-foreground text-[10px] sm:text-sm mb-1">{t("statusFree")}</p>
          <p className="text-xl sm:text-2xl font-bold text-green-500">{statusCounts.free}</p>
        </Card>
        <Card className="bg-card border border-border/20 p-3 sm:p-4">
          <p className="text-muted-foreground text-[10px] sm:text-sm mb-1">{t("statusError")}</p>
          <p className="text-xl sm:text-2xl font-bold text-red-500">{statusCounts.error}</p>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <Card className="bg-card border border-border/20 p-3 sm:p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder={t("searchKioskPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-input text-foreground border-border/30 text-sm"
            />
          </div>
        </Card>

        <Card className="bg-card border border-border/20 p-3 sm:p-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as KioskStatus | "all")}
            className="w-full px-3 py-2 bg-input text-foreground border border-border/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="all">{t("allStatuses")}</option>
            <option value="free">{t("statusFree")}</option>
            <option value="payment">{t("statusPayment")}</option>
            <option value="active">{t("statusActive")}</option>
            <option value="pause">{t("statusPause")}</option>
            <option value="finish">{t("statusFinish")}</option>
            <option value="error">{t("statusError")}</option>
            <option value="closed">{t("statusClosed")}</option>
          </select>
        </Card>
      </div>

      {/* Kiosk Form Modal */}
      {isFormOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <Card
            className="w-full max-w-md bg-card border border-border/20 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                  {editingKiosk ? t("editKiosk") : t("newKiosk")}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-muted-foreground hover:text-foreground p-1 hover:bg-accent rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <KioskForm
                kiosk={editingKiosk}
                onSubmit={editingKiosk ? handleUpdateKiosk : handleAddKiosk}
                onCancel={closeModal}
              />
            </div>
          </Card>
        </div>
      )}

      {/* Mobile Cards View */}
      <div className="block sm:hidden space-y-3">
        {filteredKiosks.length === 0 ? (
          <Card className="bg-card border border-border/20 p-6 text-center">
            <p className="text-muted-foreground">{t("kioskNotFound")}</p>
          </Card>
        ) : (
          filteredKiosks.map((kiosk) => {
            const statusStyle = statusColors[kiosk.status];
            return (
              <Card key={kiosk.id} className="bg-card border border-border/20 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground truncate">{kiosk.name}</p>
                    <p className="text-xs text-muted-foreground font-mono mt-1">{kiosk.controllerMacAddress}</p>
                  </div>
                  <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                    {statusStyle.icon}
                    {getStatusLabel(kiosk.status)}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${kiosk.isActive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                    {kiosk.isActive ? t("yes") : t("no")}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditKiosk(kiosk)}
                      className="p-2 hover:bg-blue-500/10 text-blue-500 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteKiosk(kiosk.id)}
                      className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Desktop Table View */}
      <Card className="hidden sm:block bg-card border border-border/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border/20 bg-sidebar/20">
              <tr>
                <th className="px-3 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-semibold text-foreground">
                  {t("kioskName")}
                </th>
                <th className="px-3 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-semibold text-foreground">
                  {t("status")}
                </th>
                <th className="hidden md:table-cell px-3 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-semibold text-foreground">
                  {t("macAddress")}
                </th>
                <th className="px-3 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-semibold text-foreground">
                  {t("active")}
                </th>
                <th className="hidden lg:table-cell px-3 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-semibold text-foreground">
                  {t("date")}
                </th>
                <th className="px-3 lg:px-6 py-3 lg:py-4 text-right text-xs lg:text-sm font-semibold text-foreground">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredKiosks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    {t("kioskNotFound")}
                  </td>
                </tr>
              ) : (
                filteredKiosks.map((kiosk) => {
                  const statusStyle = statusColors[kiosk.status];
                  return (
                    <tr
                      key={kiosk.id}
                      className="border-b border-border/20 hover:bg-sidebar/10 transition-colors"
                    >
                      <td className="px-3 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm font-medium text-foreground">{kiosk.name}</td>
                      <td className="px-3 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm">
                        <div className={`inline-flex items-center gap-1.5 px-2 lg:px-3 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                          {statusStyle.icon}
                          <span className="hidden lg:inline">{getStatusLabel(kiosk.status)}</span>
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-3 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm text-muted-foreground font-mono">
                        {kiosk.controllerMacAddress}
                      </td>
                      <td className="px-3 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${kiosk.isActive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                          {kiosk.isActive ? t("yes") : t("no")}
                        </span>
                      </td>
                      <td className="hidden lg:table-cell px-3 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm text-muted-foreground">{kiosk.createdAt}</td>
                      <td className="px-3 lg:px-6 py-3 lg:py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleEditKiosk(kiosk)}
                            className="p-1.5 lg:p-2 hover:bg-blue-500/10 text-blue-500 rounded-lg transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteKiosk(kiosk.id)}
                            className="p-1.5 lg:p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
