import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Form, Input, Select, Modal, Space, Tag } from "antd";
import { User, Lock, Building2 } from "lucide-react";
import { apiGet } from "../../../lib/api";
import type { ApiAccount, AccountFormData } from "../type";
import type { ApiOrganization } from "../../organizations/type";

interface AccountModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onSubmit: (values: AccountFormData) => Promise<void>;
  loading: boolean;
  editingAccount: ApiAccount | null;
}

export default function AccountModal({
  isOpen,
  onCancel,
  onSubmit,
  loading,
  editingAccount,
}: AccountModalProps) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [organizations, setOrganizations] = useState<ApiOrganization[]>([]);
  const [orgsLoading, setOrgsLoading] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      const fetchOrgs = async () => {
        setOrgsLoading(true);
        try {
          const { apiGet } = await import("../../../lib/api");
          const data = await apiGet<ApiOrganization[]>("/super/organizations");
          setOrganizations(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error("Failed to fetch organizations:", err);
        } finally {
          setOrgsLoading(false);
        }
      };
      fetchOrgs();
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (isOpen) {
      form.setFieldsValue({
        login: editingAccount?.login || "",
        password: "",
        org_id: editingAccount?.org_id || undefined,
      });
    } else {
      form.resetFields();
    }
  }, [isOpen, editingAccount, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
    } catch (error) {
      console.error("Validate Failed:", error);
    }
  };

  return (
    <Modal
      title={editingAccount ? t("editAccount") : t("newAccount")}
      open={isOpen}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
      width={480}
      okText={t("save")}
      cancelText={t("cancel")}
      okButtonProps={{ size: "large", className: "bg-blue-600 shadow-lg shadow-blue-600/20" }}
      cancelButtonProps={{ size: "large" }}
      className="centered-modal"
      centered
    >
      <Form
        form={form}
        layout="vertical"
        className="py-4"
        requiredMark={false}
      >
        <Form.Item
          name="login"
          label={
            <Space size={4}>
              <User size={14} className="text-blue-500" />
              {t("username")}
            </Space>
          }
          rules={[{ required: true, message: t("enterUsername") }]}
        >
          <Input placeholder={t("enterUsername")} size="large" onPressEnter={handleOk} className="rounded-xl" />
        </Form.Item>

        <Form.Item
          name="password"
          label={
            <Space size={4}>
              <Lock size={14} className="text-amber-500" />
              {t("password")}
            </Space>
          }
          rules={[
            {
              required: !editingAccount,
              message: t("enterPassword"),
            },
            {
              min: 8,
              message: t("passwordTooShort") || "Parol kamida 8 ta belgidan iborat bo'lishi kerak",
            }
          ]}
        >
          <Input.Password
            placeholder={
              editingAccount ? t("leaveBlankToKeep") : t("enterPassword")
            }
            size="large"
            onPressEnter={handleOk}
            className="rounded-xl"
          />
        </Form.Item>

        <Form.Item
          name="org_id"
          label={
            <Space size={4}>
              <Building2 size={14} className="text-emerald-500" />
              {t("organization") || "Tashkilot"}
            </Space>
          }
          rules={[{ required: true, message: t("selectOrganization") || "Tashkilotni tanlang" }]}
        >
          <Select
            placeholder={t("selectOrganization") || "Tashkilotni tanlang"}
            size="large"
            loading={orgsLoading}
            showSearch
            optionFilterProp="children"
            className="rounded-xl"
            filterOption={(input, option) =>
              (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
            }
            options={organizations.map(org => ({
              value: org.id,
              label: org.display_name
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
