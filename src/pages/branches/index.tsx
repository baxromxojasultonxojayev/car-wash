import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import {
  Plus,
  Edit,
  Trash2,
  Navigation,
  Building2,
  MapPin,
} from 'lucide-react';
import { Button, Card, Space, Typography, Tag, Tooltip } from 'antd';
import DataTable, { Column } from '../../components/Table/DataTable';
import { crud } from '../../lib/api';
import { toast } from 'sonner';
import type { ApiBranch, BranchFormData } from './type';
import BranchModal from './components/branch-modal';
import DeleteModal from '../accounts/components/delete-modal';

const { Title, Text } = Typography;

const API_PATH = '/super/branches';

export default function BranchesPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const orgIdFilter = searchParams.get('org_id');

  const [branches, setBranches] = useState<ApiBranch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<ApiBranch | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<ApiBranch | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = orgIdFilter ? { org_id: orgIdFilter } : {};
      const response = await crud.getAll<any>(API_PATH, params);

      let data = [];
      if (Array.isArray(response)) data = response;
      else if (response?.data && Array.isArray(response.data)) data = response.data;
      else if (response?.items && Array.isArray(response.items)) data = response.items;

      setBranches(data);
    } catch (err: any) {
      setError(err?.message || t('fetchError'));
    } finally {
      setLoading(false);
    }
  }, [t, orgIdFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreate = () => {
    setEditingBranch(null);
    setIsModalOpen(true);
  };

  const handleEdit = (branch: ApiBranch) => {
    setEditingBranch(branch);
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData: BranchFormData) => {
    setModalLoading(true);
    try {
      if (editingBranch) {
        await crud.patch(API_PATH, editingBranch.id, formData);
        toast.success(t('updateSuccess') || "Muvaffaqiyatli yangilandi");
      } else {
        await crud.create(API_PATH, formData);
        toast.success(t('createSuccess') || "Muvaffaqiyatli yaratildi");
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      toast.error(err?.message || t('saveError'));
      throw err;
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await crud.remove(API_PATH, deleteTarget.id);
      toast.success(t('deleteSuccess') || "Muvaffaqiyatli o'chirildi");
      setDeleteTarget(null);
      fetchData();
    } catch (err: any) {
      toast.error(err?.message || t('deleteError'));
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns: Column<ApiBranch>[] = [
    {
      key: 'name',
      header: t('branchName'),
      searchable: true,
      render: (val, row) => (
        <Space direction="vertical" size={0}>
          <Text strong className="text-foreground">{val}</Text>

        </Space>
      )
    },
    {
      key: 'address',
      header: t('address'),
      searchable: true,
      render: (val) => (
        <Space size={4} className="text-muted-foreground">
          <MapPin size={14} className="text-rose-500" />
          <Text className="text-xs">{val}</Text>
        </Space>
      )
    },
    {
      key: 'on_demand_services',
      header: t('services'),
      render: (val: string[]) => (
        <Space size={[0, 4]} wrap>
          {val?.map(s => (
            <Tag key={s} color="blue" className="rounded-full border-none px-2 text-[10px]">
              {s}
            </Tag>
          ))}
        </Space>
      )
    },
    {
      key: 'actions',
      header: t('actions'),
      align: 'right',
      render: (_, row) => (
        <Space size="small">
          <Tooltip title={t('edit')}>
            <Button
              type="text"
              icon={<Edit size={16} />}
              onClick={() => handleEdit(row)}
              className="text-blue-500 hover:bg-blue-500/10"
            />
          </Tooltip>
          <Tooltip title={t('delete')}>
            <Button
              type="text"
              icon={<Trash2 size={16} />}
              onClick={() => setDeleteTarget(row)}
              className="text-red-500 hover:bg-red-500/10"
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  const renderMobileCard = (branch: ApiBranch) => (
    <Card bordered={false} className="bg-card border border-border/20 shadow-sm" styles={{ body: { padding: '16px' } }}>
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0 flex-1">
          <Text strong className="block truncate text-base text-foreground">{branch.name}</Text>
          <Text className="text-xs text-muted-foreground block truncate">
            {branch.organization?.display_name || branch.org_id}
          </Text>
        </div>
        <Tag color="blue" className="rounded-full border-none mr-0 text-[10px]">
          {branch.on_demand_services?.[0]}
        </Tag>
      </div>
      <div className="flex items-center gap-1 mb-3 text-muted-foreground">
        <MapPin size={12} />
        <Text className="text-xs truncate">{branch.address}</Text>
      </div>
      <div className="flex gap-2 pt-3 border-t border-border/10">
        <Button
          className="flex-1 h-9 flex items-center justify-center gap-2"
          icon={<Edit size={14} />}
          onClick={() => handleEdit(branch)}
        >
          {t('edit')}
        </Button>
        <Button
          danger
          className="flex-1 h-9 flex items-center justify-center gap-2"
          icon={<Trash2 size={14} />}
          onClick={() => setDeleteTarget(branch)}
        >
          {t('delete')}
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Title level={2} className="!mb-0 !text-foreground">
            {orgIdFilter ? t('organizationBranches') : t('allBranches')}
          </Title>
          <Text className="text-muted-foreground">
            {orgIdFilter ? t('manageOrgBranches') : t('manageAllBranches')}
          </Text>
        </div>
        <Button
          type="primary"
          icon={<Plus size={18} />}
          onClick={handleCreate}
          size="large"
          className="bg-blue-600 hover:bg-blue-700 h-11 flex items-center gap-2"
        >
          {t('newBranch')}
        </Button>
      </div>

      <DataTable
        data={branches}
        columns={columns}
        loading={loading}
        error={error}
        onRetry={fetchData}
        searchPlaceholder={t('searchBranchPlaceholder')}
        renderMobileCard={renderMobileCard}
        getRowId={(b) => b.id}
        emptyMessage={t('noBranchesFound')}
      />

      <BranchModal
        isOpen={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        loading={modalLoading}
        editingBranch={editingBranch}
      />

      <DeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
        itemName={deleteTarget?.name}
      />
    </div>
  );
}
