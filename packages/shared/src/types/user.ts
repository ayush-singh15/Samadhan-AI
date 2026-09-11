export enum UserRole {
  CITIZEN = 'CITIZEN',
  UNIVERSITY = 'UNIVERSITY',
  INDUSTRY = 'INDUSTRY',
  GOVERNMENT = 'GOVERNMENT',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
