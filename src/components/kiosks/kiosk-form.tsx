"use client"

import { useTranslation } from "react-i18next";
import { 
  Form, 
  Input, 
  Button, 
  Select, 
  Switch, 
  Space, 
  Typography, 
  Row, 
  Col, 
  Card 
} from "antd";
import { Zap, Cpu, MapPin, Building2, ShieldCheck } from "lucide-react";

const { Text } = Typography;

type KioskStatus = "free" | "payment" | "active" | "pause" | "finish" | "error" | "closed"

interface KioskFormData {
  name: string
  status: KioskStatus
  isActive: boolean
  controllerMacAddress: string
  companyId: string
  branchOfficeId: string
  patternId?: string
}

interface Kiosk extends KioskFormData {
  id: string
  createdAt: string
}

interface KioskFormProps {
  kiosk?: Kiosk | null
  onSubmit: (data: KioskFormData) => void
  onCancel: () => void
}

export default function KioskForm({ kiosk, onSubmit, onCancel }: KioskFormProps) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const initialValues = {
    name: kiosk?.name || "",
    status: kiosk?.status || "free",
    isActive: kiosk?.isActive ?? true,
    controllerMacAddress: kiosk?.controllerMacAddress || "",
    companyId: kiosk?.companyId || "1",
    branchOfficeId: kiosk?.branchOfficeId || "b1",
    patternId: kiosk?.patternId || "",
  };

  const handleFinish = (values: any) => {
    onSubmit(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={handleFinish}
      requiredMark={false}
      className="space-y-4"
    >
      <Form.Item
        name="name"
        label={<Space size={4}><Zap size={14} className="text-blue-500" />{t("kioskName") || "Kiosk Nomi"}</Space>}
        rules={[{ required: true, message: t("kioskNameRequired") || "Kiosk nomi talab qilinadi" }]}
      >
        <Input size="large" placeholder={t("enterKioskName") || "Kiosk nomi"} />
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="status"
            label={<Space size={4}><ShieldCheck size={14} className="text-emerald-500" />{t("status") || "Status"}</Space>}
          >
            <Select size="large">
              <Select.Option value="free">{t("free") || "Bo'sh"}</Select.Option>
              <Select.Option value="payment">{t("payment") || "To'lov jarayoni"}</Select.Option>
              <Select.Option value="active">{t("active") || "Faol"}</Select.Option>
              <Select.Option value="pause">{t("pause") || "To'xtatilgan"}</Select.Option>
              <Select.Option value="finish">{t("finish") || "Tugallangan"}</Select.Option>
              <Select.Option value="error">{t("error") || "Xato"}</Select.Option>
              <Select.Option value="closed">{t("closed") || "Yopilgan"}</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="controllerMacAddress"
            label={<Space size={4}><Cpu size={14} className="text-violet-500" />MAC Address</Space>}
            rules={[
              { required: true, message: t("macAddressRequired") || "MAC address talab qilinadi" },
              { pattern: /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, message: t("macAddressInvalid") || "MAC address noto'g'ri formatda" }
            ]}
          >
            <Input size="large" placeholder="00:1A:2B:3C:4D:5E" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="companyId"
            label={<Space size={4}><Building2 size={14} className="text-amber-500" />{t("company") || "Kompaniya"}</Space>}
          >
            <Select size="large">
              <Select.Option value="1">CarWash Premium</Select.Option>
              <Select.Option value="2">Quick Clean</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="branchOfficeId"
            label={<Space size={4}><MapPin size={14} className="text-pink-500" />{t("branch") || "Filial"}</Space>}
          >
            <Select size="large">
              <Select.Option value="b1">Mirzo Ulugbek</Select.Option>
              <Select.Option value="b2">Yunus-Obod</Select.Option>
              <Select.Option value="b3">Fergona</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="isActive"
        valuePropName="checked"
      >
        <Card bordered={false} className="bg-card border border-border/20" styles={{ body: { padding: '12px 16px' } }}>
          <div className="flex items-center justify-between">
            <Space>
              <div className={`p-2 rounded-lg ${form.getFieldValue("isActive") ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}>
                <ShieldCheck size={18} />
              </div>
              <Text strong>{t("active") || "Aktiv"}</Text>
            </Space>
            <Switch />
          </div>
        </Card>
      </Form.Item>

      <div className="flex gap-4 pt-6">
        <Button 
          type="primary" 
          htmlType="submit" 
          block 
          size="large"
          className="h-12 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20"
        >
          {t("save") || "Saqlash"}
        </Button>
        <Button 
          onClick={onCancel} 
          block 
          size="large"
          className="h-12 border-border/30"
        >
          {t("cancel") || "Bekor qilish"}
        </Button>
      </div>
    </Form>
  )
}
