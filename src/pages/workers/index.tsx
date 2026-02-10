import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  UserCheck,
  Briefcase,
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
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    kioskId: '',
    phone: '',
  });

  const filteredWorkers = workers.filter(
    (w) =>
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    setEditingWorker(null);
    setFormData({ name: '', position: '', kioskId: '', phone: '' });
    setIsDialogOpen(true);
  };

  const handleEdit = (worker: Worker) => {
    setEditingWorker(worker);
    setFormData({
      name: worker.name,
      position: worker.position,
      kioskId: worker.kioskId,
      phone: worker.phone,
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    const kiosk = mockKiosks.find((k) => k.id === formData.kioskId);
    if (editingWorker) {
      setWorkers(
        workers.map((w) =>
          w.id === editingWorker.id
            ? {
                ...w,
                name: formData.name,
                position: formData.position,
                kioskId: formData.kioskId,
                kioskName: kiosk?.name || '',
                phone: formData.phone,
              }
            : w
        )
      );
    } else {
      const newWorker: Worker = {
        id: Date.now().toString(),
        name: formData.name,
        position: formData.position,
        kioskId: formData.kioskId,
        kioskName: kiosk?.name || '',
        phone: formData.phone,
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setWorkers([...workers, newWorker]);
    }
    setIsDialogOpen(false);
  };

  const handleToggle = (id: string) => {
    setWorkers(workers.map((w) => (w.id === id ? { ...w, isActive: !w.isActive } : w)));
  };

  const handleDelete = (id: string) => {
    setWorkers(workers.filter((w) => w.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('workers')}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t('manageWorkers')}</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus size={18} />
          {t('newWorker')}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('total')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{workers.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('active')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">{workers.filter((w) => w.isActive).length}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('positions')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold">{new Set(workers.map((w) => w.position)).size}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('searchWorkerPlaceholder')}
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
                <TableHead>{t('position')}</TableHead>
                <TableHead className="hidden md:table-cell">{t('kiosk')}</TableHead>
                <TableHead className="hidden md:table-cell">{t('phone')}</TableHead>
                <TableHead className="text-center">{t('status')}</TableHead>
                <TableHead className="text-right">{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorkers.map((worker) => (
                <TableRow key={worker.id}>
                  <TableCell className="font-medium">{worker.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{worker.position}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {worker.kioskName}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {worker.phone}
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch checked={worker.isActive} onCheckedChange={() => handleToggle(worker.id)} />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(worker)}>
                          <Edit className="mr-2 h-4 w-4" />
                          {t('edit')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(worker.id)} className="text-destructive">
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
            <DialogTitle>{editingWorker ? t('editWorker') : t('newWorker')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{t('name')}</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t('workerNamePlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('position')}</Label>
              <Select
                value={formData.position}
                onValueChange={(value) => setFormData({ ...formData, position: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('selectPosition')} />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((pos) => (
                    <SelectItem key={pos} value={pos}>
                      {pos}
                    </SelectItem>
                  ))}
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
            <div className="space-y-2">
              <Label>{t('phone')}</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+998 90 123 45 67"
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
