import { useState, useEffect } from 'react';
import { User, UserRole } from '@/types/visitor';

interface AuthState {
  user: User | null;
  loading: boolean;
  role: UserRole | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    role: null
  });

  useEffect(() => {
    // Simuler une authentification pour la démo
    // En production, ceci serait remplacé par Supabase Auth
    const mockAuth = () => {
      const storedUser = localStorage.getItem('agroviatech_user');
      
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          loading: false,
          role: user.role
        });
      } else {
        // Utilisateur par défaut (visiteur)
        const defaultUser: User = {
          id: 'visitor-demo',
          email: 'visiteur@demo.com',
          nom: 'Visiteur',
          prenom: 'Demo',
          role: 'VISITEUR',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        setAuthState({
          user: defaultUser,
          loading: false,
          role: 'VISITEUR'
        });
      }
    };

    mockAuth();
  }, []);

  const login = async (email: string, password: string, role?: UserRole) => {
    // Simuler une connexion
    const mockUser: User = {
      id: email,
      email,
      nom: 'Utilisateur',
      prenom: 'Test',
      role: role || 'VISITEUR',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    localStorage.setItem('agroviatech_user', JSON.stringify(mockUser));
    setAuthState({
      user: mockUser,
      loading: false,
      role: mockUser.role
    });

    return mockUser;
  };

  const logout = () => {
    localStorage.removeItem('agroviatech_user');
    setAuthState({
      user: null,
      loading: false,
      role: null
    });
  };

  const updateRole = (newRole: UserRole) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, role: newRole };
      localStorage.setItem('agroviatech_user', JSON.stringify(updatedUser));
      setAuthState({
        user: updatedUser,
        loading: false,
        role: newRole
      });
    }
  };

  return {
    ...authState,
    login,
    logout,
    updateRole,
    isAdmin: authState.role === 'ADMIN',
    isAgriculteur: authState.role === 'AGRICULTEUR',
    isVisiteur: authState.role === 'VISITEUR'
  };
}
