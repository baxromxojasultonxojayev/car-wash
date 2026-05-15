import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Card, Button, Modal, Space, Typography, Switch } from "antd";
import { Plus, Edit2, Trash2, RotateCcw, Navigation } from "lucide-react";
import DataTable, { Column } from "@/components/Table/DataTable";
import DeleteConfirmModal from "../users/components/DeleteConfirmModal";
import OrgForm from "./components/org-form";
import OrgDetailsModal from "./components/OrgDetailsModal";
import { useOrganizations } from "./hooks/useOrganizations";
import type { ApiOrganization } from "./type";

const { Title, Text } = Typography;

export default function OrganizationsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
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
    setDetailsLoading,
    detailsLoading,
    actionLoading,
    fetchOrganizations,
    handleSubmit,
    handleDeleteConfirm,
    handleToggleStatus,
    handleRestore,
    handleViewDetails,
  } = useOrganizations();

  const columns: Column<ApiOrganization>[] = [
    {
      key: "display_name",
      header: t("organizationName"),
      searchable: true,
      render: (val) => <Text strong>{val}</Text>,
    },
    {
      key: "address",
      header: t("address"),
      searchable: true,
      hideOnMobile: true,
      render: (val) => <Text className="text-muted-foreground font-mono text-xs">{val || "-"}</Text>,
    },
    {
      key: "phone",
      header: t("phone"),
      searchable: true,
      hideOnTablet: true,
      render: (val) => <Text className="text-muted-foreground">{val || "-"}</Text>,
    },
    {
      key: "status",
      header: t("status"),
      align: "center",
      render: (val, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          {val === 'deleted' ? (
            <Button
              size="small"
              icon={<RotateCcw size={14} />}
              onClick={() => handleRestore(row)}
              loading={actionLoading[row.id]}
            >
              {t("restore")}
            </Button>
          ) : (
            <Switch
              checked={val === 'active'}
              loading={actionLoading[row.id]}
              onChange={(checked) => handleToggleStatus(row, checked)}
              size="small"
            />
          )}
        </div>
      ),
    },
    {
      key: "actions",
      header: t("actions"),
      align: "right",
      render: (_, row) => (
        <Space size="small" onClick={(e) => e.stopPropagation()}>
          <Button
            type="text"
            icon={<Navigation size={16} />}
            onClick={() => navigate(`/branches?org_id=${row.id}`)}
            className="text-emerald-500 hover:bg-emerald-500/10"
            title={t("viewBranches") || "Filiallarni ko'rish"}
          />
          <Button
            type="text"
            icon={<Edit2 size={16} />}
            onClick={() => { setEditingOrg(row); setIsFormOpen(true); }}
            className="text-blue-500 hover:bg-blue-500/10"
          />
          <Button
            type="text"
            icon={<Trash2 size={16} />}
            onClick={() => setDeleteTarget(row)}
            className="text-red-500 hover:bg-red-500/10"
          />
        </Space>
      ),
    },
  ];

  const renderMobileCard = (org: ApiOrganization) => (
    <Card
      bordered={false}
      className="bg-card border border-border/20 shadow-sm"
      styles={{ body: { padding: '16px' } }}
      onClick={() => handleViewDetails(org)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0 flex-1">
          <Text strong className="block truncate">{org.display_name}</Text>
          <Text className="text-muted-foreground block truncate text-xs">{org.inn}</Text>
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          {org.status === 'deleted' ? (
            <Button size="small" onClick={() => handleRestore(org)} loading={actionLoading[org.id]}>{t("restore")}</Button>
          ) : (
            <Switch
              checked={org.status === 'active'}
              onChange={(checked) => handleToggleStatus(org, checked)}
              size="small"
              loading={actionLoading[org.id]}
            />
          )}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Text className="text-muted-foreground text-sm">{org.phone || "-"}</Text>
        <Space size="small" onClick={(e) => e.stopPropagation()}>
          <Button type="text" icon={<Edit2 size={16} />} onClick={() => { setEditingOrg(org); setIsFormOpen(true); }} className="text-blue-500" />
          <Button type="text" icon={<Trash2 size={16} />} onClick={() => setDeleteTarget(org)} className="text-red-500" />
        </Space>
      </div>
    </Card>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <Title level={2} className="!mb-0">{t("organizations")}</Title>
          <Text className="text-muted-foreground">{t("manageOrganizations")}</Text>
        </div>
        <Button
          type="primary"
          icon={<Plus size={20} />}
          onClick={() => { setEditingOrg(null); setIsFormOpen(true); }}
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
        getRowId={(o) => o.id}
        renderMobileCard={renderMobileCard}
        onRowClick={handleViewDetails}
      />

      <Modal
        title={editingOrg ? t("editOrganization") : t("newOrganization")}
        open={isFormOpen}
        onCancel={() => { setIsFormOpen(false); setEditingOrg(null); }}
        footer={null}
        width={640}
        destroyOnClose
        centered
      >
        <OrgForm
          organization={editingOrg}
          onSubmit={handleSubmit}
          onCancel={() => { setIsFormOpen(false); setEditingOrg(null); }}
          loading={formLoading}
        />
      </Modal>

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
        itemName={deleteTarget?.display_name}
      />

      <OrgDetailsModal
        visible={!!detailsTarget}
        onCancel={() => { setDetailsTarget(null); setDetailsLoading(false); }}
        loading={detailsLoading}
        data={detailsData}
      />
    </div>
  );
}
