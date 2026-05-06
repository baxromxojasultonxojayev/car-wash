import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Plus,
  Edit,
  Trash2,
  User,
  Building2,
  Key,
} from 'lucide-react';
import { Button, Card, Space, Typography, Tag } from 'antd';
import DataTable, { Column } from '@/components/Table/DataTable';
import { crud } from '@/lib/api';
import { toast } from 'sonner';
import type { ApiAccount, AccountFormData } from './type';
import type { ApiOrganization } from '../organizations/type';
import AccountModal from './components/account-modal';
import DeleteModal from './components/delete-modal';

const { Title, Text } = Typography;

const API_PATH = '/super/accounts/admins';

export default function AccountsPage() {
  const { t } = useTranslation();

  const [accounts, setAccounts] = useState<ApiAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<ApiAccount | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<ApiAccount | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await crud.getAll<any>(API_PATH);
      console.log('Admins API Response:', response);

      // Handle different response structures (list directly or { data: [] })
      let accountsData = [];
      if (Array.isArray(response)) {
        accountsData = response;
      } else if (response && Array.isArray(response.data)) {
        accountsData = response.data;
      } else if (response && Array.isArray(response.items)) {
        accountsData = response.items;
      } else if (response && typeof response === 'object') {
        // If it's a single object or something else, wrap it if it looks like an account
        accountsData = response.id ? [response] : [];
      }

      setAccounts(accountsData);
    } catch (err: any) {
      setError(err?.message || t('fetchError'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreate = () => {
    setEditingAccount(null);
    setIsModalOpen(true);
  };

  const handleEdit = (account: ApiAccount) => {
    setEditingAccount(account);
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData: AccountFormData) => {
    setModalLoading(true);
    try {
      // Force static org_id as requested (using a valid UUID format)
      const payload = { ...formData, org_id: '00000000-0000-0000-0000-000000000000' };

      if (editingAccount) {
        // PATCH /api/v1/super/accounts/admins/{id}
        await crud.patch(API_PATH, editingAccount.id, payload);
        toast.success(t('updateSuccess'));
      } else {
        // POST /api/v1/super/accounts/admins
        await crud.create(API_PATH, payload);
        toast.success(t('createSuccess'));
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      toast.error(err?.message || t('saveError'));
      throw err; // Re-throw to prevent modal from resetting/closing
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await crud.remove(API_PATH, deleteTarget.id);
      toast.success(t('deleteSuccess'));
      setDeleteTarget(null);
      fetchData();
    } catch (err: any) {
      toast.error(err?.message || t('deleteError'));
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns: Column<ApiAccount>[] = [
    {
      key: 'login',
      header: t('username'),
      searchable: true,
      render: (val) => <Text strong className="text-foreground">{val}</Text>
    },
    {
      key: 'org_id',
      header: t('organization'),
      searchable: false,
      render: (val, row) => {
        const orgName = row.organization?.display_name || val;
        return <Tag color="blue" className="rounded-full border-none px-3">{orgName}</Tag>;
      }
    },
    {
      key: 'created_at',
      header: t('date'),
      hideOnMobile: true,
      render: (val) => <Text className="text-muted-foreground">{val ? new Date(val).toLocaleDateString() : '-'}</Text>
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
            className="text-blue-500 hover:bg-blue-500/10"
          />
          <Button
            type="text"
            icon={<Trash2 size={16} />}
            onClick={() => setDeleteTarget(row)}
            className="text-red-500 hover:bg-red-500/10"
          />
        </Space>
      )
    }
  ];

  const renderMobileCard = (account: ApiAccount) => {
    const orgName = account.organization?.display_name || account.org_id;
    return (
      <Card bordered={false} className="bg-card border border-border/20 shadow-sm" styles={{ body: { padding: '16px' } }}>
        <div className="flex items-start justify-between mb-3">
          <div className="min-w-0 flex-1">
            <Text strong className="block truncate text-base text-foreground">{account.login}</Text>
            <Text className="text-xs text-muted-foreground block truncate">{orgName}</Text>
          </div>
          <Tag color="blue" className="rounded-full border-none mr-0 text-[10px]">
            {t('admin')}
          </Tag>
        </div>
        <div className="flex gap-2 pt-3 border-t border-border/10">
          <Button
            className="flex-1 h-9 flex items-center justify-center gap-2"
            icon={<Edit size={14} />}
            onClick={() => handleEdit(account)}
          >
            {t('edit')}
          </Button>
          <Button
            danger
            className="flex-1 h-9 flex items-center justify-center gap-2"
            icon={<Trash2 size={14} />}
            onClick={() => setDeleteTarget(account)}
          >
            {t('delete')}
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Title level={2} className="!mb-0 !text-foreground">{t('accounts')}</Title>
          <Text className="text-muted-foreground">{t('manageAccounts')}</Text>
        </div>
        <Button
          type="primary"
          icon={<Plus size={18} />}
          onClick={handleCreate}
          size="large"
          className="bg-blue-600 hover:bg-blue-700 h-11 flex items-center gap-2"
        >
          {t('newAccount')}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card bordered={false} className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 shadow-sm" styles={{ body: { padding: '20px' } }}>
          <Text className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider block mb-2">{t('total')}</Text>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <User className="h-5 w-5 text-blue-500" />
            </div>
            <span className="text-2xl font-bold text-foreground">{accounts.length}</span>
          </div>
        </Card>
        <Card bordered={false} className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 shadow-sm" styles={{ body: { padding: '20px' } }}>
          <Text className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider block mb-2">{t('organizations')}</Text>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Building2 className="h-5 w-5 text-purple-500" />
            </div>
            <span className="text-2xl font-bold text-foreground">
              {new Set(accounts.map((a) => a.org_id)).size}
            </span>
          </div>
        </Card>
        <Card bordered={false} className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20 shadow-sm" styles={{ body: { padding: '20px' } }}>
          <Text className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider block mb-2">{t('role')}</Text>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <Key className="h-5 w-5 text-amber-500" />
            </div>
            <span className="text-2xl font-bold text-foreground">{t('admin')}</span>
          </div>
        </Card>
      </div>

      <DataTable
        data={accounts}
        columns={columns}
        loading={loading}
        error={error}
        onRetry={fetchData}
        searchPlaceholder={t('searchAccountPlaceholder')}
        renderMobileCard={renderMobileCard}
        getRowId={(a) => a.id}
        emptyMessage={t('noAccountsFound') || 'No accounts found'}
      />

      <AccountModal
        isOpen={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        loading={modalLoading}
        editingAccount={editingAccount}
      />

      <DeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
        itemName={deleteTarget?.login}
      />
    </div>
  );
}
