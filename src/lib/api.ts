const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

interface ApiResponse<T> {
  data: T;
  count?: number;
  next?: string;
  previous?: string;
}

class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('auth_token');
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || errorData.detail || 'Une erreur est survenue',
        response.status,
        errorData
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Erreur de connexion au serveur');
  }
}

// Auth API
export const authApi = {
  login: (username: string, password: string) =>
    request('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  register: (data: any) =>
    request('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getProfile: () => request('/auth/profile/'),

  requestFarmerAccount: (data: any) =>
    request('/auth/request-farmer/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Agriculture API
export const agricultureApi = {
  // Parcelles
  getParcelles: (params?: any) =>
    request('/agriculture/parcelles/', {
      method: 'GET',
      ...params,
    }),

  createParcelle: (data: any) =>
    request('/agriculture/parcelles/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getParcelle: (id: number) =>
    request(`/agriculture/parcelles/${id}/`),

  updateParcelle: (id: number, data: any) =>
    request(`/agriculture/parcelles/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteParcelle: (id: number) =>
    request(`/agriculture/parcelles/${id}/`, {
      method: 'DELETE',
    }),

  // Récoltes
  getRecoltes: (params?: any) =>
    request('/agriculture/recoltes/', {
      method: 'GET',
      ...params,
    }),

  createRecolte: (data: any) =>
    request('/agriculture/recoltes/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getRecolte: (id: number) =>
    request(`/agriculture/recoltes/${id}/`),

  updateRecolte: (id: number, data: any) =>
    request(`/agriculture/recoltes/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteRecolte: (id: number) =>
    request(`/agriculture/recoltes/${id}/`, {
      method: 'DELETE',
    }),

  // Alertes
  getAlertes: (params?: any) =>
    request('/agriculture/alertes/', {
      method: 'GET',
      ...params,
    }),

  createAlerte: (data: any) =>
    request('/agriculture/alertes/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getAlerte: (id: number) =>
    request(`/agriculture/alertes/${id}/`),

  updateAlerte: (id: number, data: any) =>
    request(`/agriculture/alertes/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  resolveAlerte: (id: number) =>
    request(`/agriculture/alertes/${id}/resoudre/`, {
      method: 'POST',
    }),

  // Prédictions
  getPredictions: (params?: any) =>
    request('/agriculture/predictions/', {
      method: 'GET',
      ...params,
    }),

  getPrediction: (id: number) =>
    request(`/agriculture/predictions/${id}/`),

  // Analyse Photo IA
  getPhotoAnalyses: (params?: any) =>
    request('/agriculture/analyse-photo/', {
      method: 'GET',
      ...params,
    }),

  createPhotoAnalysis: async (formData: FormData) => {
    const token = localStorage.getItem('auth_token');
    
    const response = await fetch(`${API_BASE_URL}/agriculture/analyse-photo/`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || errorData.detail || 'Erreur lors de l\'analyse',
        response.status,
        errorData
      );
    }

    return await response.json();
  },

  getPhotoAnalysis: (id: number) =>
    request(`/agriculture/analyse-photo/${id}/`),

  // Statistiques
  getStatistiques: () =>
    request('/agriculture/statistiques/'),

  // Marché
  getMarketOffers: (params?: any) =>
    request('/agriculture/market/offers/', {
      method: 'GET',
      ...params,
    }),

  createMarketOffer: (data: any) =>
    request('/agriculture/market/offers/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getMarketNeeds: (params?: any) =>
    request('/agriculture/market/needs/', {
      method: 'GET',
      ...params,
    }),

  createMarketNeed: (data: any) =>
    request('/agriculture/market/needs/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getMarketMatches: () =>
    request('/agriculture/market/matches/'),

  getMarketNegotiations: (params?: any) =>
    request('/agriculture/market/negotiations/', {
      method: 'GET',
      ...params,
    }),

  createMarketNegotiation: (data: any) =>
    request('/agriculture/market/negotiations/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export { ApiError };
export default { authApi, agricultureApi };
