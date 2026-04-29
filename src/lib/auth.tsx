import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { apiPost, setTokens, clearTokens, getAccessToken, getRefreshToken } from './api';

export type UserRole = 'super_admin' | 'client_admin';

interface User {
  id: string;
  phone: string;
  name: string;
  role: UserRole;
  organizationId?: string;
  organizationName?: string;
}

// API login javob turi
interface LoginResponse {
  access_token: string;
  refresh_token: string;
  // API qo'shimcha maydonlar qaytarsa shu yerga qo'shiladi
  user?: {
    id?: string;
    phone?: string;
    name?: string;
    role?: string;
    organization_id?: string;
    organization_name?: string;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (phone: string, password: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// JWT tokendan payload ni olish (base64 decode)
function parseJwt(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

// Telefon raqamni normalizatsiya qilish — faqat raqamlar
function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

// localStorage dan user olish
function getInitialUser(): User | null {
  if (typeof window === 'undefined') return null;

  try {
    // Token bor-yo'qligini tekshiramiz
    const token = getAccessToken();
    if (!token) return null;

    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      return JSON.parse(savedUser);
    }
  } catch {
    clearTokens();
  }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getInitialUser());

  const login = useCallback(async (loginValue: string, password: string): Promise<User> => {
    try {
      // Validatsiya
      if (!loginValue || loginValue.length < 1) {
        throw new Error("Loginni kiriting");
      }
      if (!password || password.length < 1) {
        throw new Error('Parolni kiriting');
      }

      // Haqiqiy API ga so'rov
      const response = await apiPost<LoginResponse>('/auth/admin/login', {
        login: loginValue,
        password,
      }, { skipAuth: true });

      // Tokenlarni saqlash
      const accessToken = response.access_token;
      const refreshToken = response.refresh_token;

      if (!accessToken || !refreshToken) {
        throw new Error('Server tokenlarni qaytarmadi');
      }

      setTokens(accessToken, refreshToken);

      // User ma'lumotlarini aniqlash
      // Foydalanuvchi aytganidek: SuperAdmin/root1234 -> super_admin
      const isSuperAdmin = loginValue === 'SuperAdmin' && password === 'root1234';
      let newUser: User;

      if (response.user && response.user.id) {
        const u = response.user;
        newUser = {
          id: String(u.id),
          phone: u.phone || loginValue,
          name: u.name || (isSuperAdmin ? 'Super Admin' : 'Admin'),
          role: isSuperAdmin ? 'super_admin' : (u.role as UserRole) || 'client_admin',
          organizationId: u.organization_id ? String(u.organization_id) : undefined,
          organizationName: u.organization_name || undefined,
        };
      } else {
        const payload = parseJwt(accessToken);
        newUser = {
          id: payload?.sub || payload?.user_id || payload?.id || '1',
          phone: payload?.phone || payload?.login || loginValue,
          name: payload?.name || payload?.username || (isSuperAdmin ? 'Super Admin' : 'Admin'),
          role: isSuperAdmin ? 'super_admin' : (payload?.role || payload?.user_role || 'client_admin') as UserRole,
          organizationId: payload?.organization_id ? String(payload.organization_id) : undefined,
          organizationName: payload?.organization_name || undefined,
        };
      }

      localStorage.setItem('auth_user', JSON.stringify(newUser));
      setUser(newUser);
      return newUser;
    } catch (error: any) {
      console.error("Login failed:", error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const refreshToken = getRefreshToken();
      // API logout endpoint'ini chaqirish, payload'da refresh_token yuboramiz
      if (refreshToken) {
        await apiPost('/auth/logout', { refresh_token: refreshToken }).catch(() => {});
      } else {
        await apiPost('/auth/logout').catch(() => {});
      }
    } finally {
      clearTokens();
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
