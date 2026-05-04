import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Card, Button, Modal, Space, Tag, Typography } from "antd";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { crud } from "@/lib/api";
import DataTable, { Column } from "@/components/Table/DataTable";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import UserForm from "./components/user-form";
import { toast } from "sonner";
import type { ApiUser, UserFormData } from "./type";

const { Title, Text } = Typography;

const API_PATH = "/platform/users";

export default function UsersPage() {
  const { t } = useTranslation();

  const [users, setUsers] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<ApiUser | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ApiUser | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await crud.getAll<ApiUser[]>(API_PATH);
      setUsers(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.message || t("fetchError"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSubmit = async (formData: UserFormData) => {
    setFormLoading(true);
    try {
      if (editingUser) {
        await crud.update(API_PATH, editingUser.id, formData);
        toast.success(t("updateSuccess"));
      } else {
        await crud.create(API_PATH, formData);
        toast.success(t("createSuccess"));
      }
      closeModal();
      await fetchUsers();
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
      fetchUsers();
    } catch (err: any) {
      toast.error(err?.message || t("deleteError"));
    } finally {
      setDeleteLoading(false);
    }
  };

  const openCreate = () => {
    setEditingUser(null);
    setIsFormOpen(true);
  };

  const openEdit = (user: ApiUser) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const closeModal = () => {
    setIsFormOpen(false);
    setEditingUser(null);
  };

  const columns: Column<ApiUser>[] = [
    {
      key: "name",
      header: t("name"),
      searchable: true,
      render: (val) => (
        <Text strong className="text-foreground">{val}</Text>
      ),
    },
    {
      key: "email",
      header: t("email"),
      searchable: true,
      maxWidth: "200px",
      render: (val) => (
        <Text className="truncate block max-w-[150px] lg:max-w-[200px] text-foreground">
          {val}
        </Text>
      ),
    },
    {
      key: "phone",
      header: t("phone"),
      hideOnMobile: true,
      searchable: true,
      render: (val) => (
        <Text className="text-muted-foreground">{val || "-"}</Text>
      ),
    },
    {
      key: "is_super",
      header: t("role"),
      searchable: false,
      render: (val) => (
        <Tag color={val ? "volcano" : "blue"} className="rounded-full px-3 border-none">
          {val ? "Super Admin" : "Admin"}
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
      key: "status",
      header: t("status"),
      hideOnTablet: true,
      searchable: false,
      render: (val) => (
        <Tag color={val === 'active' ? "success" : "default"} className="rounded-full px-3 border-none">
          {val === 'active' ? t("active") : t("Deleted")}
        </Tag>
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

  const renderMobileCard = (user: ApiUser) => (
    <Card bordered={false} className="bg-card border border-border/20 shadow-sm" styles={{ body: { padding: '16px' } }}>
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0 flex-1">
          <Text strong className="text-foreground block truncate">{user.name}</Text>
          <Text size="small" className="text-muted-foreground block truncate">{user.email}</Text>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <Tag color={user.status === 'active' ? "success" : "default"} className="rounded-full px-2 border-none mr-0">
            {user.status === 'active' ? t("active") : t("inactive")}
          </Tag>
          <Tag color={user.is_super ? "volcano" : "blue"} className="rounded-full px-2 border-none mr-0">
            {user.is_super ? "Super" : "Admin"}
          </Tag>
        </div>
      </div>
      <div className="flex items-center justify-between text-sm">
        <Text className="text-muted-foreground">{user.phone || "-"}</Text>
        <Space size="small">
          <Button
            type="text"
            icon={<Edit2 size={16} />}
            onClick={() => openEdit(user)}
            className="text-blue-500"
          />
          <Button
            type="text"
            icon={<Trash2 size={16} />}
            onClick={() => setDeleteTarget(user)}
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
            {t("users")}
          </Title>
          <Text className="text-muted-foreground">
            {t("total")} {users.length} {t("userCount")}
          </Text>
        </div>
        <Button
          type="primary"
          icon={<Plus size={20} />}
          onClick={openCreate}
          size="large"
          className="bg-blue-600 hover:bg-blue-700 h-11"
        >
          {t("newUser")}
        </Button>
      </div>

      <DataTable
        data={users}
        columns={columns}
        loading={loading}
        error={error}
        onRetry={fetchUsers}
        searchPlaceholder={t("searchUserPlaceholder")}
        getRowId={(u) => u.id}
        renderMobileCard={renderMobileCard}
        emptyMessage={t("userNotFound")}
      />

      <Modal
        title={editingUser ? t("editUser") : t("newUser")}
        open={isFormOpen}
        onCancel={closeModal}
        footer={null}
        width={640}
        destroyOnClose
        styles={{ body: { paddingTop: '12px' } }}
      >
        <UserForm
          user={editingUser}
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
        title={t("deleteUserConfirmTitle")}
        message={t("deleteUserConfirmMessage")}
        itemName={deleteTarget?.name}
      />
    </div>
  );
}
