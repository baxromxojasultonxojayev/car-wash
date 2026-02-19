import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import { crud } from "@/lib/api";
import DataTable, { Column } from "@/components/Table/DataTable";
import DeleteConfirmModal from "../users/components/DeleteConfirmModal";
import OrgForm from "./components/org-form";
import { toast } from "sonner";
import type { ApiOrganization, OrgFormData } from "./type";

const API_PATH = "/platform/organizations";
const API_PATH_GET = "/organizations";

export default function OrganizationsPage() {
  const { t } = useTranslation();

  const [organizations, setOrganizations] = useState<ApiOrganization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<ApiOrganization | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ApiOrganization | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchOrganizations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await crud.getAll<ApiOrganization[]>(API_PATH_GET);
      setOrganizations(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.message || t("fetchError"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  const handleSubmit = async (formData: OrgFormData) => {
    setFormLoading(true);
    try {
      if (editingOrg) {
        await crud.update(API_PATH, editingOrg.id, formData);
        toast.success(t("updateSuccess"));
      } else {
        await crud.create(API_PATH, formData);
        toast.success(t("createSuccess"));
      }
      closeModal();
      await fetchOrganizations();
    } catch (err: any) {
      toast.error(err?.message || t("saveError"));
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await crud.remove(API_PATH, deleteTarget.id);
      toast.success(t("deleteSuccess"));
      setDeleteTarget(null);
      await fetchOrganizations();
    } catch (err: any) {
      toast.error(err?.message || t("deleteError"));
    } finally {
      setDeleteLoading(false);
    }
  };

  const openCreate = () => {
    setEditingOrg(null);
    setIsFormOpen(true);
  };

  const openEdit = (org: ApiOrganization) => {
    setEditingOrg(org);
    setIsFormOpen(true);
  };

  const closeModal = () => {
    setIsFormOpen(false);
    setEditingOrg(null);
  };

  const columns: Column<ApiOrganization>[] = [
    {
      key: "display_name",
      header: t("organizationName"),
      searchable: true,
      render: (val) => (
        <span className="font-medium text-foreground">{val}</span>
      ),
    },
    {
      key: "legal_name",
      header: t("legalName") || "Legal Name",
      searchable: true,
      hideOnMobile: true,
      render: (val) => (
        <span className="text-muted-foreground">{val || "-"}</span>
      ),
    },
    {
      key: "tax_id",
      header: "Tax ID",
      searchable: false,
      hideOnTablet: true,
      render: (val) => (
        <span className="text-muted-foreground font-mono text-xs">{val || "-"}</span>
      ),
    },
    {
      key: "status",
      header: t("status"),
      searchable: false,
      render: (val) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${val === "active"
            ? "bg-emerald-500/10 text-emerald-500"
            : "bg-orange-500/10 text-orange-500"
            }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${val === "active" ? "bg-emerald-500 animate-pulse" : "bg-orange-500"
              }`}
          />
          {val === "active" ? t("active") : t("inactive")}
        </span>
      ),
    },
    {
      key: "created_at",
      header: t("date"),
      hideOnTablet: true,
      searchable: false,
      render: (val) => (
        <span className="text-muted-foreground">
          {val ? new Date(val).toLocaleDateString() : "-"}
        </span>
      ),
    },
    {
      key: "actions",
      header: t("actions"),
      align: "right",
      searchable: false,
      render: (_val, row) => (
        <div className="flex items-center justify-end gap-1 lg:gap-2">
          <button
            onClick={() => openEdit(row)}
            className="p-1.5 lg:p-2 hover:bg-blue-500/10 text-blue-500 rounded-lg transition-colors"
            title={t("edit")}
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => setDeleteTarget(row)}
            className="p-1.5 lg:p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
            title={t("delete")}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  const renderMobileCard = (org: ApiOrganization) => (
    <Card className="bg-card border border-border/20 p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0 flex-1">
          <p className="font-medium text-foreground truncate">{org.display_name}</p>
          <p className="text-sm text-muted-foreground truncate">{org.legal_name}</p>
        </div>
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${org.status === "active"
            ? "bg-emerald-500/10 text-emerald-500"
            : "bg-orange-500/10 text-orange-500"
            }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${org.status === "active" ? "bg-emerald-500" : "bg-orange-500"
            }`} />
          {org.status === "active" ? t("active") : t("inactive")}
        </span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground font-mono text-xs">{org.tax_id || "-"}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => openEdit(org)}
            className="p-2 hover:bg-blue-500/10 text-blue-500 rounded-lg transition-colors"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => setDeleteTarget(org)}
            className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            {t("organizations")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("manageOrganizations")}
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2 w-full sm:w-auto"
        >
          <Plus size={20} />
          {t("newOrganization")}
        </Button>
      </div>

      <DataTable
        data={organizations}
        columns={columns}
        loading={loading}
        error={error}
        onRetry={fetchOrganizations}
        searchPlaceholder={t("searchOrganizationPlaceholder")}
        getRowId={(o) => o.id}
        renderMobileCard={renderMobileCard}
        emptyMessage={t("noOrganizationsFound")}
      />

      {isFormOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <Card
            className="w-full max-w-2xl bg-card border border-border/20 max-h-[90vh] overflow-y-auto shadow-2xl shadow-black/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 sm:p-8">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                  {editingOrg ? t("editOrganization") : t("newOrganization")}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-muted-foreground hover:text-foreground p-1 hover:bg-accent rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <OrgForm
                key={editingOrg?.id || "new"}
                organization={editingOrg}
                onSubmit={handleSubmit}
                onCancel={closeModal}
                loading={formLoading}
              />
            </div>
          </Card>
        </div>
      )}

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
        title={t("deleteConfirmTitle")}
        message={t("deleteConfirmMessage")}
        itemName={deleteTarget?.display_name}
      />
    </div>
  );
}
