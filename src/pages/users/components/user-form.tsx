import type React from "react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Form, Input, Button, Switch, Space, Typography } from "antd";
import { User, Phone, Mail, Lock, ShieldCheck } from "lucide-react";
import type { UserFormData, UserFormProps } from "../type";

const { Text } = Typography;

export default function UserForm({ user, onSubmit, onCancel, loading }: UserFormProps) {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [isSuper, setIsSuper] = useState(user?.is_super ?? false);

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                name: user.name || "",
                phone: user.phone || "",
                email: user.email || "",
                is_super: user.is_super ?? false,
                password: "",
            });
            setIsSuper(user.is_super ?? false);
        } else {
            form.resetFields();
            setIsSuper(false);
        }
    }, [user, form]);

    const onFinish = async (values: any) => {
        await onSubmit({ ...values, is_super: isSuper });
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
            className="space-y-4"
        >
            <Form.Item
                name="name"
                label={
                    <Space size={4}>
                        <User size={14} className="text-blue-500" />
                        <Text strong size="small">{t("name")}</Text>
                    </Space>
                }
                rules={[{ required: true, message: t("userNameRequired") }]}
            >
                <Input 
                    placeholder={t("userNamePlaceholder")} 
                    size="large" 
                    className="bg-background/50"
                />
            </Form.Item>

            <Form.Item
                name="phone"
                label={
                    <Space size={4}>
                        <Phone size={14} className="text-emerald-500" />
                        <Text strong size="small">{t("phone")}</Text>
                    </Space>
                }
                rules={[{ required: true, message: t("userPhoneRequired") }]}
            >
                <Input 
                    placeholder="998901234567" 
                    size="large" 
                    className="bg-background/50"
                />
            </Form.Item>

            <Form.Item
                name="email"
                label={
                    <Space size={4}>
                        <Mail size={14} className="text-violet-500" />
                        <Text strong size="small">{t("email")}</Text>
                    </Space>
                }
                rules={[
                    { required: true, message: t("userEmailRequired") },
                    { type: 'email', message: t("userEmailInvalid") }
                ]}
            >
                <Input 
                    placeholder="user@example.com" 
                    size="large" 
                    className="bg-background/50"
                />
            </Form.Item>

            <Form.Item
                name="password"
                label={
                    <Space size={4}>
                        <Lock size={14} className="text-amber-500" />
                        <Text strong size="small">{t("password")}</Text>
                        {user && <Text type="secondary" style={{ fontSize: '12px' }}>({t("userPasswordOptional")})</Text>}
                    </Space>
                }
                rules={[
                    { required: !user, message: t("userPasswordRequired") },
                    { min: 6, message: t("userPasswordMinLength") }
                ]}
            >
                <Input.Password
                    placeholder={user ? t("userNewPasswordPlaceholder") : t("enterPassword")}
                    size="large"
                    className="bg-background/50"
                />
            </Form.Item>

            <div
                onClick={() => setIsSuper(!isSuper)}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 border ${isSuper
                    ? "bg-blue-500/10 border-blue-500/30"
                    : "bg-background/30 border-border/20 hover:border-border/40"
                    }`}
            >
                <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${isSuper
                    ? "bg-blue-500/20 text-blue-500"
                    : "bg-muted/50 text-muted-foreground"
                    }`}>
                    <ShieldCheck size={18} />
                </div>
                <div className="flex-1">
                    <Text strong size="small">Super Admin</Text>
                    <p className="text-xs text-muted-foreground/70 mb-0">
                        {t("superAdmin")}
                    </p>
                </div>
                <Switch 
                    checked={isSuper} 
                    onChange={setIsSuper}
                    onClick={(e) => e.stopPropagation()}
                />
            </div>

            <div className="flex gap-3 pt-4">
                <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    size="large"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 h-11"
                >
                    {t("save")}
                </Button>
                <Button
                    onClick={onCancel}
                    disabled={loading}
                    size="large"
                    className="flex-1 h-11"
                >
                    {t("cancel")}
                </Button>
            </div>
        </Form>
    );
}
