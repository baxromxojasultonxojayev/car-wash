
export interface ApiAccount {
  id: string;
  login: string;
  org_id: string;
  organization?: {
    id: string;
    display_name: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface AccountFormData {
  login: string;
  password?: string;
  org_id: string;
}
