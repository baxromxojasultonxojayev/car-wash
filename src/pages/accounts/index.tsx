import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Plus,
  Edit,
  Trash2,
  User,
  Building2,
  Key,
} from 'lucide-react';
import { Button, Card, Input, Select, Tag, Modal, Space, Typography, Form } from 'antd';
import DataTable, { Column } from '@/components/Table/DataTable';

const { Title, Text } = Typography;

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
  moyka: 'blue',
  zapravka: 'orange',
  auto_service: 'purple',
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [form] = Form.useForm();

  const handleCreate = () => {
    setEditingAccount(null);
    form.resetFields();
    setIsDialogOpen(true);
  };

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    form.setFieldsValue({
      username: account.username,
      email: account.email,
      password: '',
      organizationIds: account.organizationIds,
      role: account.role,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (editingAccount) {
        setAccounts(
          accounts.map((acc) =>
            acc.id === editingAccount.id
              ? {
                  ...acc,
                  username: values.username,
                  email: values.email,
                  organizationIds: values.organizationIds,
                  role: values.role,
                }
              : acc
          )
        );
      } else {
        const newAccount: Account = {
          id: Date.now().toString(),
          username: values.username,
          email: values.email,
          organizationIds: values.organizationIds,
          role: values.role,
          status: 'active',
          createdAt: new Date().toISOString().split('T')[0],
        };
        setAccounts([...accounts, newAccount]);
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  const handleDelete = (id: string) => {
    setAccounts(accounts.filter((acc) => acc.id !== id));
  };

  const getOrgNames = (orgIds: string[]) => {
    return orgIds
      .map((id) => availableOrganizations.find((o) => o.id === id))
      .filter(Boolean) as OrgOption[];
  };

  const columns: Column<Account>[] = [
    {
      key: 'username',
      header: t('username'),
      searchable: true,
      render: (val) => <Text strong>{val}</Text>
    },
    {
      key: 'email',
      header: t('email'),
      searchable: true,
      render: (val) => <Text className="text-muted-foreground">{val}</Text>
    },
    {
      key: 'organizationIds',
      header: t('organizations'),
      hideOnMobile: true,
      render: (val: string[]) => {
        const orgs = getOrgNames(val);
        return (
          <Space size={[4, 4]} wrap>
            {orgs.map((org) => (
              <Tag
                key={org.id}
                color={orgTypeBadgeColors[org.type]}
                className="rounded-full border-none px-3"
              >
                {org.name}
              </Tag>
            ))}
          </Space>
        );
      }
    },
    {
      key: 'role',
      header: t('role'),
      align: 'center',
      render: (val) => (
        <Tag className="rounded-full border-none px-3">
          {val === 'client_admin' ? t('clientAdmin') : t('manager')}
        </Tag>
      )
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
            icon={<Edit size={16} />}
            onClick={() => handleEdit(row)}
            className="text-blue-500"
          />
          <Button
            type="text"
            icon={<Key size={16} />}
            className="text-amber-500"
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

  const renderMobileCard = (account: Account) => {
    const orgs = getOrgNames(account.organizationIds);
    return (
      <Card bordered={false} className="bg-card border border-border/20 shadow-sm" styles={{ body: { padding: '16px' } }}>
        <div className="flex items-start justify-between mb-3">
          <div className="min-w-0 flex-1">
            <Text strong className="block truncate text-base">{account.username}</Text>
            <Text className="text-xs text-muted-foreground">{account.email}</Text>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Tag color={account.status === 'active' ? 'success' : 'default'} className="rounded-full border-none mr-0">
              {account.status === 'active' ? t('active') : t('inactive')}
            </Tag>
            <Tag className="rounded-full border-none mr-0">
              {account.role === 'client_admin' ? t('admin') : t('manager')}
            </Tag>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mb-4">
          {orgs.map(org => (
            <Tag key={org.id} color={orgTypeBadgeColors[org.type]} className="text-[10px] rounded-full px-2 border-none">
              {org.name}
            </Tag>
          ))}
        </div>
        <div className="flex gap-2 pt-2 border-t border-border/10">
          <Button className="flex-1" icon={<Edit size={16} />} onClick={() => handleEdit(account)}>
            {t('edit')}
          </Button>
          <Button danger className="flex-1" icon={<Trash2 size={16} />} onClick={() => handleDelete(account.id)}>
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
          className="bg-blue-600 hover:bg-blue-700 h-11"
        >
          {t('newAccount')}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card bordered={false} className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20" styles={{ body: { padding: '20px' } }}>
          <Text className="text-muted-foreground text-xs font-bold uppercase tracking-wider block mb-2">{t('total')}</Text>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <User className="h-5 w-5 text-blue-500" />
            </div>
            <span className="text-2xl font-bold">{accounts.length}</span>
          </div>
        </Card>
        <Card bordered={false} className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20" styles={{ body: { padding: '20px' } }}>
          <Text className="text-muted-foreground text-xs font-bold uppercase tracking-wider block mb-2">{t('active')}</Text>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <User className="h-5 w-5 text-green-500" />
            </div>
            <span className="text-2xl font-bold">
              {accounts.filter((a) => a.status === 'active').length}
            </span>
          </div>
        </Card>
        <Card bordered={false} className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20" styles={{ body: { padding: '20px' } }}>
          <Text className="text-muted-foreground text-xs font-bold uppercase tracking-wider block mb-2">{t('organizations')}</Text>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Building2 className="h-5 w-5 text-purple-500" />
            </div>
            <span className="text-2xl font-bold">
              {new Set(accounts.flatMap((a) => a.organizationIds)).size}
            </span>
          </div>
        </Card>
      </div>

      <Card bordered={false} className="bg-card border border-border/20 shadow-sm overflow-hidden" styles={{ body: { padding: '16px' } }}>
        <DataTable
          data={accounts}
          columns={columns}
          searchPlaceholder={t('searchAccountPlaceholder')}
          renderMobileCard={renderMobileCard}
          getRowId={(a) => a.id}
        />
      </Card>

      <Modal
        title={editingAccount ? t('editAccount') : t('newAccount')}
        open={isDialogOpen}
        onCancel={() => setIsDialogOpen(false)}
        onOk={handleSave}
        destroyOnClose
        width={600}
        okButtonProps={{ size: 'large' }}
        cancelButtonProps={{ size: 'large' }}
      >
        <Form
          form={form}
          layout="vertical"
          className="py-4"
          requiredMark={false}
        >
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="username"
              label={t('username')}
              rules={[{ required: true, message: t('enterUsername') }]}
            >
              <Input placeholder={t('enterUsername')} size="large" />
            </Form.Item>
            <Form.Item
              name="email"
              label={t('email')}
              rules={[
                { required: true, message: t('enterEmail') },
                { type: 'email', message: t('enterEmail') }
              ]}
            >
              <Input placeholder={t('enterEmail')} size="large" />
            </Form.Item>
          </div>

          <Form.Item
            name="password"
            label={t('password')}
          >
            <Input.Password 
              placeholder={editingAccount ? t('leaveBlankToKeep') : t('enterPassword')} 
              size="large" 
            />
          </Form.Item>

          <Form.Item
            name="organizationIds"
            label={t('organizations')}
            rules={[{ required: true, message: t('selectOrganizations') }]}
          >
            <Select
              mode="multiple"
              placeholder={t('selectOrganizations')}
              size="large"
              style={{ width: '100%' }}
              optionFilterProp="children"
            >
              {availableOrganizations.map((org) => (
                <Select.Option key={org.id} value={org.id}>
                  <Space>
                    <span>{org.name}</span>
                    <Tag color={orgTypeBadgeColors[org.type]} className="text-[10px] py-0 border-none mr-0">
                      {org.type}
                    </Tag>
                  </Space>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="role"
            label={t('role')}
            initialValue="client_admin"
          >
            <Select size="large">
              <Select.Option value="client_admin">{t('clientAdmin')}</Select.Option>
              <Select.Option value="manager">{t('manager')}</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
