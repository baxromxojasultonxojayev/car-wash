import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { crud, apiGet, apiPost } from "@/lib/api";
import type { ApiOrganization, OrgFormData } from "../type";

const API_PATH = "/super/organizations";

export function useOrganizations() {
  const { t } = useTranslation();
  const [organizations, setOrganizations] = useState<ApiOrganization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<ApiOrganization | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<ApiOrganization | null>(
    null,
  );
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [detailsTarget, setDetailsTarget] = useState<ApiOrganization | null>(
    null,
  );
  const [detailsData, setDetailsData] = useState<ApiOrganization | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>(
    {},
  );

  const fetchOrganizations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGet<ApiOrganization[]>(API_PATH);
      setOrganizations(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.message || t("fetchError"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleSubmit = async (formData: OrgFormData) => {
    setFormLoading(true);
    try {
      if (editingOrg) {
        await crud.patch(API_PATH, editingOrg.id, formData);
        toast.success(t("updateSuccess"));
      } else {
        await apiPost(API_PATH, formData);
        toast.success(t("createSuccess"));
      }
      setIsFormOpen(false);
      setEditingOrg(null);
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

  const handleToggleStatus = async (org: ApiOrganization, checked: boolean) => {
    const endpoint = checked ? "activate" : "deactivate";
    setActionLoading((prev) => ({ ...prev, [org.id]: true }));
    try {
      await apiPost(`${API_PATH}/${org.id}/${endpoint}`);

      setOrganizations((prev) =>
        prev.map((o) =>
          o.id === org.id
            ? { ...o, status: checked ? "active" : "deactivated" }
            : o,
        ),
      );
      toast.success(t(checked ? "activatedSuccess" : "deactivatedSuccess"));
      setTimeout(() => {
        fetchOrganizations();
      }, 500);
    } catch (err: any) {
      toast.error(err?.message || t("actionError"));
    } finally {
      setActionLoading((prev) => ({ ...prev, [org.id]: false }));
    }
  };

  const handleRestore = async (org: ApiOrganization) => {
    setActionLoading((prev) => ({ ...prev, [org.id]: true }));
    try {
      await apiPost(`${API_PATH}/${org.id}/restore`);

      // Update local state immediately
      setOrganizations((prev) =>
        prev.map((o) => (o.id === org.id ? { ...o, status: "active" } : o)),
      );

      toast.success(t("restoredSuccess"));

      // Re-fetch after a small delay
      setTimeout(fetchOrganizations, 500);
    } catch (err: any) {
      toast.error(err?.message || t("actionError"));
    } finally {
      setActionLoading((prev) => ({ ...prev, [org.id]: false }));
    }
  };

  const handleViewDetails = async (org: ApiOrganization) => {
    setDetailsTarget(org);
    setDetailsLoading(true);
    try {
      const data = await apiGet<ApiOrganization>(`${API_PATH}/${org.id}`);
      setDetailsData(data);
    } catch (err: any) {
      toast.error(err?.message || t("fetchDetailsError"));
      setDetailsTarget(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  return {
    organizations,
    loading,
    error,
    isFormOpen,
    setIsFormOpen,
    editingOrg,
    setEditingOrg,
    formLoading,
    deleteTarget,
    setDeleteTarget,
    deleteLoading,
    detailsTarget,
    setDetailsTarget,
    detailsData,
    setDetailsData,
    detailsLoading,
    setDetailsLoading,
    actionLoading,
    fetchOrganizations,
    handleSubmit,
    handleDeleteConfirm,
    handleToggleStatus,
    handleRestore,
    handleViewDetails,
  };
}
