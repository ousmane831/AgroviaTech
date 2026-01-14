import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, UserRole, AuthState, LoginCredentials, RegisterData, AuthResponse } from '@/types/auth';
import { canAccessRoute, ROLE_REDIRECTS, PUBLIC_ROUTES } from '@/types/auth';

// Mock de la base de données pour la démo
const MOCK_USERS: User[] = [
  {
    id: '1',
    nom: 'Admin',
    prenom: 'Système',
    email: 'admin@agroviatech.com',
    role: 'ADMIN',
    telephone: '+221338654321',
    region: 'Dakar',
    est_actif: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    nom: 'Sow',
    prenom: 'Moussa',
    email: 'moussa.sow@agroviatech.com',
    role: 'AGRICULTEUR',
    telephone: '+221778654321',
    region: 'Saint-Louis',
    adresse: 'Parcelle 15, Saint-Louis',
    est_actif: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    nom: 'Ba',
    prenom: 'Ibrahim',
    email: 'ibrahim.ba@agroviatech.com',
    role: 'AGRICULTEUR',
    telephone: '+221778654323',
    region: 'Fatick',
    adresse: 'Domaine 8, Fatick',
    est_actif: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    nom: 'Diop',
    prenom: 'Aminata',
    email: 'aminata.diop@agroviatech.com',
    role: 'AGRICULTEUR',
    telephone: '+221778654322',
    region: 'Kaolack',
    adresse: 'Ferme 25, Kaolack',
    est_actif: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '5',
    nom: 'Visiteur',
    prenom: 'Demo1',
    email: 'visitor1@agroviatech.com',
    role: 'VISITEUR',
    telephone: '+221778654331',
    region: 'Dakar',
    est_actif: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Fonctions utilitaires
const hashPassword = async (password: string): Promise<string> => {
  // Simule le hashage bcrypt (en production, utiliser bcrypt réel)
  return btoa(password + 'salt');
};

const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  const hashedPassword = btoa(password + 'salt');
  return hashedPassword === hash;
};

const generateToken = (user: User): string => {
  return btoa(JSON.stringify({ 
    userId: user.id, 
    email: user.email, 
    role: user.role,
    exp: Date.now() + 24 * 60 * 60 * 1000 // 24h
  }));
};

const verifyToken = (token: string): any => {
  try {
    const decoded = JSON.parse(atob(token));
    if (decoded.exp < Date.now()) {
      throw new Error('Token expiré');
    }
    return decoded;
  } catch {
    return null;
  }
};

export const useAuthComplete = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: false,
    isAuthenticated: false,
    error: null
  });

  const navigate = useNavigate();
  const location = useLocation();

  // Initialisation au montage du composant
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        const user = MOCK_USERS.find(u => u.id === decoded.userId);
        if (user && user.est_actif) {
          setAuthState({
            user,
            token,
            isLoading: false,
            isAuthenticated: true,
            error: null
          });
        } else {
          localStorage.removeItem('auth_token');
        }
      } else {
        localStorage.removeItem('auth_token');
      }
    }
    setAuthState(prev => ({ ...prev, isLoading: false }));
  }, []);

  // Vérification des permissions de route
  useEffect(() => {
    if (authState.isAuthenticated && authState.user) {
      const currentPath = location.pathname;
      
      // Temporairement désactivé pour éviter les conflits de redirection
      // if (!PUBLIC_ROUTES.includes(currentPath) && 
      //     !canAccessRoute(authState.user.role, currentPath)) {
      //   // Rediriger vers le dashboard approprié
      //   const redirectPath = ROLE_REDIRECTS[authState.user.role];
      //   navigate(redirectPath, { replace: true });
      // }
    }
  }, [authState.isAuthenticated, authState.user, location.pathname, navigate]);

  // Login
  const login = useCallback(async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Simuler une vérification en base de données
      const user = MOCK_USERS.find(u => 
        u.email === credentials.email.toLowerCase() && u.est_actif
      );

      if (!user) {
        throw new Error('Email ou mot de passe incorrect');
      }

      // Vérification du mot de passe (en production, utiliser bcrypt)
      const isValidPassword = await verifyPassword(credentials.password, 'admin123');
      
      if (!isValidPassword) {
        throw new Error('Email ou mot de passe incorrect');
      }

      // Générer le token
      const token = generateToken(user);
      
      // Sauvegarder le token
      localStorage.setItem('auth_token', token);

      // Mettre à jour l'état
      setAuthState({
        user,
        token,
        isLoading: false,
        isAuthenticated: true,
        error: null
      });

      // Rediriger vers le dashboard approprié
      const redirectPath = ROLE_REDIRECTS[user.role];
      
      // Si c'est une URL externe pour l'agriculteur
      if (redirectPath.startsWith('http')) {
        window.location.href = redirectPath;
      } else {
        navigate(redirectPath);
      }

      return {
        user,
        token,
        message: `Bienvenue ${user.prenom} ${user.nom} !`
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de connexion';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      throw error;
    }
  }, [navigate]);

  // Register
  const register = useCallback(async (data: RegisterData): Promise<AuthResponse> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Vérifier si l'email existe déjà
      const existingUser = MOCK_USERS.find(u => u.email === data.email.toLowerCase());
      if (existingUser) {
        throw new Error('Cet email est déjà utilisé');
      }

      // Créer le nouvel utilisateur
      const newUser: User = {
        id: Date.now().toString(),
        nom: data.nom,
        prenom: data.prenom,
        email: data.email.toLowerCase(),
        role: data.role,
        telephone: data.telephone,
        region: data.region,
        est_actif: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Ajouter à la base de données mock
      MOCK_USERS.push(newUser);

      // Générer le token
      const token = generateToken(newUser);
      
      // Sauvegarder le token
      localStorage.setItem('auth_token', token);

      // Mettre à jour l'état
      setAuthState({
        user: newUser,
        token,
        isLoading: false,
        isAuthenticated: true,
        error: null
      });

      // Rediriger vers le dashboard approprié
      const redirectPath = ROLE_REDIRECTS[newUser.role];
      
      // Si c'est une URL externe pour l'agriculteur
      if (redirectPath.startsWith('http')) {
        window.location.href = redirectPath;
      } else {
        navigate(redirectPath);
      }

      return {
        user: newUser,
        token,
        message: `Compte créé avec succès ! Bienvenue ${newUser.prenom} ${newUser.nom} !`
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur d\'inscription';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      throw error;
    }
  }, [navigate]);

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    setAuthState({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
      error: null
    });
    navigate('/login');
  }, [navigate]);

  // Mettre à jour le profil
  const updateProfile = useCallback(async (updates: Partial<User>): Promise<User> => {
    if (!authState.user) {
      throw new Error('Utilisateur non connecté');
    }

    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      // Simuler la mise à jour en base de données
      const updatedUser = { ...authState.user, ...updates, updated_at: new Date().toISOString() };
      
      // Mettre à jour dans le mock
      const userIndex = MOCK_USERS.findIndex(u => u.id === authState.user!.id);
      if (userIndex !== -1) {
        MOCK_USERS[userIndex] = updatedUser;
      }

      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
        isLoading: false,
        isAuthenticated: true,
        error: null
      }));

      return updatedUser;
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erreur de mise à jour'
      }));
      throw error;
    }
  }, [authState.user]);

  // Changer le rôle (admin only)
  const changeUserRole = useCallback(async (userId: string, newRole: UserRole): Promise<User> => {
    if (authState.user?.role !== 'ADMIN') {
      throw new Error('Accès non autorisé');
    }

    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      const userToUpdate = MOCK_USERS.find(u => u.id === userId);
      if (!userToUpdate) {
        throw new Error('Utilisateur non trouvé');
      }

      userToUpdate.role = newRole;
      userToUpdate.updated_at = new Date().toISOString();

      setAuthState(prev => ({ ...prev, isLoading: false }));
      return userToUpdate;
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erreur de mise à jour du rôle'
      }));
      throw error;
    }
  }, [authState.user]);

  return {
    ...authState,
    login,
    register,
    logout,
    updateProfile,
    changeUserRole,
    canAccessRoute: (route: string) => authState.user ? canAccessRoute(authState.user.role, route) : false
  };
};
