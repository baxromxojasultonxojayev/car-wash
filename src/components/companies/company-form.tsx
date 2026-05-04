"use client"

import { useTranslation } from "react-i18next";
import { 
  Form, 
  Input, 
  Button, 
  Space, 
  Typography, 
  Card, 
  Row, 
  Col, 
  Divider 
} from "antd";
import { Building2, MapPin, Plus, Trash2 } from "lucide-react";

const { Text } = Typography;

interface BranchOffice {
  id: string
  name: string
  location: string
}

interface CompanyFormData {
  name: string
  description?: string
  ownerId?: string
  branches: BranchOffice[]
}

interface Company extends CompanyFormData {
  id: string
  createdAt: string
}

interface CompanyFormProps {
  company?: Company | null
  onSubmit: (data: CompanyFormData) => void
  onCancel: () => void
}

export default function CompanyForm({ company, onSubmit, onCancel }: CompanyFormProps) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const initialValues = {
    name: company?.name || "",
    description: company?.description || "",
    ownerId: company?.ownerId || "",
    branches: company?.branches || [],
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
        label={<Space size={4}><Building2 size={14} className="text-blue-500" />{t("companyName") || "Kompaniya Nomi"}</Space>}
        rules={[{ required: true, message: t("companyNameRequired") || "Kompaniya nomi talab qilinadi" }]}
      >
        <Input size="large" placeholder={t("enterCompanyName") || "Kompaniya nomi"} />
      </Form.Item>

      <Form.Item
        name="description"
        label={<Space size={4}><Text strong size="small">{t("description") || "Tavsif"}</Text></Space>}
      >
        <Input.TextArea 
          rows={3} 
          placeholder={t("descriptionPlaceholder") || "Kompaniya haqida ma'lumot"} 
          className="bg-background/50"
        />
      </Form.Item>

      <Divider orientation="left" className="!my-6">
        <Space size={4}>
          <MapPin size={16} className="text-pink-500" />
          {t("branches") || "Filiallar"}
        </Space>
      </Divider>

      <Form.List name="branches">
        {(fields, { add, remove }) => (
          <div className="space-y-4">
            {fields.map(({ key, name, ...restField }) => (
              <Card 
                key={key} 
                size="small" 
                bordered={false} 
                className="bg-card border border-border/20 shadow-sm"
                extra={
                  <Button 
                    type="text" 
                    danger 
                    icon={<Trash2 size={16} />} 
                    onClick={() => remove(name)} 
                  />
                }
              >
                <Row gutter={12}>
                  <Col span={12}>
                    <Form.Item
                      {...restField}
                      name={[name, 'name']}
                      label={t("branchName") || "Filial nomi"}
                      rules={[{ required: true, message: t("branchNameRequired") || "Filial nomi talab qilinadi" }]}
                      className="mb-0"
                    >
                      <Input placeholder={t("branchName") || "Filial nomi"} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      {...restField}
                      name={[name, 'location']}
                      label={t("location") || "Lokatsiya"}
                      rules={[{ required: true, message: t("locationRequired") || "Lokatsiya talab qilinadi" }]}
                      className="mb-0"
                    >
                      <Input placeholder={t("location") || "Lokatsiya"} />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            ))}
            <Button 
              type="dashed" 
              onClick={() => add()} 
              block 
              icon={<Plus size={16} />}
              className="h-10"
            >
              {t("addBranch") || "Filial Qo'shish"}
            </Button>
          </div>
        )}
      </Form.List>

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
