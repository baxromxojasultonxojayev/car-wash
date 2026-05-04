"use client"

import { useTranslation } from "react-i18next";
import { 
  Form, 
  Input, 
  InputNumber, 
  Button, 
  Select, 
  Switch, 
  Space, 
  Typography, 
  Card 
} from "antd";
import { CreditCard, Wallet, Building2, User, ShieldCheck } from "lucide-react";

const { Text } = Typography;

interface RFIDCardFormData {
  cardNumber: string
  balance: number
  isActive: boolean
  companyId?: string
  ownerId?: string
}

interface RFIDCard extends RFIDCardFormData {
  id: string
  createdAt: string
}

interface CardFormProps {
  card?: RFIDCard | null
  onSubmit: (data: RFIDCardFormData) => void
  onCancel: () => void
}

export default function CardForm({ card, onSubmit, onCancel }: CardFormProps) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const initialValues = {
    cardNumber: card?.cardNumber || "",
    balance: card?.balance || 0,
    isActive: card?.isActive ?? true,
    companyId: card?.companyId || "1",
    ownerId: card?.ownerId || "",
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
        name="cardNumber"
        label={<Space size={4}><CreditCard size={14} className="text-blue-500" />{t("cardNumber") || "Karta Raqami"}</Space>}
        rules={[
          { required: true, message: t("cardNumberRequired") || "Karta raqami talab qilinadi" },
          { pattern: /^[0-9A-Fa-f]{12}$/, message: t("cardNumberInvalid") || "Karta raqami 12 ta hexadecimal raqamdan iborat bo'lishi kerak" }
        ]}
      >
        <Input 
          size="large" 
          placeholder="1234567890AB" 
          maxLength={12} 
          className="font-mono uppercase"
          onChange={(e) => form.setFieldsValue({ cardNumber: e.target.value.toUpperCase() })}
        />
      </Form.Item>

      <Form.Item
        name="balance"
        label={<Space size={4}><Wallet size={14} className="text-emerald-500" />{t("balance") || "Balans (so'mda)"}</Space>}
        rules={[{ required: true, message: t("balanceRequired") || "Balans talab qilinadi" }]}
      >
        <InputNumber 
          size="large" 
          className="w-full" 
          min={0} 
          placeholder="0" 
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
          parser={(value) => value!.replace(/\s?|so'm/g, '')}
        />
      </Form.Item>

      <Form.Item
        name="companyId"
        label={<Space size={4}><Building2 size={14} className="text-amber-500" />{t("company") || "Kompaniya"}</Space>}
      >
        <Select size="large">
          <Select.Option value="1">CarWash Premium</Select.Option>
          <Select.Option value="2">Quick Clean</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="ownerId"
        label={<Space size={4}><User size={14} className="text-violet-500" />{t("owner") || "Foydalanuvchi (ixtiyoriy)"}</Space>}
      >
        <Input size="large" placeholder={t("enterOwnerId") || "Foydalanuvchi ID"} />
      </Form.Item>

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
              <Text strong>{t("active") || "Faol"}</Text>
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
