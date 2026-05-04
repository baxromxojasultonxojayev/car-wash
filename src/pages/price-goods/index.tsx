import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Plus,
  Edit,
  Trash2,
  DollarSign,
  Fuel,
  Car,
} from 'lucide-react';
import { Button, Card, Input, Tag, Modal, Space, Typography, Form, Switch, Tabs } from 'antd';
import DataTable, { Column } from '@/components/Table/DataTable';

const { Title, Text, Paragraph } = Typography;

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  isActive: boolean;
}

interface OilPrice {
  id: string;
  type: string;
  price: number;
  kioskName: string;
}

const mockServices: Service[] = [
  { id: '1', name: 'Oddiy yuvish', price: 30000, duration: 15, isActive: true },
  { id: '2', name: 'Premium yuvish', price: 50000, duration: 25, isActive: true },
  { id: '3', name: 'VIP yuvish', price: 100000, duration: 45, isActive: true },
  { id: '4', name: 'Salon tozalash', price: 80000, duration: 30, isActive: false },
];

const mockOilPrices: OilPrice[] = [
  { id: '1', type: 'AI-92', price: 9500, kioskName: 'Express Zapravka' },
  { id: '2', type: 'AI-95', price: 11200, kioskName: 'Express Zapravka' },
  { id: '3', type: 'AI-98', price: 13500, kioskName: 'Express Zapravka' },
];

export default function PriceGoodsPage() {
  const { t } = useTranslation();
  const [services, setServices] = useState<Service[]>(mockServices);
  const [oilPrices, setOilPrices] = useState<OilPrice[]>(mockOilPrices);
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [isOilDialogOpen, setIsOilDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingOil, setEditingOil] = useState<OilPrice | null>(null);
  const [serviceForm] = Form.useForm();
  const [oilForm] = Form.useForm();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('uz-UZ').format(value) + ' so\'m';
  };

  const handleToggleService = (id: string) => {
    setServices(services.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s)));
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    serviceForm.setFieldsValue({
      name: service.name,
      price: service.price,
      duration: service.duration,
    });
    setIsServiceDialogOpen(true);
  };

  const handleSaveService = async () => {
    try {
      const values = await serviceForm.validateFields();
      if (editingService) {
        setServices(
          services.map((s) =>
            s.id === editingService.id
              ? { ...s, name: values.name, price: Number(values.price), duration: Number(values.duration) }
              : s
          )
        );
      } else {
        setServices([
          ...services,
          {
            id: Date.now().toString(),
            name: values.name,
            price: Number(values.price),
            duration: Number(values.duration),
            isActive: true,
          },
        ]);
      }
      setIsServiceDialogOpen(false);
      setEditingService(null);
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  const handleDeleteService = (id: string) => {
    setServices(services.filter((s) => s.id !== id));
  };

  const handleEditOil = (oil: OilPrice) => {
    setEditingOil(oil);
    oilForm.setFieldsValue({ type: oil.type, price: oil.price });
    setIsOilDialogOpen(true);
  };

  const handleSaveOil = async () => {
    try {
      const values = await oilForm.validateFields();
      if (editingOil) {
        setOilPrices(
          oilPrices.map((o) =>
            o.id === editingOil.id ? { ...o, price: Number(values.price) } : o
          )
        );
      }
      setIsOilDialogOpen(false);
      setEditingOil(null);
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  const serviceColumns: Column<Service>[] = [
    {
      key: 'name',
      header: t('serviceName'),
      searchable: true,
      render: (val) => <Text strong>{val}</Text>
    },
    {
      key: 'price',
      header: t('price'),
      align: 'right',
      render: (val) => <Text className="font-mono">{formatCurrency(val)}</Text>
    },
    {
      key: 'duration',
      header: t('duration'),
      align: 'center',
      render: (val) => <Tag className="rounded-full border-none px-3">{val} {t('minutes')}</Tag>
    },
    {
      key: 'status',
      header: t('status'),
      align: 'center',
      render: (_, row) => (
        <Switch
          checked={row.isActive}
          onChange={() => handleToggleService(row.id)}
          size="small"
        />
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
            onClick={() => handleEditService(row)}
            className="text-blue-500"
          />
          <Button
            type="text"
            icon={<Trash2 size={16} />}
            onClick={() => handleDeleteService(row.id)}
            className="text-red-500"
          />
        </Space>
      )
    }
  ];

  const renderMobileServiceCard = (service: Service) => (
    <Card bordered={false} className="bg-card border border-border/20 shadow-sm" styles={{ body: { padding: '16px' } }}>
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0 flex-1">
          <Text strong className="block truncate text-base">{service.name}</Text>
          <Text className="text-muted-foreground block truncate">{service.duration} {t('minutes')}</Text>
        </div>
        <Switch
          checked={service.isActive}
          onChange={() => handleToggleService(service.id)}
          size="small"
        />
      </div>
      <div className="flex justify-between items-center mb-4">
        <Text strong className="text-blue-500">{formatCurrency(service.price)}</Text>
      </div>
      <div className="flex gap-2 pt-2 border-t border-border/10">
        <Button className="flex-1" icon={<Edit size={16} />} onClick={() => handleEditService(service)}>
          {t('edit')}
        </Button>
        <Button danger className="flex-1" icon={<Trash2 size={16} />} onClick={() => handleDeleteService(service.id)}>
          {t('delete')}
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Title level={2} className="!mb-0 !text-foreground">{t('priceGoods')}</Title>
          <Text className="text-muted-foreground">{t('managePrices')}</Text>
        </div>
      </div>

      <Tabs
        defaultActiveKey="services"
        className="custom-tabs"
        items={[
          {
            key: 'services',
            label: (
              <Space>
                <Car size={16} />
                {t('services')}
              </Space>
            ),
            children: (
              <div className="space-y-6 pt-2">
                <div className="flex justify-end">
                  <Button
                    type="primary"
                    icon={<Plus size={18} />}
                    onClick={() => {
                      setEditingService(null);
                      serviceForm.resetFields();
                      setIsServiceDialogOpen(true);
                    }}
                    size="large"
                    className="bg-blue-600 hover:bg-blue-700 h-11"
                  >
                    {t('addService')}
                  </Button>
                </div>
                <Card bordered={false} className="bg-card border border-border/20 shadow-sm overflow-hidden" styles={{ body: { padding: '16px' } }}>
                  <DataTable
                    data={services}
                    columns={serviceColumns}
                    searchPlaceholder={t('searchServicePlaceholder')}
                    renderMobileCard={renderMobileServiceCard}
                    getRowId={(s) => s.id}
                  />
                </Card>
              </div>
            )
          },
          {
            key: 'oil',
            label: (
              <Space>
                <Fuel size={16} />
                {t('oilPrices')}
              </Space>
            ),
            children: (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                {oilPrices.map((oil) => (
                  <Card
                    key={oil.id}
                    bordered={false}
                    className="bg-card border border-border/20 shadow-md relative overflow-hidden group transition-all hover:shadow-lg"
                    styles={{ body: { padding: '24px' } }}
                  >
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500" />
                    <div className="flex items-center justify-between mb-4">
                      <Tag color="blue" className="text-lg font-bold px-4 py-1 rounded-full border-none m-0 shadow-sm">
                        {oil.type}
                      </Tag>
                      <Button
                        type="text"
                        icon={<Edit size={18} />}
                        onClick={() => handleEditOil(oil)}
                        className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <DollarSign className="h-6 w-6 text-blue-500" />
                      </div>
                      <Text className="text-3xl font-black tracking-tight">{formatCurrency(oil.price)}</Text>
                    </div>
                    <Paragraph className="text-muted-foreground text-sm flex items-center gap-2 mb-0">
                      <Car size={14} />
                      {oil.kioskName}
                    </Paragraph>
                  </Card>
                ))}
              </div>
            )
          }
        ]}
      />

      <Modal
        title={editingService ? t('editService') : t('addService')}
        open={isServiceDialogOpen}
        onCancel={() => setIsServiceDialogOpen(false)}
        onOk={handleSaveService}
        destroyOnClose
        width={500}
        okButtonProps={{ size: 'large' }}
        cancelButtonProps={{ size: 'large' }}
      >
        <Form
          form={serviceForm}
          layout="vertical"
          className="py-4"
          requiredMark={false}
        >
          <Form.Item
            name="name"
            label={t('serviceName')}
            rules={[{ required: true, message: t('enterServiceName') }]}
          >
            <Input placeholder={t('enterServiceName')} size="large" />
          </Form.Item>

          <Form.Item
            name="price"
            label={`${t('price')} (so'm)`}
            rules={[{ required: true, message: t('enterPrice') }]}
          >
            <Input type="number" placeholder="30000" size="large" suffix="so'm" />
          </Form.Item>

          <Form.Item
            name="duration"
            label={`${t('duration')} (${t('minutes')})`}
            rules={[{ required: true, message: t('enterDuration') }]}
          >
            <Input type="number" placeholder="15" size="large" suffix={t('minutes')} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={t('editOilPrice')}
        open={isOilDialogOpen}
        onCancel={() => setIsOilDialogOpen(false)}
        onOk={handleSaveOil}
        destroyOnClose
        width={400}
        okButtonProps={{ size: 'large' }}
        cancelButtonProps={{ size: 'large' }}
      >
        <Form
          form={oilForm}
          layout="vertical"
          className="py-4"
          requiredMark={false}
        >
          <Form.Item
            name="type"
            label={t('fuelType')}
          >
            <Input disabled size="large" className="bg-muted/50" />
          </Form.Item>

          <Form.Item
            name="price"
            label={`${t('price')} (so'm)`}
            rules={[{ required: true, message: t('enterPrice') }]}
          >
            <Input type="number" placeholder="9500" size="large" suffix="so'm" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
