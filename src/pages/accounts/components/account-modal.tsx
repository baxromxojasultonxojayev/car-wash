import { useTranslation } from "react-i18next";
import { Form, Input, Select, Modal, Space, Tag } from "antd";
import { User, Lock, Building2 } from "lucide-react";
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

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
      form.resetFields();
    } catch (error) {
      console.error("Validate Failed:", error);
    }
  };

  const initialValues = {
    login: editingAccount?.login || "",
    password: "",
    org_id: editingAccount?.org_id || undefined,
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
      okButtonProps={{ size: "large", className: "bg-blue-600" }}
      cancelButtonProps={{ size: "large" }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
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
          <Input placeholder={t("enterUsername")} size="large" onPressEnter={handleOk} />
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
          />
        </Form.Item>

        {/* Organization field hidden because it is currently static */}
      </Form>
    </Modal>
  );
}
