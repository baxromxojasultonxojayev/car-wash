import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export type UserRole = 'super_admin' | 'client_admin';

interface User {
  id: string;
  phone: string;
  name: string;
  role: UserRole;
  organizationId?: string;
  organizationName?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (phone: string, password: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Super Admin phone number - only this number gets super_admin role
const SUPER_ADMIN_PHONE = '998973307424';

// Normalize phone number - keep only digits
function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

// Synchronously get initial user from localStorage
function getInitialUser(): User | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      return JSON.parse(savedUser);
    }
  } catch {
    localStorage.removeItem('auth_user');
  }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getInitialUser());

  const login = useCallback(async (phone: string, password: string): Promise<User> => {
    const normalizedPhone = normalizePhone(phone);
    
    // Validate phone number
    if (!normalizedPhone || normalizedPhone.length < 9) {
      throw new Error('Telefon raqamni to\'g\'ri kiriting');
    }
    
    // Validate password
    if (!password || password.length < 1) {
      throw new Error('Parolni kiriting');
    }
    
    // Determine role based on phone number
    const isSuperAdmin = normalizedPhone === SUPER_ADMIN_PHONE;
    
    const newUser: User = {
      id: isSuperAdmin ? '1' : 'client-' + Date.now(),
      phone: normalizedPhone,
      name: isSuperAdmin ? 'Super Admin' : 'Client Admin',
      role: isSuperAdmin ? 'super_admin' : 'client_admin',
      ...(isSuperAdmin ? {} : {
        organizationId: 'org-' + Date.now(),
        organizationName: 'Demo Organization',
      }),
    };
    
    // Save to localStorage first
    localStorage.setItem('auth_user', JSON.stringify(newUser));
    // Then update state
    setUser(newUser);
    return newUser;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_user');
    localStorage.removeItem('access_token');
    setUser(null);
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
