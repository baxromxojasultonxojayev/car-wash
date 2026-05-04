import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Plus,
  Edit,
  Trash2,
  Megaphone,
  Image as ImageIcon,
  Video,
} from 'lucide-react';
import { Button, Card, Input, Select, Tag, Modal, Space, Typography, Form, Switch } from 'antd';
import DataTable, { Column } from '@/components/Table/DataTable';

const { Title, Text } = Typography;

interface Advertisement {
  id: string;
  title: string;
  type: 'image' | 'video';
  kioskIds: string[];
  kioskNames: string[];
  isActive: boolean;
  createdAt: string;
}

const mockAds: Advertisement[] = [
  {
    id: '1',
    title: 'Yangi yil aksiyasi',
    type: 'image',
    kioskIds: ['1', '2'],
    kioskNames: ['Premium Moyka #1', 'Express Zapravka'],
    isActive: true,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'VIP xizmat taqdimoti',
    type: 'video',
    kioskIds: ['1'],
    kioskNames: ['Premium Moyka #1'],
    isActive: true,
    createdAt: '2024-02-20',
  },
];

const mockKiosks = [
  { id: '1', name: 'Premium Moyka #1' },
  { id: '2', name: 'Express Zapravka' },
  { id: '3', name: 'Auto Service Pro' },
];

export default function AdvertisementsPage() {
  const { t } = useTranslation();
  const [ads, setAds] = useState<Advertisement[]>(mockAds);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  const [form] = Form.useForm();

  const handleCreate = () => {
    setEditingAd(null);
    form.resetFields();
    setIsDialogOpen(true);
  };

  const handleEdit = (ad: Advertisement) => {
    setEditingAd(ad);
    form.setFieldsValue({
      title: ad.title,
      type: ad.type,
      kioskId: ad.kioskIds[0] || '',
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const kiosk = mockKiosks.find((k) => k.id === values.kioskId);
      
      if (editingAd) {
        setAds(
          ads.map((ad) =>
            ad.id === editingAd.id
              ? {
                  ...ad,
                  title: values.title,
                  type: values.type,
                  kioskIds: values.kioskId ? [values.kioskId] : [],
                  kioskNames: kiosk ? [kiosk.name] : [],
                }
              : ad
          )
        );
      } else {
        const newAd: Advertisement = {
          id: Date.now().toString(),
          title: values.title,
          type: values.type,
          kioskIds: values.kioskId ? [values.kioskId] : [],
          kioskNames: kiosk ? [kiosk.name] : [],
          isActive: true,
          createdAt: new Date().toISOString().split('T')[0],
        };
        setAds([...ads, newAd]);
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  const handleToggle = (id: string) => {
    setAds(ads.map((ad) => (ad.id === id ? { ...ad, isActive: !ad.isActive } : ad)));
  };

  const handleDelete = (id: string) => {
    setAds(ads.filter((ad) => ad.id !== id));
  };

  const columns: Column<Advertisement>[] = [
    {
      key: 'title',
      header: t('title'),
      searchable: true,
      render: (val) => <Text strong>{val}</Text>
    },
    {
      key: 'type',
      header: t('type'),
      render: (val: 'image' | 'video') => (
        <Space size={8}>
          {val === 'image' ? (
            <ImageIcon size={16} className="text-blue-500" />
          ) : (
            <Video size={16} className="text-purple-500" />
          )}
          <Tag className="rounded-full border-none px-3">
            {val === 'image' ? t('image') : t('video')}
          </Tag>
        </Space>
      )
    },
    {
      key: 'kiosks',
      header: t('kiosks'),
      hideOnMobile: true,
      render: (_, row) => (
        <Space size={[4, 4]} wrap>
          {row.kioskNames.map((name, i) => (
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

  const renderMobileCard = (ad: Advertisement) => (
    <Card bordered={false} className="bg-card border border-border/20 shadow-sm" styles={{ body: { padding: '16px' } }}>
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0 flex-1">
          <Text strong className="block truncate text-base">{ad.title}</Text>
          <Space size={4} className="mt-1">
            {ad.type === 'image' ? <ImageIcon size={14} /> : <Video size={14} />}
            <Text size="small" className="text-muted-foreground">{t(ad.type)}</Text>
          </Space>
        </div>
        <Switch 
          checked={ad.isActive} 
          onChange={() => handleToggle(ad.id)} 
          size="small"
        />
      </div>
      <div className="flex flex-wrap gap-1 mb-4">
        {ad.kioskNames.map((name, i) => (
          <Tag key={i} className="text-[10px] rounded-full px-2 border-none bg-muted/30">
            {name}
          </Tag>
        ))}
      </div>
      <div className="flex gap-2 pt-2 border-t border-border/10">
        <Button className="flex-1" icon={<Edit size={16} />} onClick={() => handleEdit(ad)}>
          {t('edit')}
        </Button>
        <Button danger className="flex-1" icon={<Trash2 size={16} />} onClick={() => handleDelete(ad.id)}>
          {t('delete')}
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Title level={2} className="!mb-0 !text-foreground">{t('advertisements')}</Title>
          <Text className="text-muted-foreground">{t('manageAdvertisements')}</Text>
        </div>
        <Button 
          type="primary" 
          icon={<Plus size={18} />} 
          onClick={handleCreate} 
          size="large"
          className="bg-blue-600 hover:bg-blue-700 h-11"
        >
          {t('newAdvertisement')}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card bordered={false} className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20" styles={{ body: { padding: '20px' } }}>
          <Text className="text-muted-foreground text-xs font-bold uppercase tracking-wider block mb-2">{t('total')}</Text>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Megaphone className="h-5 w-5 text-blue-500" />
            </div>
            <span className="text-2xl font-bold">{ads.length}</span>
          </div>
        </Card>
        <Card bordered={false} className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20" styles={{ body: { padding: '20px' } }}>
          <Text className="text-muted-foreground text-xs font-bold uppercase tracking-wider block mb-2">{t('active')}</Text>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Megaphone className="h-5 w-5 text-green-500" />
            </div>
            <span className="text-2xl font-bold">{ads.filter((a) => a.isActive).length}</span>
          </div>
        </Card>
        <Card bordered={false} className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20" styles={{ body: { padding: '20px' } }}>
          <Text className="text-muted-foreground text-xs font-bold uppercase tracking-wider block mb-2">{t('videos')}</Text>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Video className="h-5 w-5 text-purple-500" />
            </div>
            <span className="text-2xl font-bold">{ads.filter((a) => a.type === 'video').length}</span>
          </div>
        </Card>
      </div>

      <Card bordered={false} className="bg-card border border-border/20 shadow-sm overflow-hidden" styles={{ body: { padding: '16px' } }}>
        <DataTable
          data={ads}
          columns={columns}
          searchPlaceholder={t('searchAdvertisementPlaceholder')}
          renderMobileCard={renderMobileCard}
          getRowId={(a) => a.id}
        />
      </Card>

      <Modal
        title={editingAd ? t('editAdvertisement') : t('newAdvertisement')}
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
            name="title"
            label={t('title')}
            rules={[{ required: true, message: t('enterTitle') }]}
          >
            <Input placeholder={t('enterTitle')} size="large" />
          </Form.Item>

          <Form.Item
            name="type"
            label={t('type')}
            initialValue="image"
          >
            <Select size="large">
              <Select.Option value="image">{t('image')}</Select.Option>
              <Select.Option value="video">{t('video')}</Select.Option>
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
        </Form>
      </Modal>
    </div>
  );
}
