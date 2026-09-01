import { Parcelle, Recolte, CultureType } from '@/data/mockData';

const API_BASE_URL = 'http://localhost:8000/api/agriculture';

const getToken = () => localStorage.getItem('auth_token');

const getAuthHeaders = (extra: Record<string, string> = {}) => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
};

const parseJson = async (response: Response) => {
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }
  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

const normalizeCulture = (value?: string): CultureType => {
  switch ((value || '').toLowerCase()) {
    case 'maïs':
    case 'mais':
      return 'maïs';
    case 'blé':
    case 'ble':
      return 'blé';
    case 'tomate':
    case 'tomates':
      return 'tomates';
    case 'pomme de terre':
    case 'pommes de terre':
      return 'pommes de terre';
    case 'riz':
      return 'riz';
    default:
      return 'maïs';
  }
};

const normalizeStatut = (value?: string): Parcelle['statut'] => {
  switch ((value || '').toLowerCase()) {
    case 'en attente':
      return 'en préparation';
    case 'inactive':
      return 'en repos';
    case 'active':
    default:
      return 'active';
  }
};

const normalizeQualite = (value?: string): Recolte['qualite'] => {
  switch ((value || '').toLowerCase()) {
    case 'excellente':
      return 'excellente';
    case 'bonne':
      return 'bonne';
    case 'moyenne':
      return 'moyenne';
    case 'faible':
      return 'faible';
    default:
      return 'bonne';
  }
};

const normalizeBackendParcelle = (item: any): Parcelle => ({
  id: String(item.id),
  nom: item.nom || 'Parcelle sans nom',
  surface: Number(item.surface || 0),
  typeCulture: normalizeCulture(item.type_culture),
  localisation: item.localisation || 'Localisation non renseignée',
  dateCreation: item.date_creation ? item.date_creation.split('T')[0] : new Date().toISOString().split('T')[0],
  statut: normalizeStatut(item.statut),
});

const normalizeBackendRecolte = (item: any): Recolte => ({
  id: String(item.id),
  cultureId: `c${String(item.parcelle || '0')}`,
  parcelleId: String(item.parcelle),
  date: item.date_recolte || new Date().toISOString().split('T')[0],
  quantiteRecoltee: Number(item.quantite || 0),
  quantiteStockee: Number(item.quantite || 0),
  pertes: 0,
  qualite: normalizeQualite(item.qualite),
});

const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: getAuthHeaders((options.headers as Record<string, string>) || {}),
  });

  const payload = await parseJson(response);

  if (!response.ok) {
    const message = typeof payload === 'string'
      ? payload
      : payload?.detail || payload?.error || 'Erreur API agriculture';
    throw new Error(message);
  }

  return payload as T;
};

export const fetchParcelles = async (): Promise<Parcelle[]> => {
  const data = await request<any[]>('/parcelles/');
  return (Array.isArray(data) ? data : []).map(normalizeBackendParcelle);
};

export const createParcelle = async (payload: Partial<Parcelle>) => {
  const body = {
    nom: payload.nom,
    type_culture: payload.typeCulture,
    surface: Number(payload.surface || 0),
    localisation: payload.localisation,
    statut: payload.statut === 'en préparation' ? 'en attente' : payload.statut === 'en repos' ? 'inactive' : 'active',
  };

  return request<any>('/parcelles/', {
    method: 'POST',
    body: JSON.stringify(body),
  });
};

export const updateParcelle = async (id: string, payload: Partial<Parcelle>) => {
  const body = {
    nom: payload.nom,
    type_culture: payload.typeCulture,
    surface: Number(payload.surface || 0),
    localisation: payload.localisation,
    statut: payload.statut === 'en préparation' ? 'en attente' : payload.statut === 'en repos' ? 'inactive' : 'active',
  };

  return request<any>(`/parcelles/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
};

export const deleteParcelle = async (id: string) => {
  return request(`/parcelles/${id}/`, { method: 'DELETE' });
};

export const fetchRecoltes = async (): Promise<Recolte[]> => {
  const data = await request<any[]>('/recoltes/');
  return (Array.isArray(data) ? data : []).map(normalizeBackendRecolte);
};

export const createRecolte = async (payload: Partial<Recolte>) => {
  const body = {
    parcelle: Number(payload.parcelleId),
    date_recolte: payload.date,
    quantite: Number(payload.quantiteRecoltee || 0),
    qualite: payload.qualite || 'bonne',
    notes: '',
  };

  return request<any>('/recoltes/', {
    method: 'POST',
    body: JSON.stringify(body),
  });
};

export const updateRecolte = async (id: string, payload: Partial<Recolte>) => {
  const body = {
    parcelle: Number(payload.parcelleId),
    date_recolte: payload.date,
    quantite: Number(payload.quantiteRecoltee || 0),
    qualite: payload.qualite || 'bonne',
    notes: '',
  };

  return request<any>(`/recoltes/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
};

export const deleteRecolte = async (id: string) => {
  return request(`/recoltes/${id}/`, { method: 'DELETE' });
};
