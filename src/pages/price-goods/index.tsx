import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Plus,
  Edit,
  Trash2,
  DollarSign,
  Fuel,
  Car,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  const [serviceForm, setServiceForm] = useState({ name: '', price: '', duration: '' });
  const [oilForm, setOilForm] = useState({ type: '', price: '' });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('uz-UZ').format(value) + ' so\'m';
  };

  const handleToggleService = (id: string) => {
    setServices(services.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s)));
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setServiceForm({
      name: service.name,
      price: service.price.toString(),
      duration: service.duration.toString(),
    });
    setIsServiceDialogOpen(true);
  };

  const handleSaveService = () => {
    if (editingService) {
      setServices(
        services.map((s) =>
          s.id === editingService.id
            ? { ...s, name: serviceForm.name, price: Number(serviceForm.price), duration: Number(serviceForm.duration) }
            : s
        )
      );
    } else {
      setServices([
        ...services,
        {
          id: Date.now().toString(),
          name: serviceForm.name,
          price: Number(serviceForm.price),
          duration: Number(serviceForm.duration),
          isActive: true,
        },
      ]);
    }
    setIsServiceDialogOpen(false);
    setEditingService(null);
  };

  const handleDeleteService = (id: string) => {
    setServices(services.filter((s) => s.id !== id));
  };

  const handleEditOil = (oil: OilPrice) => {
    setEditingOil(oil);
    setOilForm({ type: oil.type, price: oil.price.toString() });
    setIsOilDialogOpen(true);
  };

  const handleSaveOil = () => {
    if (editingOil) {
      setOilPrices(
        oilPrices.map((o) =>
          o.id === editingOil.id ? { ...o, price: Number(oilForm.price) } : o
        )
      );
    }
    setIsOilDialogOpen(false);
    setEditingOil(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('priceGoods')}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t('managePrices')}</p>
      </div>

      <Tabs defaultValue="services" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="services" className="gap-2">
            <Car className="h-4 w-4" />
            {t('services')}
          </TabsTrigger>
          <TabsTrigger value="oil" className="gap-2">
            <Fuel className="h-4 w-4" />
            {t('oilPrices')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-6">
          <div className="flex justify-end">
            <Button
              onClick={() => {
                setEditingService(null);
                setServiceForm({ name: '', price: '', duration: '' });
                setIsServiceDialogOpen(true);
              }}
              className="gap-2"
            >
              <Plus size={18} />
              {t('addService')}
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('washServices')}</CardTitle>
              <CardDescription>{t('washServicesDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('serviceName')}</TableHead>
                    <TableHead className="text-right">{t('price')}</TableHead>
                    <TableHead className="text-center">{t('duration')}</TableHead>
                    <TableHead className="text-center">{t('status')}</TableHead>
                    <TableHead className="text-right">{t('actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">{service.name}</TableCell>
                      <TableCell className="text-right">{formatCurrency(service.price)}</TableCell>
                      <TableCell className="text-center">{service.duration} {t('minutes')}</TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={service.isActive}
                          onCheckedChange={() => handleToggleService(service.id)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditService(service)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteService(service.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="oil" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {oilPrices.map((oil) => (
              <Card key={oil.id} className="relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-500 to-orange-600" />
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-lg font-bold">
                      {oil.type}
                    </Badge>
                    <Button variant="ghost" size="icon" onClick={() => handleEditOil(oil)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-orange-500" />
                    <span className="text-2xl font-bold">{formatCurrency(oil.price)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{oil.kioskName}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Service Dialog */}
      <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingService ? t('editService') : t('addService')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{t('serviceName')}</Label>
              <Input
                value={serviceForm.name}
                onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('price')} (so'm)</Label>
              <Input
                type="number"
                value={serviceForm.price}
                onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('duration')} ({t('minutes')})</Label>
              <Input
                type="number"
                value={serviceForm.duration}
                onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsServiceDialogOpen(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={handleSaveService}>{t('save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Oil Dialog */}
      <Dialog open={isOilDialogOpen} onOpenChange={setIsOilDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t('editOilPrice')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{t('fuelType')}</Label>
              <Input value={oilForm.type} disabled />
            </div>
            <div className="space-y-2">
              <Label>{t('price')} (so'm)</Label>
              <Input
                type="number"
                value={oilForm.price}
                onChange={(e) => setOilForm({ ...oilForm, price: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOilDialogOpen(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={handleSaveOil}>{t('save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
