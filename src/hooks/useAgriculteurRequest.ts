import { useState, useEffect } from 'react';
import { CreateAgriculteurRequestData, AgriculteurRequest, AgriculteurRequestStatus } from '@/types/auth';
import { useAuth } from './useAuth';

// Mock implementation pour la démo - à remplacer avec Supabase
export const useAgriculteurRequest = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<AgriculteurRequest[]>([]);
  const [currentRequest, setCurrentRequest] = useState<AgriculteurRequest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger toutes les demandes (admin)
  const loadAllRequests = async () => {
    setIsLoading(true);
    setError(null);
    
    // Mock data pour la démo
    setTimeout(() => {
      const mockRequests: AgriculteurRequest[] = [
        {
          id: '1',
          user_id: 'user1',
          first_name: 'Mamadou',
          last_name: 'Diop',
          location: 'Dakar',
          phone: '+221778965412',
          experience: '3-5 ans',
          culture_type: 'Maraîchage (tomates, oignons, carottes)',
          justification: 'Je souhaite moderniser mon exploitation maraîchère et améliorer mes rendements grâce aux technologies IoT.',
          status: 'pending',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          updated_at: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: '2',
          user_id: 'user2',
          first_name: 'Fatou',
          last_name: 'Ba',
          location: 'Saint-Louis',
          phone: '+221776543210',
          experience: 'Plus de 10 ans',
          culture_type: 'Céréales (maïs, mil, sorgho)',
          justification: 'Agricultrice depuis 10 ans, je veux intégrer les solutions numériques pour optimiser ma production.',
          status: 'approved',
          created_at: new Date(Date.now() - 172800000).toISOString(),
          updated_at: new Date(Date.now() - 86400000).toISOString()
        }
      ];
      setRequests(mockRequests);
      setIsLoading(false);
    }, 1000);
  };

  // Charger la demande de l'utilisateur connecté
  const loadUserRequest = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    // Mock: vérifier si l'utilisateur a une demande
    setTimeout(() => {
      if (user.id === 'visitor-demo') {
        // Pas de demande pour le visiteur de démo
        setCurrentRequest(null);
      }
      setIsLoading(false);
    }, 500);
  };

  // Créer une nouvelle demande
  const createRequest = async (data: CreateAgriculteurRequestData) => {
    if (!user) throw new Error('Utilisateur non connecté');
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Vérifier si l'utilisateur n'a pas déjà une demande en cours
      if (currentRequest?.status === 'pending') {
        throw new Error('Vous avez déjà une demande en cours de validation');
      }

      const newRequest: AgriculteurRequest = {
        id: Date.now().toString(),
        user_id: user.id,
        ...data,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
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

  // Approuver une demande (admin)
  const approveRequest = async (requestId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Mettre à jour la demande
      setRequests(prev => prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'approved' as AgriculteurRequestStatus, updated_at: new Date().toISOString() }
          : req
      ));

      // Mettre à jour la demande courante si c'est celle de l'utilisateur
      if (currentRequest?.id === requestId) {
        setCurrentRequest(prev => prev ? { ...prev, status: 'approved', updated_at: new Date().toISOString() } : null);
      }

      return true;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Rejeter une demande (admin)
  const rejectRequest = async (requestId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      setRequests(prev => prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'rejected' as AgriculteurRequestStatus, updated_at: new Date().toISOString() }
          : req
      ));

      if (currentRequest?.id === requestId) {
        setCurrentRequest(prev => prev ? { ...prev, status: 'rejected', updated_at: new Date().toISOString() } : null);
      }

      return true;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Charger automatiquement la demande de l'utilisateur au montage
  useEffect(() => {
    if (user) {
      loadUserRequest();
    }
  }, [user]);

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
    canCreateNewRequest: !currentRequest || currentRequest.status === 'rejected'
  };
};
