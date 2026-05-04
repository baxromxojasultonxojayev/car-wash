import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Plus,
  Edit,
  Trash2,
  UserCheck,
  Briefcase,
} from 'lucide-react';
import { Button, Card, Input, Select, Tag, Modal, Space, Typography, Form, Switch } from 'antd';
import DataTable, { Column } from '@/components/Table/DataTable';

const { Title, Text } = Typography;

interface Worker {
  id: string;
  name: string;
  position: string;
  kioskId: string;
  kioskName: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
}

const mockWorkers: Worker[] = [
  {
    id: '1',
    name: 'Abdullayev Jasurbek',
    position: 'Operator',
    kioskId: '1',
    kioskName: 'Premium Moyka #1',
    phone: '+998 90 123 45 67',
    isActive: true,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Karimov Sherzod',
    position: 'Yuvuvchi',
    kioskId: '1',
    kioskName: 'Premium Moyka #1',
    phone: '+998 91 234 56 78',
    isActive: true,
    createdAt: '2024-02-01',
  },
  {
    id: '3',
    name: 'Rahimov Alisher',
    position: 'Kassir',
    kioskId: '2',
    kioskName: 'Express Zapravka',
    phone: '+998 93 345 67 89',
    isActive: false,
    createdAt: '2024-02-15',
  },
];

const mockKiosks = [
  { id: '1', name: 'Premium Moyka #1' },
  { id: '2', name: 'Express Zapravka' },
  { id: '3', name: 'Auto Service Pro' },
];

const positions = ['Operator', 'Yuvuvchi', 'Kassir', 'Menejer', 'Texnik'];

export default function WorkersPage() {
  const { t } = useTranslation();
  const [workers, setWorkers] = useState<Worker[]>(mockWorkers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
  const [form] = Form.useForm();

  const handleCreate = () => {
    setEditingWorker(null);
    form.resetFields();
    setIsDialogOpen(true);
  };

  const handleEdit = (worker: Worker) => {
    setEditingWorker(worker);
    form.setFieldsValue({
      name: worker.name,
      position: worker.position,
      kioskId: worker.kioskId,
      phone: worker.phone,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const kiosk = mockKiosks.find((k) => k.id === values.kioskId);
      
      if (editingWorker) {
        setWorkers(
          workers.map((w) =>
            w.id === editingWorker.id
              ? {
                  ...w,
                  name: values.name,
                  position: values.position,
                  kioskId: values.kioskId,
                  kioskName: kiosk?.name || '',
                  phone: values.phone,
                }
              : w
          )
        );
      } else {
        const newWorker: Worker = {
          id: Date.now().toString(),
          name: values.name,
          position: values.position,
          kioskId: values.kioskId,
          kioskName: kiosk?.name || '',
          phone: values.phone,
          isActive: true,
          createdAt: new Date().toISOString().split('T')[0],
        };
        setWorkers([...workers, newWorker]);
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  const handleToggle = (id: string) => {
    setWorkers(workers.map((w) => (w.id === id ? { ...w, isActive: !w.isActive } : w)));
  };

  const handleDelete = (id: string) => {
    setWorkers(workers.filter((w) => w.id !== id));
  };

  const columns: Column<Worker>[] = [
    {
      key: 'name',
      header: t('name'),
      searchable: true,
      render: (val) => <Text strong>{val}</Text>
    },
    {
      key: 'position',
      header: t('position'),
      render: (val) => <Tag className="rounded-full border-none px-3">{val}</Tag>
    },
    {
      key: 'kioskName',
      header: t('kiosk'),
      hideOnMobile: true,
      render: (val) => <Text className="text-muted-foreground">{val}</Text>
    },
    {
      key: 'phone',
      header: t('phone'),
      hideOnMobile: true,
      render: (val) => <Text className="text-muted-foreground">{val}</Text>
    },
    {
      key: 'status',
      header: t('status'),
      align: 'center',
      render: (_, row) => (
        <Switch 
          checked={row.isActive} 
          onChange={() => handleToggle(row.id)} 
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

  const renderMobileCard = (worker: Worker) => (
    <Card bordered={false} className="bg-card border border-border/20 shadow-sm" styles={{ body: { padding: '16px' } }}>
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0 flex-1">
          <Text strong className="block truncate text-base">{worker.name}</Text>
          <Text size="small" className="text-muted-foreground block truncate">{worker.position} • {worker.kioskName}</Text>
        </div>
        <Switch 
          checked={worker.isActive} 
          onChange={() => handleToggle(worker.id)} 
          size="small"
        />
      </div>
      <div className="flex justify-between items-center mb-4">
        <Text className="text-xs text-muted-foreground">{worker.phone}</Text>
      </div>
      <div className="flex gap-2 pt-2 border-t border-border/10">
        <Button className="flex-1" icon={<Edit size={16} />} onClick={() => handleEdit(worker)}>
          {t('edit')}
        </Button>
        <Button danger className="flex-1" icon={<Trash2 size={16} />} onClick={() => handleDelete(worker.id)}>
          {t('delete')}
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Title level={2} className="!mb-0 !text-foreground">{t('workers')}</Title>
          <Text className="text-muted-foreground">{t('manageWorkers')}</Text>
        </div>
        <Button 
          type="primary" 
          icon={<Plus size={18} />} 
          onClick={handleCreate} 
          size="large"
          className="bg-blue-600 hover:bg-blue-700 h-11"
        >
          {t('newWorker')}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card bordered={false} className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20" styles={{ body: { padding: '20px' } }}>
          <Text className="text-muted-foreground text-xs font-bold uppercase tracking-wider block mb-2">{t('total')}</Text>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <UserCheck className="h-5 w-5 text-blue-500" />
            </div>
            <span className="text-2xl font-bold">{workers.length}</span>
          </div>
        </Card>
        <Card bordered={false} className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20" styles={{ body: { padding: '20px' } }}>
          <Text className="text-muted-foreground text-xs font-bold uppercase tracking-wider block mb-2">{t('active')}</Text>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <UserCheck className="h-5 w-5 text-green-500" />
            </div>
            <span className="text-2xl font-bold">{workers.filter((w) => w.isActive).length}</span>
          </div>
        </Card>
        <Card bordered={false} className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20" styles={{ body: { padding: '20px' } }}>
          <Text className="text-muted-foreground text-xs font-bold uppercase tracking-wider block mb-2">{t('positions')}</Text>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Briefcase className="h-5 w-5 text-purple-500" />
            </div>
            <span className="text-2xl font-bold">{new Set(workers.map((w) => w.position)).size}</span>
          </div>
        </Card>
      </div>

      <Card bordered={false} className="bg-card border border-border/20 shadow-sm overflow-hidden" styles={{ body: { padding: '16px' } }}>
        <DataTable
          data={workers}
          columns={columns}
          searchPlaceholder={t('searchWorkerPlaceholder')}
          renderMobileCard={renderMobileCard}
          getRowId={(w) => w.id}
        />
      </Card>

      <Modal
        title={editingWorker ? t('editWorker') : t('newWorker')}
        open={isDialogOpen}
        onCancel={() => setIsDialogOpen(false)}
        onOk={handleSave}
        destroyOnClose
        width={500}
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
            rules={[{ required: true, message: t('workerNamePlaceholder') }]}
          >
            <Input placeholder={t('workerNamePlaceholder')} size="large" />
          </Form.Item>

          <Form.Item
            name="position"
            label={t('position')}
            rules={[{ required: true, message: t('selectPosition') }]}
          >
            <Select placeholder={t('selectPosition')} size="large">
              {positions.map((pos) => (
                <Select.Option key={pos} value={pos}>
                  {pos}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="kioskId"
            label={t('kiosk')}
            rules={[{ required: true, message: t('selectKiosk') }]}
          >
            <Select placeholder={t('selectKiosk')} size="large">
              {mockKiosks.map((kiosk) => (
                <Select.Option key={kiosk.id} value={kiosk.id}>
                  {kiosk.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="phone"
            label={t('phone')}
            rules={[{ required: true, message: t('phone') }]}
          >
            <Input placeholder="+998 90 123 45 67" size="large" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
