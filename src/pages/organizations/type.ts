export interface Schedule {
  weekday: number;
  is_closed: boolean;
  opens_at: string | null;
  closes_at: string | null;
}

export interface Branch {
  name: string;
  type: string;
  address: string;
  lat: number;
  lon: number;
  schedule: Schedule[];
}

export interface ApiOrganization {
  id: string;
  display_name: string;
  legal_name: string;
  tax_id: string;
  default_take_rate: number;
  status: string;
  starts_at: string;
  expires_at: string;
  branches: Branch[];
  created_at?: string;
}

export interface OrgFormData {
  display_name: string;
  legal_name: string;
  tax_id: string;
  default_take_rate: number;
  status: string;
  starts_at: string;
  expires_at: string;
  branches: Branch[];
}

export interface OrgFormProps {
  organization?: ApiOrganization | null;
  onSubmit: (data: OrgFormData) => Promise<void> | void;
  onCancel: () => void;
  loading?: boolean;
}
