import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Zap,
  Fuel,
  Wrench,
  Car,
} from 'lucide-react';
import { Button, Card, Input, Select, Badge, Modal, Space, Typography, Tag } from 'antd';
import DataTable, { Column } from '@/components/Table/DataTable';

const { Title, Text } = Typography;

type KioskType = 'moyka' | 'zapravka' | 'auto_service';

interface Kiosk {
  id: string;
  name: string;
  type: KioskType;
  boxNumbers?: string;
  address: string;
  status: 'active' | 'inactive';
  todayRevenue: number;
  createdAt: string;
}

const mockKiosks: Kiosk[] = [
  {
    id: '1',
    name: 'Premium Moyka #1',
    type: 'moyka',
    boxNumbers: '1-8',
    address: 'Toshkent, Chilonzor tumani',
    status: 'active',
    todayRevenue: 2500000,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Express Zapravka',
    type: 'zapravka',
    address: 'Toshkent, Yunusobod tumani',
    status: 'active',
    todayRevenue: 8500000,
    createdAt: '2024-02-20',
  },
  {
    id: '3',
    name: 'Auto Service Pro',
    type: 'auto_service',
    address: 'Toshkent, Mirzo Ulugbek tumani',
    status: 'inactive',
    todayRevenue: 0,
    createdAt: '2024-03-10',
  },
];

const typeIcons = {
  moyka: Car,
  zapravka: Fuel,
  auto_service: Wrench,
};

const typeColors = {
  moyka: 'bg-blue-500',
  zapravka: 'bg-orange-500',
  auto_service: 'bg-purple-500',
};

export default function KiosksPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [kiosks, setKiosks] = useState<Kiosk[]>(mockKiosks);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingKiosk, setEditingKiosk] = useState<Kiosk | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'moyka' as KioskType,
    boxNumbers: '',
    address: '',
  });

  const filteredKiosks = useMemo(() => {
    return kiosks.filter((kiosk) => {
      const matchesType = typeFilter === 'all' || kiosk.type === typeFilter;
      return matchesType;
    });
  }, [kiosks, typeFilter]);

  const handleCreate = () => {
    setEditingKiosk(null);
    setFormData({ name: '', type: 'moyka', boxNumbers: '', address: '' });
    setIsDialogOpen(true);
  };

  const handleEdit = (kiosk: Kiosk) => {
    setEditingKiosk(kiosk);
    setFormData({
      name: kiosk.name,
      type: kiosk.type,
      boxNumbers: kiosk.boxNumbers || '',
      address: kiosk.address,
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingKiosk) {
      setKiosks(
        kiosks.map((k) =>
          k.id === editingKiosk.id ? { ...k, ...formData } : k
        )
      );
    } else {
      const newKiosk: Kiosk = {
        id: Date.now().toString(),
        name: formData.name,
        type: formData.type,
        boxNumbers: formData.type === 'moyka' ? formData.boxNumbers : undefined,
        address: formData.address,
        status: 'active',
        todayRevenue: 0,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setKiosks([...kiosks, newKiosk]);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setKiosks(kiosks.filter((k) => k.id !== id));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('uz-UZ').format(value) + ' so\'m';
  };

  const stats = {
    total: kiosks.length,
    moyka: kiosks.filter((k) => k.type === 'moyka').length,
    zapravka: kiosks.filter((k) => k.type === 'zapravka').length,
    autoService: kiosks.filter((k) => k.type === 'auto_service').length,
  };

  const columns: Column<Kiosk>[] = [
    {
      key: 'name',
      header: t('name'),
      searchable: true,
      render: (val, row) => {
        const TypeIcon = typeIcons[row.type];
        return (
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg ${typeColors[row.type]} flex items-center justify-center flex-shrink-0`}>
              <TypeIcon className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0">
              <Text strong className="block truncate">{row.name}</Text>
              {row.boxNumbers && (
                <Text size="small" className="text-muted-foreground block truncate">
                  Box: {row.boxNumbers}
                </Text>
              )}
            </div>
          </div>
        );
      }
    },
    {
      key: 'type',
      header: t('type'),
      render: (val: KioskType) => (
        <Tag className="rounded-full border-none px-3">{t(val)}</Tag>
      )
    },
    {
      key: 'address',
      header: t('address'),
      hideOnMobile: true,
      searchable: true,
      render: (val) => <Text className="text-muted-foreground">{val}</Text>
    },
    {
      key: 'todayRevenue',
      header: t('todayRevenue'),
      align: 'right',
      render: (val) => <Text strong>{formatCurrency(val)}</Text>
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
          <Button
            type="text"
            icon={<Eye size={16} />}
            onClick={() => navigate(`/kiosks/${row.id}`)}
            className="text-primary"
          />
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

  const renderMobileCard = (kiosk: Kiosk) => {
    const TypeIcon = typeIcons[kiosk.type];
    return (
      <Card bordered={false} className="bg-card border border-border/20 shadow-sm" styles={{ body: { padding: '16px' } }}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-9 h-9 rounded-xl ${typeColors[kiosk.type]} flex items-center justify-center flex-shrink-0`}>
              <TypeIcon className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0">
              <Text strong className="block truncate text-base">{kiosk.name}</Text>
              <Text className="text-xs text-muted-foreground">{t(kiosk.type)}</Text>
            </div>
          </div>
          <Tag color={kiosk.status === 'active' ? 'success' : 'default'} className="rounded-full border-none">
            {kiosk.status === 'active' ? t('active') : t('inactive')}
          </Tag>
        </div>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <Text className="text-muted-foreground text-xs">{t('address')}</Text>
            <Text className="text-xs truncate max-w-[200px]">{kiosk.address}</Text>
          </div>
          <div className="flex justify-between items-center">
            <Text className="text-muted-foreground text-xs">{t('todayRevenue')}</Text>
            <Text strong className="text-primary">{formatCurrency(kiosk.todayRevenue)}</Text>
          </div>
        </div>
        <div className="flex gap-2 pt-2 border-t border-border/10">
          <Button 
            className="flex-1" 
            icon={<Eye size={16} />}
            onClick={() => navigate(`/kiosks/${kiosk.id}`)}
          >
            {t('view')}
          </Button>
          <Button 
            className="flex-1" 
            icon={<Edit size={16} />}
            onClick={() => handleEdit(kiosk)}
          >
            {t('edit')}
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Title level={2} className="!mb-0 !text-foreground">{t('kiosks')}</Title>
          <Text className="text-muted-foreground">{t('manageKiosks')}</Text>
        </div>
        <Button 
          type="primary" 
          icon={<Plus size={18} />} 
          onClick={handleCreate} 
          size="large"
          className="bg-blue-600 hover:bg-blue-700 h-11"
        >
          {t('newKiosk')}
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card bordered={false} className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20" styles={{ body: { padding: '20px' } }}>
          <Text className="text-muted-foreground text-xs font-bold uppercase tracking-wider block mb-2">{t('total')}</Text>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Zap className="h-5 w-5 text-blue-500" />
            </div>
            <span className="text-2xl font-bold">{stats.total}</span>
          </div>
        </Card>
        <Card bordered={false} className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/20" styles={{ body: { padding: '20px' } }}>
          <Text className="text-muted-foreground text-xs font-bold uppercase tracking-wider block mb-2">{t('moyka')}</Text>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/20 rounded-lg">
              <Car className="h-5 w-5 text-cyan-500" />
            </div>
            <span className="text-2xl font-bold">{stats.moyka}</span>
          </div>
        </Card>
        <Card bordered={false} className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20" styles={{ body: { padding: '20px' } }}>
          <Text className="text-muted-foreground text-xs font-bold uppercase tracking-wider block mb-2">{t('zapravka')}</Text>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Fuel className="h-5 w-5 text-orange-500" />
            </div>
            <span className="text-2xl font-bold">{stats.zapravka}</span>
          </div>
        </Card>
        <Card bordered={false} className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20" styles={{ body: { padding: '20px' } }}>
          <Text className="text-muted-foreground text-xs font-bold uppercase tracking-wider block mb-2">{t('autoService')}</Text>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Wrench className="h-5 w-5 text-purple-500" />
            </div>
            <span className="text-2xl font-bold">{stats.autoService}</span>
          </div>
        </Card>
      </div>

      <Card bordered={false} className="bg-card border border-border/20 shadow-sm overflow-hidden" styles={{ body: { padding: '16px' } }}>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Select 
              value={typeFilter} 
              onChange={setTypeFilter} 
              className="w-full sm:w-[200px]"
              size="large"
            >
              <Select.Option value="all">{t('allTypes')}</Select.Option>
              <Select.Option value="moyka">{t('moyka')}</Select.Option>
              <Select.Option value="zapravka">{t('zapravka')}</Select.Option>
              <Select.Option value="auto_service">{t('autoService')}</Select.Option>
            </Select>
          </div>
        </div>

        <DataTable
          data={filteredKiosks}
          columns={columns}
          searchPlaceholder={t('searchKioskPlaceholder')}
          renderMobileCard={renderMobileCard}
          getRowId={(k) => k.id}
        />
      </Card>

      <Modal
        title={editingKiosk ? t('editKiosk') : t('newKiosk')}
        open={isDialogOpen}
        onCancel={() => setIsDialogOpen(false)}
        onOk={handleSave}
        okButtonProps={{ disabled: !formData.name }}
        destroyOnClose
        width={600}
      >
        <div className="space-y-4 py-4">
          <div className="space-y-1">
            <Text strong className="text-xs">{t('name')}</Text>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={t('kioskNamePlaceholder')}
              size="large"
            />
          </div>
          <div className="space-y-1">
            <Text strong className="text-xs">{t('type')}</Text>
            <Select
              value={formData.type}
              onChange={(value: KioskType) => setFormData({ ...formData, type: value })}
              className="w-full"
              size="large"
            >
              <Select.Option value="moyka">{t('moyka')}</Select.Option>
              <Select.Option value="zapravka">{t('zapravka')}</Select.Option>
              <Select.Option value="auto_service">{t('autoService')}</Select.Option>
            </Select>
          </div>
          {formData.type === 'moyka' && (
            <div className="space-y-1">
              <Text strong className="text-xs">{t('boxNumbers')}</Text>
              <Input
                value={formData.boxNumbers}
                onChange={(e) => setFormData({ ...formData, boxNumbers: e.target.value })}
                placeholder="1-10"
                size="large"
              />
            </div>
          )}
          <div className="space-y-1">
            <Text strong className="text-xs">{t('address')}</Text>
            <Input
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder={t('addressPlaceholder')}
              size="large"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
