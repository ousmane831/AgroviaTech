import { useState, useEffect } from 'react';
import { CreateAgriculteurRequestData, AgriculteurRequest, AgriculteurRequestStatus } from '@/types/auth';
import { useAuthComplete } from './useAuthComplete';

const API_BASE_URL = 'http://localhost:8000';

const normalizeFarmerRequest = (user: any): AgriculteurRequest => ({
  id: String(user.id),
  user_id: String(user.id),
  first_name: user.prenom || '',
  last_name: user.nom || '',
  location: user.region || '',
  phone: user.telephone || '',
  experience: user.experience || '',
  culture_type: user.culture_type || '',
  justification: user.justification || '',
  status: user.account_status || (user.est_actif ? 'approved' : 'pending'),
  created_at: user.created_at || new Date().toISOString(),
  updated_at: user.updated_at || new Date().toISOString(),
});

export const useAgriculteurRequest = () => {
  const { user, token } = useAuthComplete();
  const [requests, setRequests] = useState<AgriculteurRequest[]>([]);
  const [currentRequest, setCurrentRequest] = useState<AgriculteurRequest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAllRequests = async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/users/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Impossible de charger les demandes d’agriculteur');
      }

      const data = await response.json();
      const farmerUsers = (data.results ?? data)
        .filter((item: any) => item.role === 'farmer')
        .map(normalizeFarmerRequest);

      setRequests(farmerUsers);

      if (user && user.role === 'AGRICULTEUR') {
        const myRequest = farmerUsers.find((req) => req.user_id === String(user.id));
        setCurrentRequest(myRequest || null);
      }
    } catch (err: any) {
      setError(err.message || 'Erreur de chargement');
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserRequest = async () => {
    if (!user || !token) {
      setCurrentRequest(null);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/users/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) return;

      const data = await response.json();
      const users = data.results ?? data;
      const matched = users.find((item: any) => String(item.id) === String(user.id));

      if (matched && matched.role === 'farmer') {
        setCurrentRequest(normalizeFarmerRequest(matched));
      } else {
        setCurrentRequest(null);
      }
    } catch (err: any) {
      setError(err.message || 'Erreur sur la demande utilisateur');
    } finally {
      setIsLoading(false);
    }
  };

  const createRequest = async (data: CreateAgriculteurRequestData) => {
    if (!user) throw new Error('Utilisateur non connecté');

    setIsLoading(true);
    setError(null);

    try {
      const isPending = currentRequest?.status === 'pending';
      if (isPending) {
        throw new Error('Vous avez déjà une demande en cours de validation');
      }

      const newRequest: AgriculteurRequest = {
        id: Date.now().toString(),
        user_id: user.id,
        ...data,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setCurrentRequest(newRequest);
      return newRequest;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const approveRequest = async (requestId: string) => {
    if (!token) throw new Error('Authentification requise');

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/users/${requestId}/approve-farmer/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Impossible d’approuver cette demande');
      }

      await loadAllRequests();
      return true;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const rejectRequest = async (requestId: string) => {
    if (!token) throw new Error('Authentification requise');

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/users/${requestId}/reject-farmer/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Impossible de rejeter cette demande');
      }

      await loadAllRequests();
      return true;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      void loadUserRequest();
    }
  }, [user, token]);

  return {
    requests,
    currentRequest,
    isLoading,
    error,
    loadAllRequests,
    loadUserRequest,
    createRequest,
    approveRequest,
    rejectRequest,
    hasPendingRequest: currentRequest?.status === 'pending',
    hasApprovedRequest: currentRequest?.status === 'approved',
    hasRejectedRequest: currentRequest?.status === 'rejected',
    canCreateNewRequest: !currentRequest || currentRequest.status === 'rejected',
  };
};
