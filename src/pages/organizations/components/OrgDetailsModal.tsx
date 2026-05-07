import { Modal, Descriptions, Tag, Button, Spin } from "antd";
import { useTranslation } from "react-i18next";
import type { ApiOrganization } from "../type";

interface OrgDetailsModalProps {
  visible: boolean;
  onCancel: () => void;
  loading: boolean;
  data: ApiOrganization | null;
}

export default function OrgDetailsModal({ visible, onCancel, loading, data }: OrgDetailsModalProps) {
  const { t } = useTranslation();

  return (
    <Modal
      title={t("organizationDetails")}
      open={visible}
      onCancel={onCancel}
      centered
      footer={[
        <Button key="close" onClick={onCancel}>
          {t("close")}
        </Button>
      ]}
      width={720}
    >
      {loading ? (
        <div className="py-12 flex justify-center">
          <Spin />
        </div>
      ) : data ? (
        <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }} className="mt-4">
          <Descriptions.Item label={t("displayName")}>{data.display_name}</Descriptions.Item>
          <Descriptions.Item label={t("legalName")}>{data.legal_name}</Descriptions.Item>
          <Descriptions.Item label={t("inn")}><code>{data.inn}</code></Descriptions.Item>
          <Descriptions.Item label={t("phone")}>{data.phone}</Descriptions.Item>
          <Descriptions.Item label={t("email")}>{data.email}</Descriptions.Item>
          <Descriptions.Item label={t("address")}>{data.address}</Descriptions.Item>
          <Descriptions.Item label={t("openingTime")}>{data.opening_time}</Descriptions.Item>
          <Descriptions.Item label={t("closingTime")}>{data.closing_time}</Descriptions.Item>
          <Descriptions.Item label="MFO">{data.mfo}</Descriptions.Item>
          <Descriptions.Item label="OKED">{data.oked}</Descriptions.Item>
          <Descriptions.Item label={t("bankAccount")} span={2}>{data.bank_account_number}</Descriptions.Item>
          <Descriptions.Item label={t("description")} span={2}>{data.description}</Descriptions.Item>
          <Descriptions.Item label={t("status")}>
            <Tag color={data.status === 'active' ? 'success' : data.status === 'deleted' ? 'error' : 'warning'}>
              {data.status.toUpperCase()}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label={t("date")}>
            {data.created_at ? new Date(data.created_at).toLocaleString() : "-"}
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <div className="py-12 text-center text-muted-foreground">{t("noData")}</div>
      )}
    </Modal>
  );
}
