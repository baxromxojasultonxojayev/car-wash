

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UserFormData {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: "SuperAdmin" | "Admin" | "User";
}

interface User extends UserFormData {
  id: string;
  createdAt: string;
}

interface UserFormProps {
  user?: User | null;
  onSubmit: (data: UserFormData) => void;
  onCancel: () => void;
}

export default function UserForm({ user, onSubmit, onCancel }: UserFormProps) {
  const [formData, setFormData] = useState<UserFormData>({
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    role: "User",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber || "",
        role: user.role,
      });
    }
  }, [user]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email talab qilinadi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email noto'g'ri formatda";
    }

    if (!formData.firstName) {
      newErrors.firstName = "Ism talab qilinadi";
    }

    if (!formData.lastName) {
      newErrors.lastName = "Familya talab qilinadi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Email
        </label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="bg-input text-foreground border-border/30"
          placeholder="email@example.com"
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Ism
        </label>
        <Input
          value={formData.firstName}
          onChange={(e) =>
            setFormData({ ...formData, firstName: e.target.value })
          }
          className="bg-input text-foreground border-border/30"
          placeholder="Ism"
        />
        {errors.firstName && (
          <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Familya
        </label>
        <Input
          value={formData.lastName}
          onChange={(e) =>
            setFormData({ ...formData, lastName: e.target.value })
          }
          className="bg-input text-foreground border-border/30"
          placeholder="Familya"
        />
        {errors.lastName && (
          <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Telefon (ixtiyoriy)
        </label>
        <Input
          type="tel"
          value={formData.phoneNumber}
          onChange={(e) =>
            setFormData({ ...formData, phoneNumber: e.target.value })
          }
          className="bg-input text-foreground border-border/30"
          placeholder="+998 90 123 45 67"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Rol
        </label>
        <select
          value={formData.role}
          onChange={(e) =>
            setFormData({
              ...formData,
              role: e.target.value as UserFormData["role"],
            })
          }
          className="w-full px-3 py-2 bg-input text-foreground border border-border/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="User">Foydalanuvchi</option>
          <option value="Admin">Admin</option>
          <option value="SuperAdmin">SuperAdmin</option>
        </select>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
        >
          Saqlash
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-sidebar hover:bg-sidebar/80 text-foreground"
        >
          Bekor qilish
        </Button>
      </div>
    </form>
  );
}
