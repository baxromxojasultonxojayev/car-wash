import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Search,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Loader2,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────

export interface Column<T> {
    /** Kalit — ma'lumotdagi field nomi */
    key: string;
    /** Jadval header matni */
    header: string;
    /** Custom render funksiya */
    render?: (value: any, row: T, index: number) => React.ReactNode;
    /** Mobilda yashirish */
    hideOnMobile?: boolean;
    /** Tablet dan kichik ekranlarda yashirish */
    hideOnTablet?: boolean;
    /** Matnni o'ngga joylashtirish (actionlar uchun) */
    align?: "left" | "center" | "right";
    /** Max width (desktop) */
    maxWidth?: string;
    /** Bu column search ga ta'sir qiladi */
    searchable?: boolean;
}

export interface DataTableProps<T> {
    /** Ma'lumotlar ro'yxati */
    data: T[];
    /** Jadval ustunlari */
    columns: Column<T>[];
    /** Yuklanmoqda holati */
    loading?: boolean;
    /** Qidiruv placeholder */
    searchPlaceholder?: string;
    /** Qidiruv yoqilganmi */
    searchable?: boolean;
    /** Sahifalash — har bir sahifadagi elementlar soni */
    pageSize?: number;
    /** Sahifalash ko'rsatilsinmi */
    showPagination?: boolean;
    /** Mobile card uchun render */
    renderMobileCard?: (row: T, index: number) => React.ReactNode;
    /** ID olish funksiyasi */
    getRowId?: (row: T) => string;
    /** Hech narsa topilmasa ko'rsatiladigan xabar */
    emptyMessage?: string;
    /** Xatolik xabari */
    error?: string | null;
    /** Qayta yuklash */
    onRetry?: () => void;
}

// ─── Component ───────────────────────────────────────────────────

export default function DataTable<T extends Record<string, any>>({
    data,
    columns,
    loading = false,
    searchPlaceholder,
    searchable = true,
    pageSize = 10,
    showPagination = true,
    renderMobileCard,
    getRowId,
    emptyMessage,
    error,
    onRetry,
}: DataTableProps<T>) {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // ─── Search ─────────────────────────────────────────────────────

    const searchableKeys = columns
        .filter((c) => c.searchable !== false)
        .map((c) => c.key);

    const filteredData = searchTerm
        ? data.filter((row) =>
            searchableKeys.some((key) => {
                const val = row[key];
                if (val === null || val === undefined) return false;
                return String(val).toLowerCase().includes(searchTerm.toLowerCase());
            })
        )
        : data;

    // ─── Pagination ─────────────────────────────────────────────────

    const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const startIndex = (safeCurrentPage - 1) * pageSize;
    const paginatedData = showPagination
        ? filteredData.slice(startIndex, startIndex + pageSize)
        : filteredData;

    const goToPage = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    // ─── Loading state ─────────────────────────────────────────────

    if (loading) {
        return (
            <Card className="bg-card border border-border/20 p-12 flex flex-col items-center justify-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <p className="text-muted-foreground text-sm">{t("loading") || "Yuklanmoqda..."}</p>
            </Card>
        );
    }

    // ─── Error state ────────────────────────────────────────────────

    if (error) {
        return (
            <Card className="bg-card border border-border/20 p-8 flex flex-col items-center justify-center gap-3">
                <p className="text-red-500 text-sm">{error}</p>
                {onRetry && (
                    <Button
                        onClick={onRetry}
                        variant="outline"
                        size="sm"
                        className="mt-2"
                    >
                        {t("retry") || "Qayta urinish"}
                    </Button>
                )}
            </Card>
        );
    }

    // ─── Render ─────────────────────────────────────────────────────

    const noResults =
        emptyMessage || t("noData") || "Ma'lumot topilmadi";

    return (
        <div className="space-y-4">
            {/* Search */}
            {searchable && (
                <Card className="bg-card border border-border/20 p-3 sm:p-4">
                    <div className="relative">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            size={18}
                        />
                        <Input
                            placeholder={searchPlaceholder || t("search") || "Qidirish..."}
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="pl-10 bg-input text-foreground border-border/30 text-sm"
                        />
                    </div>
                </Card>
            )}

            {/* Mobile Cards */}
            {renderMobileCard && (
                <div className="block sm:hidden space-y-3">
                    {paginatedData.length === 0 ? (
                        <Card className="bg-card border border-border/20 p-6 text-center">
                            <p className="text-muted-foreground">{noResults}</p>
                        </Card>
                    ) : (
                        paginatedData.map((row, idx) => (
                            <div key={getRowId ? getRowId(row) : startIndex + idx}>
                                {renderMobileCard(row, startIndex + idx)}
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Desktop Table */}
            <Card
                className={`${renderMobileCard ? "hidden sm:block" : "block"
                    } bg-card border border-border/20 overflow-hidden`}
            >
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b border-border/20 bg-sidebar/20">
                            <tr>
                                {columns.map((col) => (
                                    <th
                                        key={col.key}
                                        className={`px-4 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm font-semibold text-foreground
                      ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"}
                      ${col.hideOnMobile ? "hidden md:table-cell" : ""}
                      ${col.hideOnTablet ? "hidden lg:table-cell" : ""}
                    `}
                                    >
                                        {col.header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={columns.length}
                                        className="px-6 py-8 text-center text-muted-foreground"
                                    >
                                        {noResults}
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map((row, idx) => (
                                    <tr
                                        key={getRowId ? getRowId(row) : startIndex + idx}
                                        className="border-b border-border/20 hover:bg-sidebar/10 transition-colors"
                                    >
                                        {columns.map((col) => (
                                            <td
                                                key={col.key}
                                                className={`px-4 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm
                          ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"}
                          ${col.hideOnMobile ? "hidden md:table-cell" : ""}
                          ${col.hideOnTablet ? "hidden lg:table-cell" : ""}
                        `}
                                                style={
                                                    col.maxWidth
                                                        ? { maxWidth: col.maxWidth }
                                                        : undefined
                                                }
                                            >
                                                {col.render
                                                    ? col.render(row[col.key], row, startIndex + idx)
                                                    : row[col.key] ?? "-"}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Pagination */}
            {showPagination && filteredData.length > pageSize && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1">
                    <p className="text-xs text-muted-foreground">
                        {t("showing") || "Ko'rsatilmoqda"}{" "}
                        <span className="font-medium text-foreground">
                            {startIndex + 1}–{Math.min(startIndex + pageSize, filteredData.length)}
                        </span>{" "}
                        / {filteredData.length}
                    </p>

                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            disabled={safeCurrentPage === 1}
                            onClick={() => goToPage(1)}
                        >
                            <ChevronsLeft size={14} />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            disabled={safeCurrentPage === 1}
                            onClick={() => goToPage(safeCurrentPage - 1)}
                        >
                            <ChevronLeft size={14} />
                        </Button>

                        {/* Page numbers */}
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let page: number;
                            if (totalPages <= 5) {
                                page = i + 1;
                            } else if (safeCurrentPage <= 3) {
                                page = i + 1;
                            } else if (safeCurrentPage >= totalPages - 2) {
                                page = totalPages - 4 + i;
                            } else {
                                page = safeCurrentPage - 2 + i;
                            }
                            return (
                                <Button
                                    key={page}
                                    variant={page === safeCurrentPage ? "default" : "outline"}
                                    size="icon"
                                    className={`h-8 w-8 text-xs ${page === safeCurrentPage
                                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                                            : ""
                                        }`}
                                    onClick={() => goToPage(page)}
                                >
                                    {page}
                                </Button>
                            );
                        })}

                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            disabled={safeCurrentPage === totalPages}
                            onClick={() => goToPage(safeCurrentPage + 1)}
                        >
                            <ChevronRight size={14} />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            disabled={safeCurrentPage === totalPages}
                            onClick={() => goToPage(totalPages)}
                        >
                            <ChevronsRight size={14} />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
