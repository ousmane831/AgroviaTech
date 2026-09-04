import type { BuyerNeed, HarvestOffer, MarketMatch, MarketQuality } from '@/data/agroviamarket';

const API_BASE_URL = 'http://localhost:8000/api/agriculture';

const headers = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: { ...headers(), ...options.headers },
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.detail || payload?.error || 'Erreur marketplace');
  }
  return payload as T;
};

const normalizeOffer = (item: any): HarvestOffer => ({
  id: String(item.id),
  farmerName: item.farmer_name,
  farmerPhone: item.farmer_phone,
  region: item.region,
  crop: item.crop,
  quantity: Number(item.quantity),
  quality: item.quality as MarketQuality,
  availableDate: item.available_date,
  priceIndicative: Number(item.price_indicative),
  status: item.status,
});

const normalizeNeed = (item: any): BuyerNeed => ({
  id: String(item.id),
  buyerName: item.buyer_name,
  buyerPhone: item.buyer_phone,
  region: item.region,
  crop: item.crop,
  quantity: Number(item.quantity),
  quality: item.quality as MarketQuality,
  targetPrice: Number(item.target_price),
  deliveryDate: item.delivery_date,
  type: item.buyer_type,
});

const normalizeMatch = (item: any): MarketMatch => ({
  id: String(item.id),
  offerId: String(item.offer_id),
  needId: String(item.need_id),
  buyerName: item.buyer_name,
  buyerPhone: item.buyer_phone,
  farmerName: item.farmer_name,
  farmerPhone: item.farmer_phone,
  crop: item.crop,
  region: item.region,
  quantity: Number(item.quantity),
  quality: item.quality as MarketQuality,
  score: Number(item.score),
  suggestedPrice: Number(item.suggested_price),
  status: item.status,
});

export const fetchMarketOffers = async () => {
  const data = await request<any[]>('/market/offers/');
  return data.map(normalizeOffer);
};

export const createMarketOffer = async (payload: {
  crop: string;
  region: string;
  quantity: number;
  quality: MarketQuality;
  available_date: string;
  price_indicative: number;
  farmer_phone: string;
}) => request('/market/offers/', { method: 'POST', body: JSON.stringify(payload) });

export const fetchMarketNeeds = async () => {
  const data = await request<any[]>('/market/needs/');
  return data.map(normalizeNeed);
};

export const createMarketNeed = async (payload: {
  crop: string;
  region: string;
  quantity: number;
  quality: MarketQuality;
  target_price: number;
  delivery_date: string;
  buyer_type: string;
  buyer_phone: string;
}) => request('/market/needs/', { method: 'POST', body: JSON.stringify(payload) });

export const fetchMarketMatches = async () => {
  const data = await request<any[]>('/market/matches/');
  return data.map(normalizeMatch);
};

export const createMarketNegotiation = async (offerId: string, needId: string, message: string) => request('/market/negotiations/', {
  method: 'POST',
  body: JSON.stringify({ offer_id: offerId, need_id: needId, message }),
});
