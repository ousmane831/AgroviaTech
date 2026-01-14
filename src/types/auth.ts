export type UserRole = 'ADMIN' | 'AGRICULTEUR' | 'VISITEUR';

export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: UserRole;
  telephone?: string;
  adresse?: string;
  region?: string;
  est_actif: boolean;
  dernier_login?: string;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  telephone?: string;
  region?: string;
  role: 'AGRICULTEUR' | 'VISITEUR'; // Pas d'inscription admin directe
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export interface RoutePermissions {
  ADMIN: string[];
  AGRICULTEUR: string[];
  VISITEUR: string[];
}

export const ROLE_PERMISSIONS: RoutePermissions = {
  ADMIN: [
    '/admin/dashboard',
    '/admin/users',
    '/admin/parcels',
    '/admin/statistics',
    '/admin/news',
    '/admin/settings',
    '/admin/demandes-agriculteurs'
  ],
  AGRICULTEUR: [
    '/agriculteur/dashboard',
    '/agriculteur/parcels',
    '/agriculteur/harvests',
    '/agriculteur/alerts',
    '/agriculteur/statistics',
    '/agriculteur/profile',
    '/agriculteur/settings'
  ],
  VISITEUR: [
    '/visitor/dashboard',
    '/visitor/actualites',
    '/visitor/apprendre',
    '/visitor/carte',
    '/visitor/demo-ia'
  ]
};

export const ROLE_REDIRECTS: Record<UserRole, string> = {
  ADMIN: '/admin/dashboard',
  AGRICULTEUR: '/agriculteur/dashboard', 
  VISITEUR: '/visitor/dashboard'
};

export const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/forgot-password'
];

export const canAccessRoute = (userRole: UserRole, route: string): boolean => {
  return ROLE_PERMISSIONS[userRole].some(permission => 
    route.startsWith(permission)
  );
};

// Types pour les demandes d'agriculteur
export type AgriculteurRequestStatus = 'pending' | 'approved' | 'rejected';

export interface AgriculteurRequest {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  location: string;
  phone: string;
  experience: string;
  culture_type: string;
  justification: string;
  status: AgriculteurRequestStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateAgriculteurRequestData {
  first_name: string;
  last_name: string;
  location: string;
  phone: string;
  experience: string;
  culture_type: string;
  justification: string;
}
