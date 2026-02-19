import type React from "react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, User, Phone, Mail, Lock, ShieldCheck, AlertCircle } from "lucide-react";
import type { UserFormData, UserFormProps } from "../type";


export default function UserForm({ user, onSubmit, onCancel, loading }: UserFormProps) {
    const { t } = useTranslation();
    const [formData, setFormData] = useState<UserFormData>({
        name: user?.name || "",
        phone: user?.phone || "",
        email: user?.email || "",
        is_super: user?.is_super ?? false,
        password: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                phone: user.phone || "",
                email: user.email || "",
                is_super: user.is_super ?? false,
                password: "",
            });
            setErrors({});
            setTouched({});
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
        setTouched({ name: true, phone: true, email: true, password: true });
        return Object.keys(newErrors).length === 0;
    };

    const handleBlur = (field: string) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            await onSubmit({ ...formData });
        }
    };

    const hasError = (field: string) => touched[field] && errors[field];

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                    <User size={14} className="text-blue-500" />
                    {t("name")}
                </label>
                <div className="relative">
                    <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        onBlur={() => handleBlur("name")}
                        className={`bg-background/50 text-foreground transition-all duration-200 ${hasError("name")
                            ? "border-red-500/70 focus:border-red-500 focus:ring-red-500/20"
                            : "border-border/40 focus:border-blue-500 focus:ring-blue-500/20"
                            }`}
                        placeholder={t("userNamePlaceholder")}
                    />
                </div>
                {hasError("name") && (
                    <p className="flex items-center gap-1 text-red-500 text-xs mt-1 animate-in slide-in-from-top-1 duration-200">
                        <AlertCircle size={12} />
                        {errors.name}
                    </p>
                )}
            </div>

            <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                    <Phone size={14} className="text-emerald-500" />
                    {t("phone")}
                </label>
                <div className="relative">
                    <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        onBlur={() => handleBlur("phone")}
                        className={`bg-background/50 text-foreground transition-all duration-200 ${hasError("phone")
                            ? "border-red-500/70 focus:border-red-500 focus:ring-red-500/20"
                            : "border-border/40 focus:border-blue-500 focus:ring-blue-500/20"
                            }`}
                        placeholder="998901234567"
                    />
                </div>
                {hasError("phone") && (
                    <p className="flex items-center gap-1 text-red-500 text-xs mt-1 animate-in slide-in-from-top-1 duration-200">
                        <AlertCircle size={12} />
                        {errors.phone}
                    </p>
                )}
            </div>

            <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                    <Mail size={14} className="text-violet-500" />
                    {t("email")}
                </label>
                <div className="relative">
                    <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        onBlur={() => handleBlur("email")}
                        className={`bg-background/50 text-foreground transition-all duration-200 ${hasError("email")
                            ? "border-red-500/70 focus:border-red-500 focus:ring-red-500/20"
                            : "border-border/40 focus:border-blue-500 focus:ring-blue-500/20"
                            }`}
                        placeholder="user@example.com"
                    />
                </div>
                {hasError("email") && (
                    <p className="flex items-center gap-1 text-red-500 text-xs mt-1 animate-in slide-in-from-top-1 duration-200">
                        <AlertCircle size={12} />
                        {errors.email}
                    </p>
                )}
            </div>

            <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                    <Lock size={14} className="text-amber-500" />
                    {t("password")}
                    {user && (
                        <span className="text-muted-foreground/70 font-normal text-xs ml-1">
                            ({t("userPasswordOptional")})
                        </span>
                    )}
                </label>
                <div className="relative">
                    <Input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        onBlur={() => handleBlur("password")}
                        className={`bg-background/50 text-foreground pr-10 transition-all duration-200 ${hasError("password")
                            ? "border-red-500/70 focus:border-red-500 focus:ring-red-500/20"
                            : "border-border/40 focus:border-blue-500 focus:ring-blue-500/20"
                            }`}
                        placeholder={user ? t("userNewPasswordPlaceholder") : t("enterPassword")}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors duration-200"
                    >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>
                {hasError("password") && (
                    <p className="flex items-center gap-1 text-red-500 text-xs mt-1 animate-in slide-in-from-top-1 duration-200">
                        <AlertCircle size={12} />
                        {errors.password}
                    </p>
                )}
            </div>

            <div
                onClick={() => setFormData({ ...formData, is_super: !formData.is_super })}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 border ${formData.is_super
                    ? "bg-blue-500/10 border-blue-500/30"
                    : "bg-background/30 border-border/20 hover:border-border/40"
                    }`}
            >
                <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${formData.is_super
                    ? "bg-blue-500/20 text-blue-500"
                    : "bg-muted/50 text-muted-foreground"
                    }`}>
                    <ShieldCheck size={18} />
                </div>
                <div className="flex-1">
                    <span className="text-sm font-medium text-foreground">Super Admin</span>
                    <p className="text-xs text-muted-foreground/70">
                        {t("superAdmin")}
                    </p>
                </div>
                <div className="relative">
                    <input
                        type="checkbox"
                        checked={formData.is_super}
                        onChange={(e) => setFormData({ ...formData, is_super: e.target.checked })}
                        className="sr-only peer"
                    />
                    <div className={`w-10 h-[22px] rounded-full transition-all duration-300 ${formData.is_super ? "bg-blue-500" : "bg-border/60"
                        }`}>
                        <div className={`absolute top-[3px] w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${formData.is_super ? "left-[22px]" : "left-[3px]"
                            }`} />
                    </div>
                </div>
            </div>

            <div className="flex gap-3 pt-2">
                <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-200 h-10"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            {t("saving")}
                        </span>
                    ) : t("save")}
                </Button>
                <Button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    variant="outline"
                    className="flex-1 border-border/30 hover:bg-accent/50 text-foreground transition-all duration-200 h-10"
                >
                    {t("cancel")}
                </Button>
            </div>
        </form>
    );
}
