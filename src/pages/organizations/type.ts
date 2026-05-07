export interface OrganizationLogo {
  filename: string;
  content_type: string;
  size: number;
}

export interface ApiOrganization {
  id: string;
  display_name: string;
  description: string;
  legal_name: string;
  phone: string;
  email: string;
  address: string;
  opening_time: string;
  closing_time: string;
  inn: string;
  bank_account_number: string;
  mfo: string;
  oked: string;
  logo?: OrganizationLogo | null;
  status: 'active' | 'deactivated' | 'deleted';
  created_at?: string;
  updated_at?: string;
}

export interface OrgFormData {
  display_name: string;
  description: string;
  legal_name: string;
  phone: string;
  email: string;
  address: string;
  opening_time: string;
  closing_time: string;
  inn: string;
  bank_account_number: string;
  mfo: string;
  oked: string;
  logo?: OrganizationLogo | null;
}

export interface OrgFormProps {
  organization?: ApiOrganization | null;
  onSubmit: (data: OrgFormData) => Promise<void> | void;
  onCancel: () => void;
  loading?: boolean;
}
