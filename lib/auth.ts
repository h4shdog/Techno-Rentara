// Mock authentication system
export type UserRole = 'renter' | 'provider';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone: string;
  avatar: string;
}

export interface AuthContext {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Demo accounts
export const DEMO_ACCOUNTS = {
  renter: {
    email: 'renter@rentara.com',
    password: 'password123',
    user: {
      id: 'renter-001',
      email: 'renter@rentara.com',
      name: 'John Renter',
      role: 'renter' as UserRole,
      phone: '+63 9XX XXX 0001',
      avatar: 'JR',
    },
  },
  provider: {
    email: 'provider@rentara.com',
    password: 'password123',
    user: {
      id: 'provider-001',
      email: 'provider@rentara.com',
      name: 'Maria Provider',
      role: 'provider' as UserRole,
      phone: '+63 9XX XXX 0002',
      avatar: 'MP',
    },
  },
};

export const validateLogin = (email: string, password: string): User | null => {
  // Check renter account
  if (email === DEMO_ACCOUNTS.renter.email && password === DEMO_ACCOUNTS.renter.password) {
    return DEMO_ACCOUNTS.renter.user;
  }
  // Check provider account
  if (email === DEMO_ACCOUNTS.provider.email && password === DEMO_ACCOUNTS.provider.password) {
    return DEMO_ACCOUNTS.provider.user;
  }
  return null;
};

export const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('rentara_user');
  return stored ? JSON.parse(stored) : null;
};

export const setStoredUser = (user: User) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('rentara_user', JSON.stringify(user));
};

export const clearStoredUser = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('rentara_user');
};
