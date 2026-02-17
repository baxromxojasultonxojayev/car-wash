import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import { crud } from "@/lib/api";
import DataTable, { Column } from "@/components/Table/DataTable";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import UserForm, { UserFormData } from "./components/user-form";
import { toast } from "sonner";

// API dan keladigan User modeli
interface ApiUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  is_super: boolean;
  created_at?: string;
}

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

  // ─── Fetch users ─────────────────────────────────────────────

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

  // ─── Create / Update ────────────────────────────────────────

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
      fetchUsers();
    } catch (err: any) {
      toast.error(err?.message || t("saveError"));
    } finally {
      setFormLoading(false);
    }
  };

  // ─── Delete ──────────────────────────────────────────────────

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

  // ─── Modal ───────────────────────────────────────────────────

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

  // ─── Table columns ──────────────────────────────────────────

  const getRoleColor = (isSuper: boolean) =>
    isSuper
      ? "bg-red-500/10 text-red-500"
      : "bg-blue-500/10 text-blue-500";

  const columns: Column<ApiUser>[] = [
    {
      key: "name",
      header: t("name"),
      searchable: true,
      render: (val) => (
        <span className="font-medium text-foreground">{val}</span>
      ),
    },
    {
      key: "email",
      header: t("email"),
      searchable: true,
      maxWidth: "200px",
      render: (val) => (
        <span className="truncate block max-w-[150px] lg:max-w-[200px] text-foreground">
          {val}
        </span>
      ),
    },
    {
      key: "phone",
      header: t("phone"),
      hideOnMobile: true,
      searchable: true,
      render: (val) => (
        <span className="text-muted-foreground">{val || "-"}</span>
      ),
    },
    {
      key: "is_super",
      header: t("role"),
      searchable: false,
      render: (val) => (
        <span
          className={`px-2 lg:px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(val)}`}
        >
          {val ? "Super Admin" : "Admin"}
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

  // ─── Mobile card ─────────────────────────────────────────────

  const renderMobileCard = (user: ApiUser) => (
    <Card className="bg-card border border-border/20 p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0 flex-1">
          <p className="font-medium text-foreground truncate">{user.name}</p>
          <p className="text-sm text-muted-foreground truncate">{user.email}</p>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.is_super)}`}
        >
          {user.is_super ? "Super Admin" : "Admin"}
        </span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{user.phone || "-"}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => openEdit(user)}
            className="p-2 hover:bg-blue-500/10 text-blue-500 rounded-lg transition-colors"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => setDeleteTarget(user)}
            className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </Card>
  );

  // ─── Render ──────────────────────────────────────────────────

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            {t("users")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("total")} {users.length} {t("userCount")}
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2 w-full sm:w-auto"
        >
          <Plus size={20} />
          {t("newUser")}
        </Button>
      </div>

      {/* Data Table */}
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

      {/* User Form Modal */}
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
                  {editingUser ? t("editUser") : t("newUser")}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-muted-foreground hover:text-foreground p-1 hover:bg-accent rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <UserForm
                user={editingUser}
                onSubmit={handleSubmit}
                onCancel={closeModal}
                loading={formLoading}
              />
            </div>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Modal */}
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
