import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, UserRole, AuthState, LoginCredentials, RegisterData, AuthResponse } from '@/types/auth';
import { canAccessRoute, ROLE_REDIRECTS } from '@/types/auth';

const API_BASE_URL = 'http://localhost:8000';

const normalizeRole = (role?: string): UserRole => {
  switch ((role || '').toLowerCase()) {
    case 'admin':
      return 'ADMIN';
    case 'farmer':
      return 'AGRICULTEUR';
    case 'visitor':
    default:
      return 'VISITEUR';
  }
};

const normalizeUser = (payload: any): User => ({
  id: String(payload.id),
  nom: payload.nom || '',
  prenom: payload.prenom || '',
  email: payload.email || '',
  role: normalizeRole(payload.role),
  account_status: payload.account_status || (payload.est_actif ? 'approved' : 'pending'),
  telephone: payload.telephone || '',
  adresse: payload.adresse || '',
  region: payload.region || '',
  est_actif: payload.est_actif ?? true,
  created_at: payload.created_at || new Date().toISOString(),
  updated_at: payload.updated_at || new Date().toISOString(),
});

const decodeJwtPayload = (token: string): any | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((char) => `%${('00' + char.charCodeAt(0).toString(16)).slice(-2)}`)
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

const fetchJson = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    const message = typeof payload === 'string' ? payload : payload?.detail || payload?.message || 'Erreur de requête';
    throw new Error(message);
  }

  return payload;
};

export const useAuthComplete = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  const navigate = useNavigate();
  const location = useLocation();

  const hydrateUserFromToken = useCallback(async (token: string) => {
    try {
      const response = await fetchJson(`${API_BASE_URL}/api/auth/profile/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = normalizeUser(response);
      setAuthState({
        user,
        token,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });
      return user;
    } catch {
      localStorage.removeItem('auth_token');
      setAuthState({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
      return null;
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      return;
    }

    const jwt = decodeJwtPayload(token);
    if (!jwt) {
      localStorage.removeItem('auth_token');
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      return;
    }

    void hydrateUserFromToken(token);
  }, [hydrateUserFromToken]);

  useEffect(() => {
    if (authState.isAuthenticated && authState.user) {
      const currentPath = location.pathname;
      const allowed = canAccessRoute(authState.user.role, currentPath);
      if (!allowed && !currentPath.startsWith('/login') && !currentPath.startsWith('/register')) {
        const redirectPath = ROLE_REDIRECTS[authState.user.role];
        navigate(redirectPath, { replace: true });
      }
    }
  }, [authState.isAuthenticated, authState.user, location.pathname, navigate]);

  const login = useCallback(async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const payload = await fetchJson(`${API_BASE_URL}/api/auth/login/`, {
        method: 'POST',
        body: JSON.stringify({
          username: credentials.email,
          password: credentials.password,
        }),
      });

      const accessToken = payload.access;
      if (!accessToken) throw new Error('Token JWT introuvable');

      const user = await hydrateUserFromToken(accessToken);
      if (!user) throw new Error('Impossible de récupérer le profil utilisateur');

      localStorage.setItem('auth_token', accessToken);
      const redirectPath = ROLE_REDIRECTS[user.role];

      if (redirectPath.startsWith('http')) {
        window.location.href = redirectPath;
      } else {
        navigate(redirectPath, { replace: true });
      }

      return {
        user,
        token: accessToken,
        message: `Bienvenue ${user.prenom} ${user.nom} !`,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur de connexion';
      setAuthState((prev) => ({ ...prev, isLoading: false, error: message }));
      throw error;
    }
  }, [hydrateUserFromToken, navigate]);

  const register = useCallback(async (data: RegisterData): Promise<AuthResponse> => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const payload = await fetchJson(`${API_BASE_URL}/api/auth/register/`, {
        method: 'POST',
        body: JSON.stringify({
          username: data.email,
          email: data.email,
          password: data.password,
          password_confirm: data.password,
          prenom: data.prenom,
          nom: data.nom,
          telephone: data.telephone || '',
          region: data.region || '',
          adresse: '',
          role: (data.role || 'VISITEUR').toLowerCase() === 'agriculteur' ? 'farmer' : 'visitor',
        }),
      });

      const accessToken = payload.access || payload.token;
      if (accessToken) {
        localStorage.setItem('auth_token', accessToken);
      }

      const user = payload.user ? normalizeUser(payload.user) : await hydrateUserFromToken(accessToken);
      if (!user) throw new Error('Inscription réussie mais profil impossible à récupérer');

      setAuthState({
        user,
        token: accessToken || null,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });

      const redirectPath = ROLE_REDIRECTS[user.role];
      if (redirectPath.startsWith('http')) {
        window.location.href = redirectPath;
      } else {
        navigate(redirectPath, { replace: true });
      }

      return {
        user,
        token: accessToken || '',
        message: `Compte créé avec succès ! Bienvenue ${user.prenom} ${user.nom} !`,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur d'inscription";
      setAuthState((prev) => ({ ...prev, isLoading: false, error: message }));
      throw error;
    }
  }, [hydrateUserFromToken, navigate]);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    setAuthState({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,
    });
    navigate('/login');
  }, [navigate]);

  const updateProfile = useCallback(async (updates: Partial<User>): Promise<User> => {
    if (!authState.user) {
      throw new Error('Utilisateur non connecté');
    }

    setAuthState((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await fetchJson(`${API_BASE_URL}/api/auth/profile/`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
        body: JSON.stringify({
          ...authState.user,
          ...updates,
        }),
      });

      const user = normalizeUser(response);
      setAuthState((prev) => ({
        ...prev,
        user,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      }));

      return user;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur de mise à jour';
      setAuthState((prev) => ({ ...prev, isLoading: false, error: message }));
      throw error;
    }
  }, [authState.token, authState.user]);

  const changeUserRole = useCallback(async (userId: string, newRole: UserRole): Promise<User> => {
    if (authState.user?.role !== 'ADMIN') {
      throw new Error('Accès non autorisé');
    }

    const response = await fetchJson(`${API_BASE_URL}/api/auth/users/${userId}/role/`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${authState.token}`,
      },
      body: JSON.stringify({ role: newRole === 'ADMIN' ? 'admin' : newRole === 'AGRICULTEUR' ? 'farmer' : 'visitor' }),
    });

    return normalizeUser(response);
  }, [authState.token, authState.user]);

  return {
    ...authState,
    login,
    register,
    logout,
    updateProfile,
    changeUserRole,
    canAccessRoute: (route: string) => (authState.user ? canAccessRoute(authState.user.role, route) : false),
  };
};
