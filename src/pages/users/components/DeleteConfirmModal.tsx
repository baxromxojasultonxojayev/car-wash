import { useTranslation } from "react-i18next";
import { Modal, Button, Space, Typography } from "antd";
import { AlertTriangle } from "lucide-react";

const { Title, Text } = Typography;

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

    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            footer={null}
            closable={!loading}
            centered
            width={400}
            styles={{ body: { padding: '24px' } }}
        >
            <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                    <AlertTriangle className="text-red-500" size={32} />
                </div>

                <Title level={4} className="!mb-2 !text-foreground">
                    {title || t("deleteConfirmTitle")}
                </Title>

                <Text className="text-muted-foreground block mb-1">
                    {message || t("deleteConfirmMessage")}
                </Text>
                
                {itemName && (
                    <Text strong className="text-foreground block mb-6">
                        "{itemName}"
                    </Text>
                )}
                {!itemName && <div className="mb-6" />}

                <Space size="middle" className="w-full">
                    <Button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 h-11"
                        size="large"
                    >
                        {t("no")}, {t("cancel").toLowerCase()}
                    </Button>
                    <Button
                        danger
                        type="primary"
                        onClick={onConfirm}
                        loading={loading}
                        className="flex-1 h-11"
                        size="large"
                    >
                        {t("yes")}, {t("delete").toLowerCase()}
                    </Button>
                </Space>
            </div>
        </Modal>
    );
}
