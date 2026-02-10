import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Tag,
  Percent,
  Calendar,
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
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    discountType: 'percent' as 'percent' | 'fixed',
    discountValue: '',
    startDate: '',
    endDate: '',
    serviceId: '',
  });

  const filteredPromotions = promotions.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    setEditingPromo(null);
    setFormData({
      name: '',
      discountType: 'percent',
      discountValue: '',
      startDate: '',
      endDate: '',
      serviceId: '',
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (promo: Promotion) => {
    setEditingPromo(promo);
    setFormData({
      name: promo.name,
      discountType: promo.discountType,
      discountValue: promo.discountValue.toString(),
      startDate: promo.startDate,
      endDate: promo.endDate,
      serviceId: promo.serviceIds[0] || '',
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    const service = mockServices.find((s) => s.id === formData.serviceId);
    if (editingPromo) {
      setPromotions(
        promotions.map((p) =>
          p.id === editingPromo.id
            ? {
                ...p,
                name: formData.name,
                discountType: formData.discountType,
                discountValue: Number(formData.discountValue),
                startDate: formData.startDate,
                endDate: formData.endDate,
                serviceIds: formData.serviceId ? [formData.serviceId] : [],
                serviceNames: service ? [service.name] : [],
              }
            : p
        )
      );
    } else {
      const newPromo: Promotion = {
        id: Date.now().toString(),
        name: formData.name,
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        startDate: formData.startDate,
        endDate: formData.endDate,
        serviceIds: formData.serviceId ? [formData.serviceId] : [],
        serviceNames: service ? [service.name] : [],
        isActive: true,
      };
      setPromotions([...promotions, newPromo]);
    }
    setIsDialogOpen(false);
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('promotions')}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t('managePromotions')}</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus size={18} />
          {t('newPromotion')}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('total')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{promotions.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('active')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">{promotions.filter((p) => p.isActive).length}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('percentDiscounts')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Percent className="h-5 w-5 text-orange-500" />
              <span className="text-2xl font-bold">
                {promotions.filter((p) => p.discountType === 'percent').length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('searchPromotionPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('name')}</TableHead>
                <TableHead>{t('discount')}</TableHead>
                <TableHead className="hidden md:table-cell">{t('period')}</TableHead>
                <TableHead className="hidden md:table-cell">{t('services')}</TableHead>
                <TableHead className="text-center">{t('status')}</TableHead>
                <TableHead className="text-right">{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPromotions.map((promo) => (
                <TableRow key={promo.id}>
                  <TableCell className="font-medium">{promo.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="gap-1">
                      {promo.discountType === 'percent' ? <Percent className="h-3 w-3" /> : null}
                      {formatDiscount(promo)}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {promo.startDate} - {promo.endDate}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {promo.serviceNames.map((name, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {name}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={promo.isActive ? 'default' : 'secondary'}>
                      {promo.isActive ? t('active') : t('inactive')}
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
                        <DropdownMenuItem onClick={() => handleEdit(promo)}>
                          <Edit className="mr-2 h-4 w-4" />
                          {t('edit')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(promo.id)} className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          {t('delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingPromo ? t('editPromotion') : t('newPromotion')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{t('name')}</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('discountType')}</Label>
                <Select
                  value={formData.discountType}
                  onValueChange={(value: 'percent' | 'fixed') =>
                    setFormData({ ...formData, discountType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percent">{t('percentDiscount')}</SelectItem>
                    <SelectItem value="fixed">{t('fixedDiscount')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{formData.discountType === 'percent' ? '%' : 'so\'m'}</Label>
                <Input
                  type="number"
                  value={formData.discountValue}
                  onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('startDate')}</Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('endDate')}</Label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t('service')}</Label>
              <Select
                value={formData.serviceId}
                onValueChange={(value) => setFormData({ ...formData, serviceId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('selectService')} />
                </SelectTrigger>
                <SelectContent>
                  {mockServices.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
