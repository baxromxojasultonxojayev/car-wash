import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Plus,
  Search,
  MoreHorizontal,
  Building2,
  Edit,
  Trash2,
  Eye,
  Zap,
  Users,
  Car,
  Fuel,
  Wrench,
  Star,
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
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

export type OrgType = 'moyka' | 'zapravka' | 'auto_service';

export interface Organization {
  id: string;
  name: string;
  type: OrgType;
  is_main: boolean;
  kiosksCount: number;
  usersCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

// Mock data
const mockOrganizations: Organization[] = [
  {
    id: '1',
    name: 'Premium Car Wash',
    type: 'moyka',
    is_main: true,
    kiosksCount: 12,
    usersCount: 25,
    status: 'active',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Express Wash',
    type: 'moyka',
    is_main: false,
    kiosksCount: 8,
    usersCount: 15,
    status: 'active',
    createdAt: '2024-02-20',
  },
  {
    id: '3',
    name: 'Toshkent Zapravka',
    type: 'zapravka',
    is_main: false,
    kiosksCount: 5,
    usersCount: 10,
    status: 'active',
    createdAt: '2024-03-10',
  },
  {
    id: '4',
    name: 'Auto Service Pro',
    type: 'auto_service',
    is_main: false,
    kiosksCount: 3,
    usersCount: 8,
    status: 'inactive',
    createdAt: '2024-04-05',
  },
];

const orgTypeLabels: Record<OrgType, string> = {
  moyka: 'Moyka',
  zapravka: 'Zapravka',
  auto_service: 'Auto Service',
};

const orgTypeIcons: Record<OrgType, typeof Car> = {
  moyka: Car,
  zapravka: Fuel,
  auto_service: Wrench,
};

const orgTypeColors: Record<OrgType, string> = {
  moyka: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
  zapravka: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
  auto_service: 'bg-purple-500/10 text-purple-500 border-purple-500/30',
};

export default function OrganizationsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState<Organization[]>(mockOrganizations);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'moyka' as OrgType,
    is_main: false,
  });

  const filteredOrganizations = organizations.filter(
    (org) =>
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      orgTypeLabels[org.type].toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    setEditingOrg(null);
    setFormData({ name: '', type: 'moyka', is_main: false });
    setIsDialogOpen(true);
  };

  const handleEdit = (org: Organization) => {
    setEditingOrg(org);
    setFormData({ name: org.name, type: org.type, is_main: org.is_main });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingOrg) {
      setOrganizations(
        organizations.map((org) =>
          org.id === editingOrg.id
            ? { ...org, name: formData.name, type: formData.type, is_main: formData.type === 'moyka' ? formData.is_main : false }
            : org
        )
      );
    } else {
      const newOrg: Organization = {
        id: Date.now().toString(),
        name: formData.name,
        type: formData.type,
        is_main: formData.type === 'moyka' ? formData.is_main : false,
        kiosksCount: 0,
        usersCount: 0,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setOrganizations([...organizations, newOrg]);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setOrganizations(organizations.filter((org) => org.id !== id));
  };

  const stats = {
    total: organizations.length,
    active: organizations.filter((o) => o.status === 'active').length,
    totalKiosks: organizations.reduce((sum, o) => sum + o.kiosksCount, 0),
    totalUsers: organizations.reduce((sum, o) => sum + o.usersCount, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('organizations')}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {t('manageOrganizations')}
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus size={18} />
          {t('newOrganization')}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('total')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{stats.total}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('active')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">{stats.active}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('totalKiosks')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold">{stats.totalKiosks}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('totalUsers')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-500" />
              <span className="text-2xl font-bold">{stats.totalUsers}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('searchOrganizationPlaceholder')}
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
                <TableHead>{t('type')}</TableHead>
                <TableHead className="text-center">{t('kiosks')}</TableHead>
                <TableHead className="text-center">{t('users')}</TableHead>
                <TableHead className="text-center">{t('status')}</TableHead>
                <TableHead className="text-right">{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrganizations.map((org) => {
                const TypeIcon = orgTypeIcons[org.type];
                return (
                  <TableRow key={org.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {org.name}
                        {org.is_main && (
                          <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={orgTypeColors[org.type]}>
                        <TypeIcon className="h-3 w-3 mr-1" />
                        {orgTypeLabels[org.type]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">{org.kiosksCount}</TableCell>
                    <TableCell className="text-center">{org.usersCount}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={org.status === 'active' ? 'default' : 'secondary'}>
                        {org.status === 'active' ? t('active') : t('inactive')}
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
                          <DropdownMenuItem onClick={() => navigate(`/organizations/${org.id}`)}>
                            <Eye className="mr-2 h-4 w-4" />
                            {t('view')}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(org)}>
                            <Edit className="mr-2 h-4 w-4" />
                            {t('edit')}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(org.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t('delete')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredOrganizations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    {t('noOrganizationsFound')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingOrg ? t('editOrganization') : t('newOrganization')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-4">
            {/* Organization Name */}
            <div className="space-y-2">
              <Label htmlFor="name">{t('name')}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t('enterOrgName')}
              />
            </div>

            {/* Organization Type Select */}
            <div className="space-y-2">
              <Label>{t('orgType')}</Label>
              <Select
                value={formData.type}
                onValueChange={(value: OrgType) => setFormData({ ...formData, type: value, is_main: value !== 'moyka' ? false : formData.is_main })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('selectType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="moyka">
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4 text-blue-500" />
                      <span>Moyka</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="zapravka">
                    <div className="flex items-center gap-2">
                      <Fuel className="h-4 w-4 text-amber-500" />
                      <span>Zapravka</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="auto_service">
                    <div className="flex items-center gap-2">
                      <Wrench className="h-4 w-4 text-purple-500" />
                      <span>Auto Service</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* is_main Switch - only for Moyka */}
            {formData.type === 'moyka' && (
              <div className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/30 px-4 py-3">
                <div className="space-y-0.5">
                  <Label htmlFor="is_main" className="text-sm font-medium cursor-pointer">
                    {t('mainWash')}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {t('mainWashDescription')}
                  </p>
                </div>
                <Switch
                  id="is_main"
                  checked={formData.is_main}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_main: checked })}
                />
              </div>
            )}
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
