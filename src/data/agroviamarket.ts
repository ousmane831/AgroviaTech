export type MarketQuality = 'Standard' | 'Premium' | 'Classe A';

export interface HarvestOffer {
  id: string;
  farmerName: string;
  farmerPhone?: string;
  region: string;
  crop: string;
  quantity: number;
  quality: MarketQuality;
  availableDate: string;
  priceIndicative: number;
  status: 'active' | 'reserved' | 'closed';
}

export interface BuyerNeed {
  id: string;
  buyerName: string;
  buyerPhone?: string;
  region: string;
  crop: string;
  quantity: number;
  quality: MarketQuality;
  targetPrice: number;
  deliveryDate: string;
  type: 'Grossiste' | 'Restaurant' | 'Transformateur' | 'Distributeur';
}

export interface MarketMatch {
  id: string;
  offerId: string;
  needId: string;
  buyerName: string;
  buyerPhone?: string;
  farmerName: string;
  farmerPhone?: string;
  crop: string;
  region: string;
  quantity: number;
  quality: MarketQuality;
  score: number;
  suggestedPrice: number;
  status: 'match' | 'negociation' | 'accepted';
}

export const harvestOffersSeed: HarvestOffer[] = [
  {
    id: 'offer-1',
    farmerName: 'Seydou Diop',
    region: 'Dakar',
    crop: 'Arachides',
    quantity: 480,
    quality: 'Premium',
    availableDate: '2026-09-04',
    priceIndicative: 570,
    status: 'active',
  },
  {
    id: 'offer-2',
    farmerName: 'Mamadou Fall',
    region: 'Thiès',
    crop: 'Tomates',
    quantity: 620,
    quality: 'Classe A',
    availableDate: '2026-09-05',
    priceIndicative: 610,
    status: 'active',
  },
  {
    id: 'offer-3',
    farmerName: 'Awa Ndiaye',
    region: 'Saint-Louis',
    crop: 'Mil',
    quantity: 390,
    quality: 'Standard',
    availableDate: '2026-09-06',
    priceIndicative: 410,
    status: 'active',
  },
  {
    id: 'offer-4',
    farmerName: 'Abdou Mbaye',
    region: 'Dakar',
    crop: 'Carottes',
    quantity: 260,
    quality: 'Premium',
    availableDate: '2026-09-07',
    priceIndicative: 470,
    status: 'reserved',
  },
];

export const buyerNeedsSeed: BuyerNeed[] = [
  {
    id: 'need-1',
    buyerName: 'Grossiste Dakar',
    region: 'Dakar',
    crop: 'Arachides',
    quantity: 300,
    quality: 'Premium',
    targetPrice: 600,
    deliveryDate: '2026-09-08',
    type: 'Grossiste',
  },
  {
    id: 'need-2',
    buyerName: 'Restaurant local',
    region: 'Thiès',
    crop: 'Tomates',
    quantity: 180,
    quality: 'Classe A',
    targetPrice: 640,
    deliveryDate: '2026-09-09',
    type: 'Restaurant',
  },
  {
    id: 'need-3',
    buyerName: 'Transformateur',
    region: 'Saint-Louis',
    crop: 'Mil',
    quantity: 500,
    quality: 'Standard',
    targetPrice: 430,
    deliveryDate: '2026-09-10',
    type: 'Transformateur',
  },
  {
    id: 'need-4',
    buyerName: 'Distributeur Sud',
    region: 'Dakar',
    crop: 'Carottes',
    quantity: 220,
    quality: 'Premium',
    targetPrice: 500,
    deliveryDate: '2026-09-11',
    type: 'Distributeur',
  },
];

const HARVEST_STORAGE_KEY = 'agroviamarket.harvestOffers';
const NEEDS_STORAGE_KEY = 'agroviamarket.buyerNeeds';

export function getHarvestOffers(): HarvestOffer[] {
  if (typeof window === 'undefined') return harvestOffersSeed;

  const stored = window.localStorage.getItem(HARVEST_STORAGE_KEY);
  if (!stored) return harvestOffersSeed;

  try {
    const parsed = JSON.parse(stored) as HarvestOffer[];
    return parsed.length ? parsed : harvestOffersSeed;
  } catch {
    return harvestOffersSeed;
  }
}

export function saveHarvestOffers(offers: HarvestOffer[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(HARVEST_STORAGE_KEY, JSON.stringify(offers));
}

export function getBuyerNeeds(): BuyerNeed[] {
  if (typeof window === 'undefined') return buyerNeedsSeed;

  const stored = window.localStorage.getItem(NEEDS_STORAGE_KEY);
  if (!stored) return buyerNeedsSeed;

  try {
    const parsed = JSON.parse(stored) as BuyerNeed[];
    return parsed.length ? parsed : buyerNeedsSeed;
  } catch {
    return buyerNeedsSeed;
  }
}

export function saveBuyerNeeds(needs: BuyerNeed[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(NEEDS_STORAGE_KEY, JSON.stringify(needs));
}

export const harvestOffers = getHarvestOffers();
export const buyerNeeds = getBuyerNeeds();

export const qualityScore: Record<MarketQuality, number> = {
  Standard: 1,
  'Classe A': 1.2,
  Premium: 1.4,
};

export function computeMarketMatches(): MarketMatch[] {
  return harvestOffers
    .filter((offer) => offer.status === 'active')
    .flatMap((offer) =>
      buyerNeeds
        .filter((need) => need.crop === offer.crop && need.region === offer.region)
        .map((need) => {
          const cropMatch = 35;
          const qualityMatch = Math.min(25, Math.round((qualityScore[need.quality] / qualityScore[offer.quality]) * 20));
          const priceMatch = Math.min(20, Math.max(5, Math.round((1 - Math.abs(need.targetPrice - offer.priceIndicative) / 200) * 20)));
          const quantityMatch = Math.min(20, Math.round((Math.min(need.quantity, offer.quantity) / Math.max(need.quantity, offer.quantity)) * 20));

          const score = Math.min(99, Math.max(65, cropMatch + qualityMatch + priceMatch + quantityMatch));

          return {
            id: `${offer.id}-${need.id}`,
            offerId: offer.id,
            needId: need.id,
            buyerName: need.buyerName,
            buyerPhone: need.buyerPhone,
            farmerName: offer.farmerName,
            farmerPhone: offer.farmerPhone,
            crop: offer.crop,
            region: offer.region,
            quantity: Math.min(offer.quantity, need.quantity),
            quality: offer.quality,
            score: Math.round(score),
            suggestedPrice: Math.round((offer.priceIndicative + need.targetPrice) / 2),
            status: score >= 90 ? 'match' : 'negociation',
          };
        })
    );
}
