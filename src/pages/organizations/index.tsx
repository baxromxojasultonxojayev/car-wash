import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Card, Button, Modal, Space, Tag, Typography } from "antd";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { crud } from "@/lib/api";
import DataTable, { Column } from "@/components/Table/DataTable";
import DeleteConfirmModal from "../users/components/DeleteConfirmModal";
import OrgForm from "./components/org-form";
import { toast } from "sonner";
import type { ApiOrganization, OrgFormData } from "./type";

const { Title, Text } = Typography;

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
        <Text strong className="text-foreground">{val}</Text>
      ),
    },
    {
      key: "legal_name",
      header: t("legalName") || "Legal Name",
      searchable: true,
      hideOnMobile: true,
      render: (val) => (
        <Text className="text-muted-foreground">{val || "-"}</Text>
      ),
    },
    {
      key: "tax_id",
      header: "Tax ID",
      searchable: false,
      hideOnTablet: true,
      render: (val) => (
        <Text className="text-muted-foreground font-mono text-xs">{val || "-"}</Text>
      ),
    },
    {
      key: "status",
      header: t("status"),
      searchable: false,
      render: (val) => (
        <Tag
          color={val === "active" ? "success" : "warning"}
          className="rounded-full px-3 py-0.5 border-none"
        >
          {val === "active" ? t("active") : t("inactive")}
        </Tag>
      ),
    },
    {
      key: "created_at",
      header: t("date"),
      hideOnTablet: true,
      searchable: false,
      render: (val) => (
        <Text className="text-muted-foreground">
          {val ? new Date(val).toLocaleDateString() : "-"}
        </Text>
      ),
    },
    {
      key: "actions",
      header: t("actions"),
      align: "right",
      searchable: false,
      render: (_val, row) => (
        <Space size="small">
          <Button
            type="text"
            icon={<Edit2 size={16} />}
            onClick={() => openEdit(row)}
            className="text-blue-500 hover:bg-blue-500/10"
            title={t("edit")}
          />
          <Button
            type="text"
            icon={<Trash2 size={16} />}
            onClick={() => setDeleteTarget(row)}
            className="text-red-500 hover:bg-red-500/10"
            title={t("delete")}
          />
        </Space>
      ),
    },
  ];

  const renderMobileCard = (org: ApiOrganization) => (
    <Card bordered={false} className="bg-card border border-border/20 shadow-sm" styles={{ body: { padding: '16px' } }}>
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0 flex-1">
          <Text strong className="text-foreground block truncate">{org.display_name}</Text>
          <Text size="small" className="text-muted-foreground block truncate">{org.legal_name}</Text>
        </div>
        <Tag
          color={org.status === "active" ? "success" : "warning"}
          className="rounded-full px-2 border-none"
        >
          {org.status === "active" ? t("active") : t("inactive")}
        </Tag>
      </div>
      <div className="flex items-center justify-between text-sm">
        <Text className="text-muted-foreground font-mono text-xs">{org.tax_id || "-"}</Text>
        <Space size="small">
          <Button
            type="text"
            icon={<Edit2 size={16} />}
            onClick={() => openEdit(org)}
            className="text-blue-500"
          />
          <Button
            type="text"
            icon={<Trash2 size={16} />}
            onClick={() => setDeleteTarget(org)}
            className="text-red-500"
          />
        </Space>
      </div>
    </Card>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <Title level={2} className="!mb-0 !text-foreground">
            {t("organizations")}
          </Title>
          <Text className="text-muted-foreground">
            {t("manageOrganizations")}
          </Text>
        </div>
        <Button
          type="primary"
          icon={<Plus size={20} />}
          onClick={openCreate}
          size="large"
          className="bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
        >
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

      <Modal
        title={editingOrg ? t("editOrganization") : t("newOrganization")}
        open={isFormOpen}
        onCancel={closeModal}
        footer={null}
        width={640}
        destroyOnClose
        styles={{ body: { paddingTop: '12px' } }}
      >
        <OrgForm
          organization={editingOrg}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          loading={formLoading}
        />
      </Modal>

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
