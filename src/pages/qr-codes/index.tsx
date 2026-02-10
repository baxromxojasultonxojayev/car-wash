import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  QrCode,
  Download,
  Copy,
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
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQR, setEditingQR] = useState<QRCode | null>(null);
  const [formData, setFormData] = useState({ name: '', kioskId: '' });

  const filteredQRCodes = qrCodes.filter(
    (qr) =>
      qr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      qr.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    setEditingQR(null);
    setFormData({ name: '', kioskId: '' });
    setIsDialogOpen(true);
  };

  const handleEdit = (qr: QRCode) => {
    setEditingQR(qr);
    setFormData({ name: qr.name, kioskId: qr.kioskId });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    const kiosk = mockKiosks.find((k) => k.id === formData.kioskId);
    if (editingQR) {
      setQRCodes(
        qrCodes.map((qr) =>
          qr.id === editingQR.id
            ? { ...qr, name: formData.name, kioskId: formData.kioskId, kioskName: kiosk?.name || '' }
            : qr
        )
      );
    } else {
      const newQR: QRCode = {
        id: Date.now().toString(),
        code: `QR-${Date.now().toString().slice(-6)}`,
        name: formData.name,
        kioskId: formData.kioskId,
        kioskName: kiosk?.name || '',
        organizationName: 'Premium Car Wash',
        status: 'active',
        scansCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setQRCodes([...qrCodes, newQR]);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setQRCodes(qrCodes.filter((qr) => qr.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('qrCodes')}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t('manageQRCodes')}</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus size={18} />
          {t('newQRCode')}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('totalQRCodes')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{qrCodes.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('active')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">
                {qrCodes.filter((q) => q.status === 'active').length}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('totalScans')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold">
                {qrCodes.reduce((sum, q) => sum + q.scansCount, 0)}
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
              placeholder={t('searchQRCodePlaceholder')}
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
                <TableHead>{t('code')}</TableHead>
                <TableHead>{t('name')}</TableHead>
                <TableHead className="hidden md:table-cell">{t('kiosk')}</TableHead>
                <TableHead className="text-center">{t('scans')}</TableHead>
                <TableHead className="text-center">{t('status')}</TableHead>
                <TableHead className="text-right">{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQRCodes.map((qr) => (
                <TableRow key={qr.id}>
                  <TableCell>
                    <code className="px-2 py-1 bg-muted rounded text-sm">{qr.code}</code>
                  </TableCell>
                  <TableCell className="font-medium">{qr.name}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {qr.kioskName}
                  </TableCell>
                  <TableCell className="text-center">{qr.scansCount}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={qr.status === 'active' ? 'default' : 'secondary'}>
                      {qr.status === 'active' ? t('active') : t('inactive')}
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
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          {t('download')}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="mr-2 h-4 w-4" />
                          {t('copyCode')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(qr)}>
                          <Edit className="mr-2 h-4 w-4" />
                          {t('edit')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(qr.id)} className="text-destructive">
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
            <DialogTitle>{editingQR ? t('editQRCode') : t('newQRCode')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{t('name')}</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t('qrNamePlaceholder')}
              />
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
            <Button onClick={handleSave} disabled={!formData.name}>
              {t('save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
