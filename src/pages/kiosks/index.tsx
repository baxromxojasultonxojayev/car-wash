import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Zap,
  Fuel,
  Wrench,
  Car,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingKiosk, setEditingKiosk] = useState<Kiosk | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'moyka' as KioskType,
    boxNumbers: '',
    address: '',
  });

  const filteredKiosks = kiosks.filter((kiosk) => {
    const matchesSearch =
      kiosk.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      kiosk.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || kiosk.type === typeFilter;
    return matchesSearch && matchesType;
  });

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('kiosks')}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t('manageKiosks')}</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus size={18} />
          {t('newKiosk')}
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('total')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{stats.total}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('moyka')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Car className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold">{stats.moyka}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('zapravka')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Fuel className="h-5 w-5 text-orange-500" />
              <span className="text-2xl font-bold">{stats.zapravka}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('autoService')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-purple-500" />
              <span className="text-2xl font-bold">{stats.autoService}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('searchKioskPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allTypes')}</SelectItem>
                <SelectItem value="moyka">{t('moyka')}</SelectItem>
                <SelectItem value="zapravka">{t('zapravka')}</SelectItem>
                <SelectItem value="auto_service">{t('autoService')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('name')}</TableHead>
                <TableHead>{t('type')}</TableHead>
                <TableHead className="hidden md:table-cell">{t('address')}</TableHead>
                <TableHead className="text-right">{t('todayRevenue')}</TableHead>
                <TableHead className="text-center">{t('status')}</TableHead>
                <TableHead className="text-right">{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredKiosks.map((kiosk) => {
                const TypeIcon = typeIcons[kiosk.type];
                return (
                  <TableRow key={kiosk.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg ${typeColors[kiosk.type]} flex items-center justify-center`}>
                          <TypeIcon className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <span className="font-medium">{kiosk.name}</span>
                          {kiosk.boxNumbers && (
                            <p className="text-xs text-muted-foreground">
                              Box: {kiosk.boxNumbers}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{t(kiosk.type)}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {kiosk.address}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(kiosk.todayRevenue)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={kiosk.status === 'active' ? 'default' : 'secondary'}>
                        {kiosk.status === 'active' ? t('active') : t('inactive')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/kiosks/${kiosk.id}`)}>
                            <Eye className="mr-2 h-4 w-4" />
                            {t('view')}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(kiosk)}>
                            <Edit className="mr-2 h-4 w-4" />
                            {t('edit')}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(kiosk.id)} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t('delete')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingKiosk ? t('editKiosk') : t('newKiosk')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{t('name')}</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t('kioskNamePlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('type')}</Label>
              <Select
                value={formData.type}
                onValueChange={(value: KioskType) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="moyka">{t('moyka')}</SelectItem>
                  <SelectItem value="zapravka">{t('zapravka')}</SelectItem>
                  <SelectItem value="auto_service">{t('autoService')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.type === 'moyka' && (
              <div className="space-y-2">
                <Label>{t('boxNumbers')}</Label>
                <Input
                  value={formData.boxNumbers}
                  onChange={(e) => setFormData({ ...formData, boxNumbers: e.target.value })}
                  placeholder="1-10"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label>{t('address')}</Label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder={t('addressPlaceholder')}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={handleSave} disabled={!formData.name}>
              {t('save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
