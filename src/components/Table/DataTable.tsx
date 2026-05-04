import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Table, Input, Button, Card, Empty, Pagination, Spin } from "antd";
import {
    Search,
    Loader2,
} from "lucide-react";
import type { TableProps } from 'antd';

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

    const searchableKeys = useMemo(() => 
        columns
            .filter((c) => c.searchable !== false)
            .map((c) => c.key),
        [columns]
    );

    const filteredData = useMemo(() => 
        searchTerm
            ? data.filter((row) =>
                searchableKeys.some((key) => {
                    const val = row[key];
                    if (val === null || val === undefined) return false;
                    return String(val).toLowerCase().includes(searchTerm.toLowerCase());
                })
            )
            : data,
        [data, searchTerm, searchableKeys]
    );

    // ─── Ant Design Table Columns ────────────────────────────────────

    const antColumns: TableProps<T>['columns'] = useMemo(() => 
        columns.map(col => ({
            title: col.header,
            dataIndex: col.key,
            key: col.key,
            align: col.align,
            width: col.maxWidth,
            className: `
                ${col.hideOnMobile ? "hidden md:table-cell" : ""}
                ${col.hideOnTablet ? "hidden lg:table-cell" : ""}
            `,
            onHeaderCell: () => ({
                className: `
                    ${col.hideOnMobile ? "hidden md:table-cell" : ""}
                    ${col.hideOnTablet ? "hidden lg:table-cell" : ""}
                `,
            }),
            render: (value: any, record: T, index: number) => 
                col.render ? col.render(value, record, index) : (value ?? "-")
        })),
        [columns]
    );

    // ─── Render ─────────────────────────────────────────────────────

    if (error) {
        return (
            <Card bordered={false} className="bg-card border border-border/20 p-8 flex flex-col items-center justify-center gap-3">
                <p className="text-red-500 text-sm">{error}</p>
                {onRetry && (
                    <Button
                        onClick={onRetry}
                        type="default"
                        size="small"
                        className="mt-2"
                    >
                        {t("retry") || "Qayta urinish"}
                    </Button>
                )}
            </Card>
        );
    }

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredData.slice(start, start + pageSize);
    }, [filteredData, currentPage, pageSize]);

    return (
        <div className="space-y-4">
            {/* Search */}
            {searchable && (
                <Card bordered={false} className="bg-card border border-border/20" styles={{ body: { padding: '12px' } }}>
                    <Input
                        placeholder={searchPlaceholder || t("search") || "Qidirish..."}
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        prefix={<Search size={18} className="text-muted-foreground mr-2" />}
                        className="bg-transparent border-none focus:ring-0 text-sm h-10"
                        variant="borderless"
                    />
                </Card>
            )}

            {/* Mobile Cards */}
            {renderMobileCard && (
                <div className="block sm:hidden space-y-3">
                    {loading ? (
                        <Card bordered={false} className="bg-card border border-border/20 p-12 flex items-center justify-center">
                            <Spin indicator={<Loader2 className="animate-spin" size={24} />} />
                        </Card>
                    ) : filteredData.length === 0 ? (
                        <Card bordered={false} className="bg-card border border-border/20 p-6 text-center">
                            <Empty description={emptyMessage || t("noData")} />
                        </Card>
                    ) : (
                        <>
                            {paginatedData.map((row, idx) => (
                                <div key={getRowId ? getRowId(row) : idx}>
                                    {renderMobileCard(row, (currentPage - 1) * pageSize + idx)}
                                </div>
                            ))}
                            {showPagination && filteredData.length > pageSize && (
                                <div className="flex justify-center pt-2">
                                    <Pagination
                                        current={currentPage}
                                        pageSize={pageSize}
                                        total={filteredData.length}
                                        onChange={setCurrentPage}
                                        showSizeChanger={false}
                                        size="small"
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* Desktop Table */}
            <Card
                bordered={false}
                className={`${renderMobileCard ? "hidden sm:block" : "block"} bg-card border border-border/20 overflow-hidden`}
                styles={{ body: { padding: 0 } }}
            >
                <Table<T>
                    columns={antColumns}
                    dataSource={filteredData}
                    loading={loading}
                    rowKey={getRowId || ((record, index) => index?.toString() || '')}
                    pagination={showPagination ? {
                        current: currentPage,
                        pageSize: pageSize,
                        total: filteredData.length,
                        onChange: (page) => setCurrentPage(page),
                        position: ['bottomRight'],
                        className: 'px-6 py-4',
                        showSizeChanger: false,
                        showTotal: (total, range) => (
                            <span className="text-xs text-muted-foreground">
                                {t("showing") || "Showing"} <span className="font-medium text-foreground">{range[0]}–{range[1]}</span> / {total}
                            </span>
                        )
                    } : false}
                    locale={{
                        emptyText: <Empty description={emptyMessage || t("noData")} />
                    }}
                    className="antd-custom-table"
                />
            </Card>

            <style dangerouslySetInnerHTML={{ __html: `
                .antd-custom-table .ant-table {
                    background: transparent !important;
                }
                .antd-custom-table .ant-table-thead > tr > th {
                    background: var(--sidebar-bg) !important;
                    color: var(--foreground) !important;
                    border-bottom: 1px solid var(--border) !important;
                    opacity: 0.8;
                    font-weight: 600;
                    font-size: 13px;
                }
                .antd-custom-table .ant-table-tbody > tr > td {
                    border-bottom: 1px solid var(--border) !important;
                    color: var(--foreground) !important;
                    background: transparent !important;
                    transition: all 0.3s;
                }
                .antd-custom-table .ant-table-tbody > tr:hover > td {
                    background: var(--accent) !important;
                    opacity: 0.9;
                }
                .antd-custom-table .ant-pagination-item-active {
                    border-color: var(--primary) !important;
                }
                .antd-custom-table .ant-pagination-item-active a {
                    color: var(--primary) !important;
                }
            `}} />
        </div>
    );
}
