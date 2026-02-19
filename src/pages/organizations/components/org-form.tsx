import type React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Building2,
    FileText,
    Hash,
    Percent,
    Calendar,
    MapPin,
    AlertCircle,
    Plus,
    Trash2,
    Clock,
} from "lucide-react";
import type { OrgFormData, OrgFormProps, Branch, Schedule } from "../type";

const WEEKDAYS = [
    { key: 1, uz: "Dushanba", ru: "Понедельник", en: "Monday" },
    { key: 2, uz: "Seshanba", ru: "Вторник", en: "Tuesday" },
    { key: 3, uz: "Chorshanba", ru: "Среда", en: "Wednesday" },
    { key: 4, uz: "Payshanba", ru: "Четверг", en: "Thursday" },
    { key: 5, uz: "Juma", ru: "Пятница", en: "Friday" },
    { key: 6, uz: "Shanba", ru: "Суббота", en: "Saturday" },
    { key: 7, uz: "Yakshanba", ru: "Воскресенье", en: "Sunday" },
];

function createDefaultSchedule(): Schedule[] {
    return WEEKDAYS.map((d) => ({
        weekday: d.key,
        is_closed: false,
        opens_at: "09:00:00",
        closes_at: "21:00:00",
    }));
}

const DEFAULT_BRANCH: Branch = {
    name: "",
    type: "car_wash",
    address: "",
    lat: 0,
    lon: 0,
    schedule: createDefaultSchedule(),
};

export default function OrgForm({ organization, onSubmit, onCancel, loading }: OrgFormProps) {
    const { t, i18n } = useTranslation();
    const lang = i18n.language as "uz" | "ru" | "en";

    const [formData, setFormData] = useState<OrgFormData>({
        display_name: organization?.display_name || "",
        legal_name: organization?.legal_name || "",
        tax_id: organization?.tax_id || "",
        default_take_rate: organization?.default_take_rate ?? 1,
        status: organization?.status || "active",
        starts_at: organization?.starts_at
            ? organization.starts_at.slice(0, 16)
            : new Date().toISOString().slice(0, 16),
        expires_at: organization?.expires_at
            ? organization.expires_at.slice(0, 16)
            : "",
        branches: organization?.branches?.length
            ? organization.branches.map((b) => ({
                ...b,
                schedule: b.schedule?.length === 7 ? b.schedule : createDefaultSchedule(),
            }))
            : [{ ...DEFAULT_BRANCH, schedule: createDefaultSchedule() }],
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.display_name.trim()) newErrors.display_name = t("userNameRequired");
        if (!formData.legal_name.trim()) newErrors.legal_name = t("userNameRequired");
        if (!formData.tax_id.trim()) newErrors.tax_id = t("userNameRequired");
        setErrors(newErrors);
        setTouched({ display_name: true, legal_name: true, tax_id: true });
        return Object.keys(newErrors).length === 0;
    };

    const handleBlur = (field: string) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            const payload: OrgFormData = {
                ...formData,
                starts_at: formData.starts_at
                    ? new Date(formData.starts_at).toISOString()
                    : new Date().toISOString(),
                expires_at: formData.expires_at
                    ? new Date(formData.expires_at).toISOString()
                    : new Date().toISOString(),
                branches: formData.branches.map((b) => ({
                    ...b,
                    schedule: b.schedule.map((s) => ({
                        ...s,
                        opens_at: s.is_closed ? null : s.opens_at,
                        closes_at: s.is_closed ? null : s.closes_at,
                    })),
                })),
            };
            await onSubmit(payload);
        }
    };

    const hasError = (field: string) => touched[field] && errors[field];

    const updateBranch = (index: number, updates: Partial<Branch>) => {
        const newBranches = [...formData.branches];
        newBranches[index] = { ...newBranches[index], ...updates };
        setFormData({ ...formData, branches: newBranches });
    };

    const updateSchedule = (branchIdx: number, dayIdx: number, updates: Partial<Schedule>) => {
        const newBranches = [...formData.branches];
        const newSchedule = [...newBranches[branchIdx].schedule];
        newSchedule[dayIdx] = { ...newSchedule[dayIdx], ...updates };
        newBranches[branchIdx] = { ...newBranches[branchIdx], schedule: newSchedule };
        setFormData({ ...formData, branches: newBranches });
    };

    const addBranch = () => {
        setFormData({
            ...formData,
            branches: [...formData.branches, { ...DEFAULT_BRANCH, schedule: createDefaultSchedule() }],
        });
    };

    const removeBranch = (index: number) => {
        if (formData.branches.length <= 1) return;
        setFormData({
            ...formData,
            branches: formData.branches.filter((_, i) => i !== index),
        });
    };

    const getDayName = (day: typeof WEEKDAYS[0]) => {
        return lang === "ru" ? day.ru : lang === "uz" ? day.uz : day.en;
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                        <Building2 size={14} className="text-blue-500" />
                        {t("organizationName")}
                    </label>
                    <Input
                        value={formData.display_name}
                        onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                        onBlur={() => handleBlur("display_name")}
                        className={`bg-background/50 text-foreground transition-all duration-200 ${hasError("display_name")
                                ? "border-red-500/70 focus:border-red-500"
                                : "border-border/40 focus:border-blue-500"
                            }`}
                        placeholder={t("enterOrgName")}
                    />
                    {hasError("display_name") && (
                        <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                            <AlertCircle size={12} />
                            {errors.display_name}
                        </p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                        <FileText size={14} className="text-emerald-500" />
                        {t("legalName") || "Legal Name"}
                    </label>
                    <Input
                        value={formData.legal_name}
                        onChange={(e) => setFormData({ ...formData, legal_name: e.target.value })}
                        onBlur={() => handleBlur("legal_name")}
                        className={`bg-background/50 text-foreground transition-all duration-200 ${hasError("legal_name")
                                ? "border-red-500/70 focus:border-red-500"
                                : "border-border/40 focus:border-blue-500"
                            }`}
                        placeholder="OOO Example"
                    />
                    {hasError("legal_name") && (
                        <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                            <AlertCircle size={12} />
                            {errors.legal_name}
                        </p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                        <Hash size={14} className="text-violet-500" />
                        Tax ID (INN)
                    </label>
                    <Input
                        value={formData.tax_id}
                        onChange={(e) => setFormData({ ...formData, tax_id: e.target.value })}
                        onBlur={() => handleBlur("tax_id")}
                        className={`bg-background/50 text-foreground transition-all duration-200 ${hasError("tax_id")
                                ? "border-red-500/70 focus:border-red-500"
                                : "border-border/40 focus:border-blue-500"
                            }`}
                        placeholder="123456789"
                    />
                    {hasError("tax_id") && (
                        <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                            <AlertCircle size={12} />
                            {errors.tax_id}
                        </p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                        <Percent size={14} className="text-amber-500" />
                        {t("defaultTakeRate") || "Take Rate (%)"}
                    </label>
                    <Input
                        type="number"
                        min={0}
                        max={100}
                        value={formData.default_take_rate}
                        onChange={(e) => setFormData({ ...formData, default_take_rate: Number(e.target.value) })}
                        className="bg-background/50 text-foreground border-border/40 focus:border-blue-500 transition-all duration-200"
                        placeholder="1"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                        <Calendar size={14} className="text-cyan-500" />
                        {t("startDate")}
                    </label>
                    <Input
                        type="datetime-local"
                        value={formData.starts_at}
                        onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
                        className="bg-background/50 text-foreground border-border/40 focus:border-blue-500 transition-all duration-200"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                        <Calendar size={14} className="text-rose-500" />
                        {t("endDate")}
                    </label>
                    <Input
                        type="datetime-local"
                        value={formData.expires_at}
                        onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                        className="bg-background/50 text-foreground border-border/40 focus:border-blue-500 transition-all duration-200"
                    />
                </div>
            </div>

            <div
                onClick={() =>
                    setFormData({
                        ...formData,
                        status: formData.status === "active" ? "inactive" : "active",
                    })
                }
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 border ${formData.status === "active"
                        ? "bg-emerald-500/10 border-emerald-500/30"
                        : "bg-orange-500/10 border-orange-500/30"
                    }`}
            >
                <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${formData.status === "active"
                        ? "bg-emerald-500/20 text-emerald-500"
                        : "bg-orange-500/20 text-orange-500"
                    }`}>
                    <Building2 size={18} />
                </div>
                <div className="flex-1">
                    <span className="text-sm font-medium text-foreground">
                        {t("status")}: {formData.status === "active" ? t("active") : t("inactive")}
                    </span>
                </div>
                <div className="relative">
                    <div className={`w-10 h-[22px] rounded-full transition-all duration-300 ${formData.status === "active" ? "bg-emerald-500" : "bg-border/60"
                        }`}>
                        <div className={`absolute top-[3px] w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${formData.status === "active" ? "left-[22px]" : "left-[3px]"
                            }`} />
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                        <MapPin size={14} className="text-pink-500" />
                        {t("branches") || "Branches"}
                    </label>
                    <button
                        type="button"
                        onClick={addBranch}
                        className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-400 transition-colors"
                    >
                        <Plus size={14} />
                        {t("add")}
                    </button>
                </div>

                {formData.branches.map((branch, bIdx) => (
                    <div
                        key={bIdx}
                        className="p-4 rounded-xl border border-border/30 bg-background/30 space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                {t("branches") || "Branch"} #{bIdx + 1}
                            </span>
                            {formData.branches.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeBranch(bIdx)}
                                    className="p-1 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                >
                                    <Trash2 size={14} />
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Input
                                value={branch.name}
                                onChange={(e) => updateBranch(bIdx, { name: e.target.value })}
                                className="bg-background/50 text-foreground border-border/40 text-sm"
                                placeholder={t("name")}
                            />
                            <Input
                                value={branch.address}
                                onChange={(e) => updateBranch(bIdx, { address: e.target.value })}
                                className="bg-background/50 text-foreground border-border/40 text-sm"
                                placeholder={t("address") || "Address"}
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <select
                                value={branch.type}
                                onChange={(e) => updateBranch(bIdx, { type: e.target.value })}
                                className="bg-background/50 text-foreground border border-border/40 rounded-md px-3 py-2 text-sm focus:border-blue-500 outline-none transition-all"
                            >
                                <option value="car_wash">Car Wash</option>
                                <option value="gas_station">Gas Station</option>
                                <option value="auto_service">Auto Service</option>
                            </select>
                            <Input
                                type="number"
                                step="any"
                                value={branch.lat || ""}
                                onChange={(e) => updateBranch(bIdx, { lat: Number(e.target.value) })}
                                className="bg-background/50 text-foreground border-border/40 text-sm"
                                placeholder="Lat"
                            />
                            <Input
                                type="number"
                                step="any"
                                value={branch.lon || ""}
                                onChange={(e) => updateBranch(bIdx, { lon: Number(e.target.value) })}
                                className="bg-background/50 text-foreground border-border/40 text-sm"
                                placeholder="Lon"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                                <Clock size={12} />
                                {t("schedule") || "Schedule"}
                            </label>
                            <div className="rounded-lg border border-border/20 overflow-hidden">
                                {branch.schedule.map((day, dIdx) => {
                                    const weekday = WEEKDAYS.find((w) => w.key === day.weekday) || WEEKDAYS[dIdx];
                                    return (
                                        <div
                                            key={day.weekday}
                                            className={`flex items-center gap-3 px-3 py-2 text-sm ${dIdx < 6 ? "border-b border-border/10" : ""
                                                } ${day.is_closed ? "opacity-60" : ""}`}
                                        >
                                            <span className="w-24 text-xs font-medium text-foreground shrink-0">
                                                {getDayName(weekday)}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    updateSchedule(bIdx, dIdx, {
                                                        is_closed: !day.is_closed,
                                                        opens_at: !day.is_closed ? null : "09:00:00",
                                                        closes_at: !day.is_closed ? null : "21:00:00",
                                                    })
                                                }
                                                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all shrink-0 ${day.is_closed
                                                        ? "bg-red-500/10 text-red-500"
                                                        : "bg-emerald-500/10 text-emerald-500"
                                                    }`}
                                            >
                                                {day.is_closed ? t("closed") || "Closed" : t("open") || "Open"}
                                            </button>

                                            {!day.is_closed && (
                                                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                                    <input
                                                        type="time"
                                                        value={day.opens_at?.slice(0, 5) || "09:00"}
                                                        onChange={(e) =>
                                                            updateSchedule(bIdx, dIdx, {
                                                                opens_at: e.target.value + ":00",
                                                            })
                                                        }
                                                        className="bg-background/80 border border-border/30 rounded px-2 py-0.5 text-xs text-foreground focus:border-blue-500 outline-none w-20"
                                                    />
                                                    <span className="text-muted-foreground text-xs">—</span>
                                                    <input
                                                        type="time"
                                                        value={day.closes_at?.slice(0, 5) || "21:00"}
                                                        onChange={(e) =>
                                                            updateSchedule(bIdx, dIdx, {
                                                                closes_at: e.target.value + ":00",
                                                            })
                                                        }
                                                        className="bg-background/80 border border-border/30 rounded px-2 py-0.5 text-xs text-foreground focus:border-blue-500 outline-none w-20"
                                                    />
                                                </div>
                                            )}

                                            {day.is_closed && (
                                                <span className="text-xs text-muted-foreground/50 italic">
                                                    {t("dayOff") || "Day off"}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ))}
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
