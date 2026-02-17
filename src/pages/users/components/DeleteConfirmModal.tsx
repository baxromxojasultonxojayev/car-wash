import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X } from "lucide-react";

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading?: boolean;
    title?: string;
    message?: string;
    itemName?: string;
}

export default function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    loading = false,
    title,
    message,
    itemName,
}: DeleteConfirmModalProps) {
    const { t } = useTranslation();

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget && !loading) onClose();
            }}
        >
            <Card
                className="w-full max-w-sm bg-card border border-border/20 animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-5 sm:p-6">
                    {/* Close button */}
                    <div className="flex justify-end -mt-1 -mr-1">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="text-muted-foreground hover:text-foreground p-1 hover:bg-accent rounded-lg transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Icon */}
                    <div className="flex justify-center mb-4">
                        <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center">
                            <AlertTriangle className="text-red-500" size={28} />
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-foreground text-center mb-2">
                        {title || t("deleteConfirmTitle")}
                    </h3>

                    {/* Message */}
                    <p className="text-sm text-muted-foreground text-center mb-1">
                        {message || t("deleteConfirmMessage")}
                    </p>
                    {itemName && (
                        <p className="text-sm font-medium text-foreground text-center mb-5">
                            "{itemName}"
                        </p>
                    )}
                    {!itemName && <div className="mb-5" />}

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <Button
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 bg-sidebar hover:bg-sidebar/80 text-foreground"
                        >
                            {t("no")}, {t("cancel").toLowerCase()}
                        </Button>
                        <Button
                            onClick={onConfirm}
                            disabled={loading}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                        >
                            {loading ? t("deleting") : `${t("yes")}, ${t("delete").toLowerCase()}`}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
