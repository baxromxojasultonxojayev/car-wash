import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Plus,
  Edit,
  Trash2,
  Tag as TagIcon,
  Percent,
  Calendar,
} from 'lucide-react';
import { Button, Card, Input, Select, Tag, Modal, Space, Typography, Form } from 'antd';
import DataTable, { Column } from '@/components/Table/DataTable';

const { Title, Text } = Typography;

interface Promotion {
  id: string;
  name: string;
  discountType: 'percent' | 'fixed';
  discountValue: number;
  startDate: string;
  endDate: string;
  serviceIds: string[];
  serviceNames: string[];
  isActive: boolean;
}

const mockPromotions: Promotion[] = [
  {
    id: '1',
    name: 'Yangi yil aksiyasi',
    discountType: 'percent',
    discountValue: 20,
    startDate: '2024-12-25',
    endDate: '2025-01-15',
    serviceIds: ['1', '2'],
    serviceNames: ['VIP yuvish', 'Premium yuvish'],
    isActive: true,
  },
  {
    id: '2',
    name: 'Hafta oxiri chegirmasi',
    discountType: 'fixed',
    discountValue: 10000,
    startDate: '2024-02-01',
    endDate: '2024-02-29',
    serviceIds: ['1'],
    serviceNames: ['Oddiy yuvish'],
    isActive: true,
  },
];

const mockServices = [
  { id: '1', name: 'Oddiy yuvish' },
  { id: '2', name: 'Premium yuvish' },
  { id: '3', name: 'VIP yuvish' },
];

export default function PromotionsPage() {
  const { t } = useTranslation();
  const [promotions, setPromotions] = useState<Promotion[]>(mockPromotions);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);
  const [form] = Form.useForm();

  const handleCreate = () => {
    setEditingPromo(null);
    form.resetFields();
    setIsDialogOpen(true);
  };

  const handleEdit = (promo: Promotion) => {
    setEditingPromo(promo);
    form.setFieldsValue({
      name: promo.name,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
      startDate: promo.startDate,
      endDate: promo.endDate,
      serviceId: promo.serviceIds[0] || '',
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const service = mockServices.find((s) => s.id === values.serviceId);
      if (editingPromo) {
        setPromotions(
          promotions.map((p) =>
            p.id === editingPromo.id
              ? {
                  ...p,
                  name: values.name,
                  discountType: values.discountType,
                  discountValue: Number(values.discountValue),
                  startDate: values.startDate,
                  endDate: values.endDate,
                  serviceIds: values.serviceId ? [values.serviceId] : [],
                  serviceNames: service ? [service.name] : [],
                }
              : p
          )
        );
      } else {
        const newPromo: Promotion = {
          id: Date.now().toString(),
          name: values.name,
          discountType: values.discountType,
          discountValue: Number(values.discountValue),
          startDate: values.startDate,
          endDate: values.endDate,
          serviceIds: values.serviceId ? [values.serviceId] : [],
          serviceNames: service ? [service.name] : [],
          isActive: true,
        };
        setPromotions([...promotions, newPromo]);
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  const handleDelete = (id: string) => {
    setPromotions(promotions.filter((p) => p.id !== id));
  };

  const formatDiscount = (promo: Promotion) => {
    if (promo.discountType === 'percent') {
      return `${promo.discountValue}%`;
    }
    return new Intl.NumberFormat('uz-UZ').format(promo.discountValue) + ' so\'m';
  };

  const columns: Column<Promotion>[] = [
    {
      key: 'name',
      header: t('name'),
      searchable: true,
      render: (val) => <Text strong>{val}</Text>
    },
    {
      key: 'discount',
      header: t('discount'),
      render: (_, row) => (
        <Tag color="orange" className="rounded-full border-none px-3 font-medium">
          {row.discountType === 'percent' && <Percent size={12} className="inline mr-1" />}
          {formatDiscount(row)}
        </Tag>
      )
    },
    {
      key: 'period',
      header: t('period'),
      hideOnMobile: true,
      render: (_, row) => (
        <Space size={4} className="text-muted-foreground text-xs">
          <Calendar size={14} />
          {row.startDate} — {row.endDate}
        </Space>
      )
    },
    {
      key: 'services',
      header: t('services'),
      hideOnMobile: true,
      render: (_, row) => (
        <Space size={[4, 4]} wrap>
          {row.serviceNames.map((name, i) => (
            <Tag key={i} className="rounded-full border-none px-3 bg-muted/50">
              {name}
            </Tag>
          ))}
        </Space>
      )
    },
    {
      key: 'status',
      header: t('status'),
      align: 'center',
      render: (val, row) => (
        <Tag color={row.isActive ? 'success' : 'default'} className="rounded-full border-none px-3">
          {row.isActive ? t('active') : t('inactive')}
        </Tag>
      )
    },
    {
      key: 'actions',
      header: t('actions'),
      align: 'right',
      render: (_, row) => (
        <Space size="small">
          <Button
            type="text"
            icon={<Edit size={16} />}
            onClick={() => handleEdit(row)}
            className="text-blue-500"
          />
          <Button
            type="text"
            icon={<Trash2 size={16} />}
            onClick={() => handleDelete(row.id)}
            className="text-red-500"
          />
        </Space>
      )
    }
  ];

  const renderMobileCard = (promo: Promotion) => (
    <Card bordered={false} className="bg-card border border-border/20 shadow-sm" styles={{ body: { padding: '16px' } }}>
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0 flex-1">
          <Text strong className="block truncate text-base">{promo.name}</Text>
          <Space size={4} className="mt-1">
            <Calendar size={14} className="text-muted-foreground" />
            <Text className="text-xs text-muted-foreground">{promo.startDate} — {promo.endDate}</Text>
          </Space>
        </div>
        <Tag color={promo.isActive ? 'success' : 'default'} className="rounded-full border-none mr-0">
          {promo.isActive ? t('active') : t('inactive')}
        </Tag>
      </div>
      <div className="flex items-center gap-2 mb-4">
        <Tag color="orange" className="rounded-full border-none px-3 font-medium m-0">
          {promo.discountType === 'percent' && <Percent size={12} className="inline mr-1" />}
          {formatDiscount(promo)}
        </Tag>
        <div className="flex flex-wrap gap-1 flex-1">
          {promo.serviceNames.map((name, i) => (
            <Tag key={i} className="text-[10px] rounded-full px-2 border-none bg-muted/30">
              {name}
            </Tag>
          ))}
        </div>
      </div>
      <div className="flex gap-2 pt-2 border-t border-border/10">
        <Button className="flex-1" icon={<Edit size={16} />} onClick={() => handleEdit(promo)}>
          {t('edit')}
        </Button>
        <Button danger className="flex-1" icon={<Trash2 size={16} />} onClick={() => handleDelete(promo.id)}>
          {t('delete')}
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Title level={2} className="!mb-0 !text-foreground">{t('promotions')}</Title>
          <Text className="text-muted-foreground">{t('managePromotions')}</Text>
        </div>
        <Button 
          type="primary" 
          icon={<Plus size={18} />} 
          onClick={handleCreate} 
          size="large"
          className="bg-blue-600 hover:bg-blue-700 h-11"
        >
          {t('newPromotion')}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card bordered={false} className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20" styles={{ body: { padding: '20px' } }}>
          <Text className="text-muted-foreground text-xs font-bold uppercase tracking-wider block mb-2">{t('total')}</Text>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
              <TagIcon size={20} />
            </div>
            <span className="text-2xl font-bold">{promotions.length}</span>
          </div>
        </Card>
        <Card bordered={false} className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20" styles={{ body: { padding: '20px' } }}>
          <Text className="text-muted-foreground text-xs font-bold uppercase tracking-wider block mb-2">{t('active')}</Text>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
              <TagIcon size={20} />
            </div>
            <span className="text-2xl font-bold">{promotions.filter((p) => p.isActive).length}</span>
          </div>
        </Card>
        <Card bordered={false} className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20" styles={{ body: { padding: '20px' } }}>
          <Text className="text-muted-foreground text-xs font-bold uppercase tracking-wider block mb-2">{t('percentDiscounts')}</Text>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
              <Percent size={20} />
            </div>
            <span className="text-2xl font-bold">
              {promotions.filter((p) => p.discountType === 'percent').length}
            </span>
          </div>
        </Card>
      </div>

      <Card bordered={false} className="bg-card border border-border/20 shadow-sm overflow-hidden" styles={{ body: { padding: '16px' } }}>
        <DataTable
          data={promotions}
          columns={columns}
          searchPlaceholder={t('searchPromotionPlaceholder')}
          renderMobileCard={renderMobileCard}
          getRowId={(p) => p.id}
        />
      </Card>

      <Modal
        title={editingPromo ? t('editPromotion') : t('newPromotion')}
        open={isDialogOpen}
        onCancel={() => setIsDialogOpen(false)}
        onOk={handleSave}
        destroyOnClose
        width={600}
        okButtonProps={{ size: 'large' }}
        cancelButtonProps={{ size: 'large' }}
      >
        <Form
          form={form}
          layout="vertical"
          className="py-4"
          requiredMark={false}
        >
          <Form.Item
            name="name"
            label={t('name')}
            rules={[{ required: true, message: t('enterName') }]}
          >
            <Input placeholder={t('enterName')} size="large" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="discountType"
              label={t('discountType')}
              initialValue="percent"
            >
              <Select size="large">
                <Select.Option value="percent">{t('percentDiscount')}</Select.Option>
                <Select.Option value="fixed">{t('fixedDiscount')}</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="discountValue"
              label={t('discountValue')}
              rules={[{ required: true, message: t('enterValue') }]}
            >
              <Input type="number" placeholder="20" size="large" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="startDate"
              label={t('startDate')}
              rules={[{ required: true, message: t('selectDate') }]}
            >
              <Input type="date" size="large" />
            </Form.Item>
            <Form.Item
              name="endDate"
              label={t('endDate')}
              rules={[{ required: true, message: t('selectDate') }]}
            >
              <Input type="date" size="large" />
            </Form.Item>
          </div>

          <Form.Item
            name="serviceId"
            label={t('service')}
            rules={[{ required: true, message: t('selectService') }]}
          >
            <Select placeholder={t('selectService')} size="large">
              {mockServices.map((service) => (
                <Select.Option key={service.id} value={service.id}>
                  {service.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
