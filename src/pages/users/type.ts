export interface ApiUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  is_super: boolean;
  status?: boolean;
  created_at?: string;
}

export interface UserFormData {
  name: string;
  phone: string;
  email: string;
  is_super: boolean;
  password?: string;
}

export interface UserFormProps {
  user?: ApiUser | null;
  onSubmit: (data: UserFormData) => Promise<void> | void;
  onCancel: () => void;
  loading?: boolean;
}
