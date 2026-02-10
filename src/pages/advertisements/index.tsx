import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Megaphone,
  Image,
  Video,
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
import { Switch } from '@/components/ui/switch';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'image' as 'image' | 'video',
    kioskId: '',
  });

  const filteredAds = ads.filter((ad) =>
    ad.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    setEditingAd(null);
    setFormData({ title: '', type: 'image', kioskId: '' });
    setIsDialogOpen(true);
  };

  const handleEdit = (ad: Advertisement) => {
    setEditingAd(ad);
    setFormData({
      title: ad.title,
      type: ad.type,
      kioskId: ad.kioskIds[0] || '',
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    const kiosk = mockKiosks.find((k) => k.id === formData.kioskId);
    if (editingAd) {
      setAds(
        ads.map((ad) =>
          ad.id === editingAd.id
            ? {
                ...ad,
                title: formData.title,
                type: formData.type,
                kioskIds: formData.kioskId ? [formData.kioskId] : [],
                kioskNames: kiosk ? [kiosk.name] : [],
              }
            : ad
        )
      );
    } else {
      const newAd: Advertisement = {
        id: Date.now().toString(),
        title: formData.title,
        type: formData.type,
        kioskIds: formData.kioskId ? [formData.kioskId] : [],
        kioskNames: kiosk ? [kiosk.name] : [],
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setAds([...ads, newAd]);
    }
    setIsDialogOpen(false);
  };

  const handleToggle = (id: string) => {
    setAds(ads.map((ad) => (ad.id === id ? { ...ad, isActive: !ad.isActive } : ad)));
  };

  const handleDelete = (id: string) => {
    setAds(ads.filter((ad) => ad.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('advertisements')}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t('manageAdvertisements')}</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus size={18} />
          {t('newAdvertisement')}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('total')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{ads.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('active')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">{ads.filter((a) => a.isActive).length}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('videos')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Video className="h-5 w-5 text-purple-500" />
              <span className="text-2xl font-bold">{ads.filter((a) => a.type === 'video').length}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('searchAdvertisementPlaceholder')}
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
                <TableHead>{t('title')}</TableHead>
                <TableHead>{t('type')}</TableHead>
                <TableHead className="hidden md:table-cell">{t('kiosks')}</TableHead>
                <TableHead className="text-center">{t('status')}</TableHead>
                <TableHead className="text-right">{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAds.map((ad) => (
                <TableRow key={ad.id}>
                  <TableCell className="font-medium">{ad.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {ad.type === 'image' ? (
                        <Image className="h-4 w-4 text-blue-500" />
                      ) : (
                        <Video className="h-4 w-4 text-purple-500" />
                      )}
                      <Badge variant="outline">{ad.type === 'image' ? t('image') : t('video')}</Badge>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {ad.kioskNames.map((name, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {name}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch checked={ad.isActive} onCheckedChange={() => handleToggle(ad.id)} />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(ad)}>
                          <Edit className="mr-2 h-4 w-4" />
                          {t('edit')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(ad.id)} className="text-destructive">
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
            <DialogTitle>{editingAd ? t('editAdvertisement') : t('newAdvertisement')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{t('title')}</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('type')}</Label>
              <Select
                value={formData.type}
                onValueChange={(value: 'image' | 'video') => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">{t('image')}</SelectItem>
                  <SelectItem value="video">{t('video')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t('kiosk')}</Label>
              <Select
                value={formData.kioskId}
                onValueChange={(value) => setFormData({ ...formData, kioskId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('selectKiosk')} />
                </SelectTrigger>
                <SelectContent>
                  {mockKiosks.map((kiosk) => (
                    <SelectItem key={kiosk.id} value={kiosk.id}>
                      {kiosk.name}
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
            <Button onClick={handleSave} disabled={!formData.title}>
              {t('save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
