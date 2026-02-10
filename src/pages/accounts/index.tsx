import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  User,
  Building2,
  Key,
  X,
  Check,
  ChevronsUpDown,
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

// Organization data (shared with organizations page)
interface OrgOption {
  id: string;
  name: string;
  type: 'moyka' | 'zapravka' | 'auto_service';
}

const availableOrganizations: OrgOption[] = [
  { id: '1', name: 'Premium Car Wash', type: 'moyka' },
  { id: '2', name: 'Express Wash', type: 'moyka' },
  { id: '3', name: 'Toshkent Zapravka', type: 'zapravka' },
  { id: '4', name: 'Auto Service Pro', type: 'auto_service' },
];

const orgTypeBadgeColors: Record<string, string> = {
  moyka: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
  zapravka: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
  auto_service: 'bg-purple-500/10 text-purple-500 border-purple-500/30',
};

const orgTypeLabels: Record<string, string> = {
  moyka: 'Moyka',
  zapravka: 'Zapravka',
  auto_service: 'Auto Service',
};

interface Account {
  id: string;
  username: string;
  email: string;
  organizationIds: string[];
  role: 'client_admin' | 'manager';
  status: 'active' | 'inactive';
  createdAt: string;
}

const mockAccounts: Account[] = [
  {
    id: '1',
    username: 'admin1',
    email: 'admin@premiumwash.uz',
    organizationIds: ['1', '3'],
    role: 'client_admin',
    status: 'active',
    createdAt: '2024-01-20',
  },
  {
    id: '2',
    username: 'manager1',
    email: 'manager@expresswash.uz',
    organizationIds: ['2'],
    role: 'manager',
    status: 'active',
    createdAt: '2024-02-15',
  },
];

export default function AccountsPage() {
  const { t } = useTranslation();
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    organizationIds: [] as string[],
    role: 'client_admin' as 'client_admin' | 'manager',
  });

  const filteredAccounts = accounts.filter(
    (acc) =>
      acc.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    setEditingAccount(null);
    setFormData({ username: '', email: '', password: '', organizationIds: [], role: 'client_admin' });
    setIsDialogOpen(true);
  };

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    setFormData({
      username: account.username,
      email: account.email,
      password: '',
      organizationIds: account.organizationIds,
      role: account.role,
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingAccount) {
      setAccounts(
        accounts.map((acc) =>
          acc.id === editingAccount.id
            ? {
                ...acc,
                username: formData.username,
                email: formData.email,
                organizationIds: formData.organizationIds,
                role: formData.role,
              }
            : acc
        )
      );
    } else {
      const newAccount: Account = {
        id: Date.now().toString(),
        username: formData.username,
        email: formData.email,
        organizationIds: formData.organizationIds,
        role: formData.role,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setAccounts([...accounts, newAccount]);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setAccounts(accounts.filter((acc) => acc.id !== id));
  };

  const toggleOrganization = (orgId: string) => {
    setFormData((prev) => ({
      ...prev,
      organizationIds: prev.organizationIds.includes(orgId)
        ? prev.organizationIds.filter((id) => id !== orgId)
        : [...prev.organizationIds, orgId],
    }));
  };

  const removeOrganization = (orgId: string) => {
    setFormData((prev) => ({
      ...prev,
      organizationIds: prev.organizationIds.filter((id) => id !== orgId),
    }));
  };

  const getOrgNames = (orgIds: string[]) => {
    return orgIds
      .map((id) => availableOrganizations.find((o) => o.id === id))
      .filter(Boolean) as OrgOption[];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('accounts')}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t('manageAccounts')}</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus size={18} />
          {t('newAccount')}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('total')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{accounts.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('active')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">
                {accounts.filter((a) => a.status === 'active').length}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('organizations')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold">
                {new Set(accounts.flatMap((a) => a.organizationIds)).size}
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
              placeholder={t('searchAccountPlaceholder')}
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
                <TableHead>{t('username')}</TableHead>
                <TableHead>{t('email')}</TableHead>
                <TableHead className="hidden md:table-cell">{t('organizations')}</TableHead>
                <TableHead className="text-center">{t('role')}</TableHead>
                <TableHead className="text-center">{t('status')}</TableHead>
                <TableHead className="text-right">{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAccounts.map((account) => {
                const orgs = getOrgNames(account.organizationIds);
                return (
                  <TableRow key={account.id}>
                    <TableCell className="font-medium">{account.username}</TableCell>
                    <TableCell>{account.email}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {orgs.map((org) => (
                          <Badge
                            key={org.id}
                            variant="outline"
                            className={`text-xs ${orgTypeBadgeColors[org.type]}`}
                          >
                            {org.name}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">
                        {account.role === 'client_admin' ? t('clientAdmin') : t('manager')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={account.status === 'active' ? 'default' : 'secondary'}>
                        {account.status === 'active' ? t('active') : t('inactive')}
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
                          <DropdownMenuItem onClick={() => handleEdit(account)}>
                            <Edit className="mr-2 h-4 w-4" />
                            {t('edit')}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Key className="mr-2 h-4 w-4" />
                            {t('resetPassword')}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(account.id)} className="text-destructive">
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
            <DialogTitle>{editingAccount ? t('editAccount') : t('newAccount')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-4">
            {/* Row 1: Username & Email side by side */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('username')}</Label>
                <Input
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder={t('enterUsername')}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('email')}</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder={t('enterEmail')}
                />
              </div>
            </div>

            {/* Row 2: Password */}
            <div className="space-y-2">
              <Label>{t('password')}</Label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder={editingAccount ? t('leaveBlankToKeep') : t('enterPassword')}
              />
            </div>

            {/* Row 3: Organizations Multi-Select */}
            <div className="space-y-2">
              <Label>{t('organizations')}</Label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsOrgDropdownOpen(!isOrgDropdownOpen)}
                  className="flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2.5 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 min-h-[42px]"
                >
                  {formData.organizationIds.length === 0 ? (
                    <span className="text-muted-foreground">{t('selectOrganizations')}</span>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {formData.organizationIds.map((orgId) => {
                        const org = availableOrganizations.find((o) => o.id === orgId);
                        if (!org) return null;
                        return (
                          <Badge
                            key={org.id}
                            variant="outline"
                            className={`text-xs gap-1 pr-1 ${orgTypeBadgeColors[org.type]}`}
                          >
                            {org.name}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeOrganization(org.id);
                              }}
                              className="ml-0.5 rounded-full p-0.5 hover:bg-foreground/10 transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        );
                      })}
                    </div>
                  )}
                  <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
                </button>

                {isOrgDropdownOpen && (
                  <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover shadow-lg animate-in fade-in-0 zoom-in-95">
                    <div className="p-1.5">
                      {availableOrganizations.map((org) => {
                        const isSelected = formData.organizationIds.includes(org.id);
                        return (
                          <button
                            key={org.id}
                            type="button"
                            onClick={() => toggleOrganization(org.id)}
                            className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors hover:bg-accent ${
                              isSelected ? 'bg-accent/50' : ''
                            }`}
                          >
                            <div
                              className={`flex h-5 w-5 items-center justify-center rounded-sm border-2 transition-all ${
                                isSelected
                                  ? 'bg-primary border-primary text-white shadow-sm shadow-primary/30'
                                  : 'border-gray-400 dark:border-gray-500 bg-white dark:bg-transparent'
                              }`}
                            >
                              {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                            </div>
                            <div className="flex items-center gap-2 flex-1">
                              <span>{org.name}</span>
                              <Badge variant="outline" className={`text-[10px] py-0 ${orgTypeBadgeColors[org.type]}`}>
                                {orgTypeLabels[org.type]}
                              </Badge>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Row 4: Role */}
            <div className="space-y-2">
              <Label>{t('role')}</Label>
              <Select
                value={formData.role}
                onValueChange={(value: 'client_admin' | 'manager') =>
                  setFormData({ ...formData, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client_admin">{t('clientAdmin')}</SelectItem>
                  <SelectItem value="manager">{t('manager')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={handleSave} disabled={!formData.username || !formData.email}>
              {t('save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
