import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit2, Trash2, Search, X } from "lucide-react";
import UserForm from "@/components/users/user-form";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: "SuperAdmin" | "Admin" | "User";
  createdAt: string;
}

export default function UsersPage() {
  const { t } = useTranslation();

  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      email: "admin@carwash.com",
      firstName: "Admin",
      lastName: "User",
      phoneNumber: "+998901234567",
      role: "SuperAdmin",
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      email: "manager@carwash.com",
      firstName: "Manager",
      lastName: "One",
      phoneNumber: "+998902345678",
      role: "Admin",
      createdAt: "2024-01-20",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = (formData: Omit<User, "id" | "createdAt">) => {
    const newUser: User = {
      ...formData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split("T")[0],
    };
    setUsers([...users, newUser]);
    setIsFormOpen(false);
  };

  const handleUpdateUser = (formData: Omit<User, "id" | "createdAt">) => {
    if (!editingUser) return;
    const updatedUsers = users.map((user) =>
      user.id === editingUser.id ? { ...user, ...formData } : user
    );
    setUsers(updatedUsers);
    setEditingUser(null);
    setIsFormOpen(false);
  };

  const handleDeleteUser = (id: string) => {
    if (confirm(t("deleteUserConfirm"))) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const closeModal = () => {
    setIsFormOpen(false);
    setEditingUser(null);
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      SuperAdmin: "bg-red-500/10 text-red-500",
      Admin: "bg-blue-500/10 text-blue-500",
      User: "bg-green-500/10 text-green-500",
    };
    return colors[role] || "bg-gray-500/10 text-gray-500";
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{t("users")}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("total")} {users.length} ta
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingUser(null);
            setIsFormOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2 w-full sm:w-auto"
        >
          <Plus size={20} />
          {t("newUser")}
        </Button>
      </div>

      {/* Search */}
      <Card className="bg-card border border-border/20 p-3 sm:p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder={t("searchUserPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-input text-foreground border-border/30 text-sm"
          />
        </div>
      </Card>

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
                onSubmit={editingUser ? handleUpdateUser : handleAddUser}
                onCancel={closeModal}
              />
            </div>
          </Card>
        </div>
      )}

      {/* Mobile Cards View */}
      <div className="block sm:hidden space-y-3">
        {filteredUsers.length === 0 ? (
          <Card className="bg-card border border-border/20 p-6 text-center">
            <p className="text-muted-foreground">{t("userNotFound")}</p>
          </Card>
        ) : (
          filteredUsers.map((user) => (
            <Card key={user.id} className="bg-card border border-border/20 p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground truncate">{user.firstName} {user.lastName}</p>
                  <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                  {user.role}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{user.phoneNumber || "-"}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="p-2 hover:bg-blue-500/10 text-blue-500 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <Card className="hidden sm:block bg-card border border-border/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border/20 bg-sidebar/20">
              <tr>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-semibold text-foreground">
                  {t("email")}
                </th>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-semibold text-foreground">
                  {t("firstName")} - {t("lastName")}
                </th>
                <th className="hidden md:table-cell px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-semibold text-foreground">
                  {t("phone")}
                </th>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-semibold text-foreground">
                  {t("role")}
                </th>
                <th className="hidden lg:table-cell px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-semibold text-foreground">
                  {t("date")}
                </th>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-right text-xs lg:text-sm font-semibold text-foreground">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    {t("userNotFound")}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-border/20 hover:bg-sidebar/10 transition-colors"
                  >
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm text-foreground">
                      <span className="truncate block max-w-[150px] lg:max-w-none">{user.email}</span>
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm text-foreground">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="hidden md:table-cell px-4 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm text-muted-foreground">
                      {user.phoneNumber || "-"}
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm">
                      <span className={`px-2 lg:px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="hidden lg:table-cell px-4 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm text-muted-foreground">
                      {user.createdAt}
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-right">
                      <div className="flex items-center justify-end gap-1 lg:gap-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-1.5 lg:p-2 hover:bg-blue-500/10 text-blue-500 rounded-lg transition-colors"
                          title={t("edit")}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-1.5 lg:p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                          title={t("delete")}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
