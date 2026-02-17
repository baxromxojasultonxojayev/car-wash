import type React from "react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

// API bilan mos keluvchi fieldlar
export interface UserFormData {
    name: string;
    phone: string;
    email: string;
    is_super: boolean;
    password: string;
}

interface UserFormProps {
    user?: any | null;
    onSubmit: (data: UserFormData) => void;
    onCancel: () => void;
    loading?: boolean;
}

export default function UserForm({ user, onSubmit, onCancel, loading }: UserFormProps) {
    const { t } = useTranslation();
    const [formData, setFormData] = useState<UserFormData>({
        name: "",
        phone: "",
        email: "",
        is_super: false,
        password: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                phone: user.phone || "",
                email: user.email || "",
                is_super: user.is_super ?? false,
                password: "",
            });
        }
    }, [user]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = t("userNameRequired");
        }

        if (!formData.phone.trim()) {
            newErrors.phone = t("userPhoneRequired");
        }

        if (!formData.email.trim()) {
            newErrors.email = t("userEmailRequired");
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = t("userEmailInvalid");
        }

        if (!user && !formData.password) {
            newErrors.password = t("userPasswordRequired");
        } else if (formData.password && formData.password.length < 6) {
            newErrors.password = t("userPasswordMinLength");
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            const submitData = { ...formData };
            if (user && !submitData.password) {
                const { password, ...rest } = submitData;
                onSubmit(rest as any);
            } else {
                onSubmit(submitData);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    {t("name")}
                </label>
                <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-input text-foreground border-border/30"
                    placeholder={t("userNamePlaceholder")}
                />
                {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
            </div>

            {/* Phone */}
            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    {t("phone")}
                </label>
                <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-input text-foreground border-border/30"
                    placeholder="998901234567"
                />
                {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
            </div>

            {/* Email */}
            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    {t("email")}
                </label>
                <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-input text-foreground border-border/30"
                    placeholder="user@example.com"
                />
                {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
            </div>

            {/* Password */}
            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    {t("password")} {user && <span className="text-muted-foreground font-normal">({t("userPasswordOptional")})</span>}
                </label>
                <div className="relative">
                    <Input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="bg-input text-foreground border-border/30 pr-10"
                        placeholder={user ? t("userNewPasswordPlaceholder") : t("enterPassword")}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>
                {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
            </div>

            {/* Is Super Admin */}
            <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={formData.is_super}
                        onChange={(e) => setFormData({ ...formData, is_super: e.target.checked })}
                        className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-border/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
                <span className="text-sm font-medium text-foreground">Super Admin</span>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
                <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                    {loading ? t("saving") : t("save")}
                </Button>
                <Button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="flex-1 bg-sidebar hover:bg-sidebar/80 text-foreground"
                >
                    {t("cancel")}
                </Button>
            </div>
        </form>
    );
}
