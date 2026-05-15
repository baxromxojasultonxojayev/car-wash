export interface BranchImage {
  filename: string;
  content_type: string;
  size: number;
}

export interface ApiBranch {
  id: string;
  org_id: string;
  name: string;
  address: string;
  on_demand_services: string[];
  logo?: BranchImage | null;
  gallery?: Record<string, BranchImage> | null;
  status: 'active' | 'deactivated' | 'deleted';
  created_at?: string;
  updated_at?: string;
  organization?: {
    display_name: string;
    id: string;
  };
}

export interface BranchFormData {
  org_id: string;
  name: string;
  address: string;
  on_demand_services: string[];
  logo?: BranchImage | null;
  gallery?: Record<string, BranchImage> | null;
}

export interface BranchFormProps {
  branch?: ApiBranch | null;
  organizations: Array<{ id: string; display_name: string }>;
  onSubmit: (data: BranchFormData) => Promise<void> | void;
  onCancel: () => void;
  loading?: boolean;
}
