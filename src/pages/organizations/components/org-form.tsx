import { useTranslation } from "react-i18next";
import { 
  Form, 
  Input, 
  Row, 
  Col, 
  Typography, 
  Space, 
  TimePicker,
  Upload,
} from "antd";
import {
    Building2,
    FileText,
    Hash,
    MapPin,
    Phone,
    Mail,
    Clock,
    CreditCard,
    Briefcase,
    Plus,
} from "lucide-react";
import type { OrgFormData, OrgFormProps } from "../type";
import dayjs from "dayjs";

const { Text } = Typography;

export default function OrgForm({ organization, onSubmit, onCancel, loading }: OrgFormProps) {
    const { t } = useTranslation();
    const [form] = Form.useForm();

    const initialValues = {
        display_name: organization?.display_name || "",
        description: organization?.description || "",
        legal_name: organization?.legal_name || "",
        phone: organization?.phone || "",
        email: organization?.email || "",
        address: organization?.address || "",
        opening_time: organization?.opening_time ? dayjs(organization.opening_time, "HH:mm:ss") : null,
        closing_time: organization?.closing_time ? dayjs(organization.closing_time, "HH:mm:ss") : null,
        inn: organization?.inn || "",
        bank_account_number: organization?.bank_account_number || "",
        mfo: organization?.mfo || "",
        oked: organization?.oked || "",
        logo: organization?.logo ? [{
            uid: '-1',
            name: organization.logo.filename,
            status: 'done',
            url: '', // Logo URL isn't explicitly in the schema yet, but we show the filename
        }] : [],
    };

    const handleSubmit = async (values: any) => {
        let logoData = organization?.logo || null;
        
        if (values.logo && values.logo.length > 0) {
            const file = values.logo[0].originFileObj || values.logo[0];
            if (file instanceof File) {
                logoData = {
                    filename: file.name,
                    content_type: file.type,
                    size: file.size,
                };
            }
        } else if (values.logo && values.logo.length === 0) {
            logoData = null;
        }

        const payload: OrgFormData = {
            ...values,
            opening_time: values.opening_time ? values.opening_time.format("HH:mm:ss") : "",
            closing_time: values.closing_time ? values.closing_time.format("HH:mm:ss") : "",
            logo: logoData,
        };
        await onSubmit(payload);
    };

    return (
        <Form
            form={form}
            layout="vertical"
            initialValues={initialValues}
            onFinish={handleSubmit}
            className="space-y-4"
            requiredMark={false}
        >
            <Row gutter={16}>
                <Col xs={24} sm={12}>
                    <Form.Item
                        name="display_name"
                        label={<Space size={4}><Building2 size={14} className="text-blue-500" />{t("displayName")}</Space>}
                        rules={[{ required: true, message: t("requiredField") }]}
                    >
                        <Input size="large" placeholder="Brand Name" />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                    <Form.Item
                        name="legal_name"
                        label={<Space size={4}><FileText size={14} className="text-emerald-500" />{t("legalName")}</Space>}
                        rules={[{ required: true, message: t("requiredField") }]}
                    >
                        <Input size="large" placeholder="OOO Company Name" />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item
                name="description"
                label={<Space size={4}><FileText size={14} className="text-muted-foreground" />{t("description")}</Space>}
            >
                <Input.TextArea rows={2} placeholder={t("descriptionPlaceholder")} />
            </Form.Item>

            <Row gutter={16}>
                <Col xs={24} sm={12}>
                    <Form.Item
                        name="phone"
                        label={<Space size={4}><Phone size={14} className="text-blue-500" />{t("phone")}</Space>}
                        rules={[{ required: true, message: t("requiredField") }]}
                    >
                        <Input size="large" placeholder="+998 90 123 45 67" />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                    <Form.Item
                        name="email"
                        label={<Space size={4}><Mail size={14} className="text-rose-500" />{t("email")}</Space>}
                        rules={[{ required: true, type: 'email', message: t("enterValidEmail") }]}
                    >
                        <Input size="large" placeholder="user@example.com" />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item
                name="address"
                label={<Space size={4}><MapPin size={14} className="text-red-500" />{t("address")}</Space>}
                rules={[{ required: true, message: t("requiredField") }]}
            >
                <Input size="large" placeholder="Tashkent, Chilonzor..." />
            </Form.Item>

            <Row gutter={16}>
                <Col xs={24} sm={12}>
                    <Form.Item
                        name="opening_time"
                        label={<Space size={4}><Clock size={14} className="text-cyan-500" />{t("openingTime")}</Space>}
                        rules={[{ required: true }]}
                    >
                        <TimePicker format="HH:mm:ss" size="large" className="w-full" />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                    <Form.Item
                        name="closing_time"
                        label={<Space size={4}><Clock size={14} className="text-rose-500" />{t("closingTime")}</Space>}
                        rules={[{ required: true }]}
                    >
                        <TimePicker format="HH:mm:ss" size="large" className="w-full" />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col xs={24} sm={12}>
                    <Form.Item
                        name="inn"
                        label={<Space size={4}><Hash size={14} className="text-violet-500" />{t("inn")}</Space>}
                        rules={[
                            { required: true, message: t("requiredField") },
                            { len: 9, message: t("lengthError9") },
                            { pattern: /^\d+$/, message: t("numericError") }
                        ]}
                    >
                        <Input size="large" placeholder="228011575" maxLength={9} />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                    <Form.Item
                        name="bank_account_number"
                        label={<Space size={4}><CreditCard size={14} className="text-amber-500" />{t("bankAccount")}</Space>}
                        rules={[
                            { len: 20, message: t("lengthError20") },
                            { pattern: /^\d+$/, message: t("numericError") }
                        ]}
                    >
                        <Input size="large" placeholder="56917221570867847258" maxLength={20} />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col xs={24} sm={12}>
                    <Form.Item
                        name="mfo"
                        label={<Space size={4}><Briefcase size={14} className="text-indigo-500" />MFO</Space>}
                        rules={[
                            { len: 5, message: t("lengthError5") },
                            { pattern: /^\d+$/, message: t("numericError") }
                        ]}
                    >
                        <Input size="large" placeholder="35656" maxLength={5} />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                    <Form.Item
                        name="oked"
                        label={<Space size={4}><Hash size={14} className="text-teal-500" />OKED</Space>}
                        rules={[
                            { len: 5, message: t("lengthError5") },
                            { pattern: /^\d+$/, message: t("numericError") }
                        ]}
                    >
                        <Input size="large" placeholder="69502" maxLength={5} />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item
                name="logo"
                label={<Space size={4}><Building2 size={14} className="text-pink-500" />{t("logo") || "Logo"}</Space>}
                valuePropName="fileList"
                getValueFromEvent={(e: any) => {
                    if (Array.isArray(e)) return e;
                    return e?.fileList;
                }}
            >
                <Upload
                    listType="picture-card"
                    maxCount={1}
                    beforeUpload={() => false}
                    accept="image/*"
                >
                    <div className="flex flex-col items-center justify-center">
                        <Plus size={20} />
                        <div className="mt-1 text-xs">{t("upload") || "Upload"}</div>
                    </div>
                </Upload>
            </Form.Item>

            <div className="flex gap-4 pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 h-12 bg-primary hover:opacity-90 disabled:opacity-50 text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                >
                    {loading && <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
                    {t("save")}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="flex-1 h-12 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-xl font-bold transition-all"
                >
                    {t("cancel")}
                </button>
            </div>
        </Form>
    );
}
