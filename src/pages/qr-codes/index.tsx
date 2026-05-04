import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Plus,
  Edit,
  Trash2,
  QrCode,
  Download,
  Copy,
} from 'lucide-react';
import { Button, Card, Input, Select, Tag, Modal, Space, Typography, Form, Tooltip } from 'antd';
import DataTable, { Column } from '@/components/Table/DataTable';

const { Title, Text } = Typography;

interface QRCode {
  id: string;
  code: string;
  name: string;
  kioskId: string;
  kioskName: string;
  organizationName: string;
  status: 'active' | 'inactive';
  scansCount: number;
  createdAt: string;
}

const mockQRCodes: QRCode[] = [
  {
    id: '1',
    code: 'QR-001-PREM',
    name: 'Kiosk 1 - Kirish',
    kioskId: 'k1',
    kioskName: 'Moyka Kiosk #1',
    organizationName: 'Premium Car Wash',
    status: 'active',
    scansCount: 245,
    createdAt: '2024-01-20',
  },
  {
    id: '2',
    code: 'QR-002-EXPR',
    name: 'Kiosk 2 - Asosiy',
    kioskId: 'k2',
    kioskName: 'Express Kiosk #2',
    organizationName: 'Express Wash',
    status: 'active',
    scansCount: 189,
    createdAt: '2024-02-15',
  },
];

const mockKiosks = [
  { id: 'k1', name: 'Moyka Kiosk #1' },
  { id: 'k2', name: 'Express Kiosk #2' },
  { id: 'k3', name: 'Auto Service Kiosk' },
];

export default function QRCodesPage() {
  const { t } = useTranslation();
  const [qrCodes, setQRCodes] = useState<QRCode[]>(mockQRCodes);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQR, setEditingQR] = useState<QRCode | null>(null);
  const [form] = Form.useForm();

  const handleCreate = () => {
    setEditingQR(null);
    form.resetFields();
    setIsDialogOpen(true);
  };

  const handleEdit = (qr: QRCode) => {
    setEditingQR(qr);
    form.setFieldsValue({ name: qr.name, kioskId: qr.kioskId });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const kiosk = mockKiosks.find((k) => k.id === values.kioskId);
      if (editingQR) {
        setQRCodes(
          qrCodes.map((qr) =>
            qr.id === editingQR.id
              ? { ...qr, name: values.name, kioskId: values.kioskId, kioskName: kiosk?.name || '' }
              : qr
          )
        );
      } else {
        const newQR: QRCode = {
          id: Date.now().toString(),
          code: `QR-${Date.now().toString().slice(-6)}`,
          name: values.name,
          kioskId: values.kioskId,
          kioskName: kiosk?.name || '',
          organizationName: 'Premium Car Wash',
          status: 'active',
          scansCount: 0,
          createdAt: new Date().toISOString().split('T')[0],
        };
        setQRCodes([...qrCodes, newQR]);
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  const handleDelete = (id: string) => {
    setQRCodes(qrCodes.filter((qr) => qr.id !== id));
  };

  const columns: Column<QRCode>[] = [
    {
      key: 'code',
      header: t('code'),
      render: (val) => <Text code className="bg-muted px-2 py-0.5 rounded">{val}</Text>
    },
    {
      key: 'name',
      header: t('name'),
      searchable: true,
      render: (val) => <Text strong>{val}</Text>
    },
    {
      key: 'kioskName',
      header: t('kiosk'),
      hideOnMobile: true,
      render: (val) => <Text className="text-muted-foreground">{val}</Text>
    },
    {
      key: 'scansCount',
      header: t('scans'),
      align: 'center',
      render: (val) => <Tag className="rounded-full border-none bg-blue-500/10 text-blue-600 px-3">{val}</Tag>
    },
    {
      key: 'status',
      header: t('status'),
      align: 'center',
      render: (val) => (
        <Tag color={val === 'active' ? 'success' : 'default'} className="rounded-full border-none px-3">
          {val === 'active' ? t('active') : t('inactive')}
        </Tag>
      )
    },
    {
      key: 'actions',
      header: t('actions'),
      align: 'right',
      render: (_, row) => (
        <Space size="small">
          <Tooltip title={t('download')}>
            <Button type="text" icon={<Download size={16} />} className="text-muted-foreground" />
          </Tooltip>
          <Tooltip title={t('copyCode')}>
            <Button type="text" icon={<Copy size={16} />} className="text-muted-foreground" />
          </Tooltip>
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

  const renderMobileCard = (qr: QRCode) => (
    <Card bordered={false} className="bg-card border border-border/20 shadow-sm" styles={{ body: { padding: '16px' } }}>
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0 flex-1">
          <Text strong className="block truncate text-base">{qr.name}</Text>
          <Text code size="small" className="mt-1">{qr.code}</Text>
        </div>
        <Tag color={qr.status === 'active' ? 'success' : 'default'} className="rounded-full border-none mr-0">
          {qr.status === 'active' ? t('active') : t('inactive')}
        </Tag>
      </div>
      <div className="flex justify-between items-center mb-4">
        <Text className="text-sm text-muted-foreground">{qr.kioskName}</Text>
        <Text className="text-xs font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full">{qr.scansCount} scans</Text>
      </div>
      <div className="flex gap-2 pt-2 border-t border-border/10">
        <Button className="flex-1" icon={<Edit size={16} />} onClick={() => handleEdit(qr)}>
          {t('edit')}
        </Button>
        <Button danger className="flex-1" icon={<Trash2 size={16} />} onClick={() => handleDelete(qr.id)}>
          {t('delete')}
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Title level={2} className="!mb-0 !text-foreground">{t('qrCodes')}</Title>
          <Text className="text-muted-foreground">{t('manageQRCodes')}</Text>
        </div>
        <Button 
          type="primary" 
          icon={<Plus size={18} />} 
          onClick={handleCreate} 
          size="large"
          className="bg-blue-600 hover:bg-blue-700 h-11"
        >
          {t('newQRCode')}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card bordered={false} className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20" styles={{ body: { padding: '20px' } }}>
          <Text className="text-muted-foreground text-xs font-bold uppercase tracking-wider block mb-2">{t('totalQRCodes')}</Text>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
              <QrCode size={20} />
            </div>
            <span className="text-2xl font-bold">{qrCodes.length}</span>
          </div>
        </Card>
        <Card bordered={false} className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20" styles={{ body: { padding: '20px' } }}>
          <Text className="text-muted-foreground text-xs font-bold uppercase tracking-wider block mb-2">{t('active')}</Text>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
              <QrCode size={20} />
            </div>
            <span className="text-2xl font-bold">
              {qrCodes.filter((q) => q.status === 'active').length}
            </span>
          </div>
        </Card>
        <Card bordered={false} className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20" styles={{ body: { padding: '20px' } }}>
          <Text className="text-muted-foreground text-xs font-bold uppercase tracking-wider block mb-2">{t('totalScans')}</Text>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
              <QrCode size={20} />
            </div>
            <span className="text-2xl font-bold">
              {qrCodes.reduce((sum, q) => sum + q.scansCount, 0)}
            </span>
          </div>
        </Card>
      </div>

      <Card bordered={false} className="bg-card border border-border/20 shadow-sm overflow-hidden" styles={{ body: { padding: '16px' } }}>
        <DataTable
          data={qrCodes}
          columns={columns}
          searchPlaceholder={t('searchQRCodePlaceholder')}
          renderMobileCard={renderMobileCard}
          getRowId={(qr) => qr.id}
        />
      </Card>

      <Modal
        title={editingQR ? t('editQRCode') : t('newQRCode')}
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
            rules={[{ required: true, message: t('qrNamePlaceholder') }]}
          >
            <Input placeholder={t('qrNamePlaceholder')} size="large" />
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
        </Form>
      </Modal>
    </div>
  );
}
