import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Form, Input, Select, Modal, Space, Upload, Row, Col, Typography } from "antd";
import { Building2, MapPin, Plus, ListFilter, Image as ImageIcon } from "lucide-react";
import { apiGet } from "../../../lib/api";
import type { ApiBranch, BranchFormData, BranchImage } from "../type";
import type { ApiOrganization } from "../../organizations/type";

const { Text } = Typography;

interface BranchModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onSubmit: (values: BranchFormData) => Promise<void>;
  loading: boolean;
  editingBranch: ApiBranch | null;
}

export default function BranchModal({
  isOpen,
  onCancel,
  onSubmit,
  loading,
  editingBranch,
}: BranchModalProps) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [organizations, setOrganizations] = useState<ApiOrganization[]>([]);
  const [orgsLoading, setOrgsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchOrgs = async () => {
        setOrgsLoading(true);
        try {
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

  useEffect(() => {
    if (isOpen) {
      form.setFieldsValue({
        name: editingBranch?.name || "",
        address: editingBranch?.address || "",
        org_id: editingBranch?.org_id || undefined,
        on_demand_services: editingBranch?.on_demand_services || ["car_wash"],
        logo: editingBranch?.logo ? [{
          uid: '-1',
          name: editingBranch.logo.filename,
          status: 'done',
        }] : [],
      });
    } else {
      form.resetFields();
    }
  }, [isOpen, editingBranch, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      
      // Handle logo
      let logoData: BranchImage | null = editingBranch?.logo || null;
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

      const payload: BranchFormData = {
        ...values,
        logo: logoData,
        gallery: editingBranch?.gallery || {}, // Simplification for now
      };
      
      await onSubmit(payload);
    } catch (error) {
      console.error("Validate Failed:", error);
    }
  };

  return (
    <Modal
      title={editingBranch ? t("editBranch") : t("newBranch")}
      open={isOpen}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
      width={600}
      okText={t("save")}
      cancelText={t("cancel")}
      okButtonProps={{ size: "large", className: "bg-blue-600 shadow-lg shadow-blue-600/20" }}
      cancelButtonProps={{ size: "large" }}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        className="py-4"
        requiredMark={false}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="org_id"
              label={
                <Space size={4}>
                  <Building2 size={14} className="text-emerald-500" />
                  {t("organization")}
                </Space>
              }
              rules={[{ required: true, message: t("selectOrganization") }]}
            >
              <Select
                placeholder={t("selectOrganization")}
                size="large"
                loading={orgsLoading}
                showSearch
                optionFilterProp="children"
                className="rounded-xl"
                options={organizations.map(org => ({
                  value: org.id,
                  label: org.display_name
                }))}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="name"
              label={
                <Space size={4}>
                  <Building2 size={14} className="text-blue-500" />
                  {t("branchName")}
                </Space>
              }
              rules={[{ required: true, message: t("enterBranchName") }]}
            >
              <Input placeholder={t("branchName")} size="large" className="rounded-xl" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="address"
              label={
                <Space size={4}>
                  <MapPin size={14} className="text-rose-500" />
                  {t("address")}
                </Space>
              }
              rules={[{ required: true, message: t("enterAddress") || "Manzilni kiriting" }]}
            >
              <Input placeholder={t("address")} size="large" className="rounded-xl" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="on_demand_services"
              label={
                <Space size={4}>
                  <ListFilter size={14} className="text-amber-500" />
                  {t("services")}
                </Space>
              }
              rules={[{ required: true, message: t("selectServices") }]}
            >
              <Select
                mode="tags"
                placeholder={t("selectServices")}
                size="large"
                className="rounded-xl"
                options={[
                  { label: t("service_car_wash"), value: "car_wash" },
                  { label: t("service_refueling"), value: "refueling" },
                  { label: t("service_car_unlocking"), value: "car_unlocking" },
                  { label: t("service_towing"), value: "towing" },
                  { label: t("service_auto_workshop"), value: "auto_workshop" },
                  { label: t("service_tire_service"), value: "tire_service" },
                  { label: t("service_detailing"), value: "detailing" },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="logo"
              label={
                <Space size={4}>
                  <ImageIcon size={14} className="text-indigo-500" />
                  {t("logo")}
                </Space>
              }
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
                  <div className="mt-1 text-xs">{t("upload")}</div>
                </div>
              </Upload>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
