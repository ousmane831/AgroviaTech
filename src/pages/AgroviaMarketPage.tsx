import { useEffect, useState } from 'react';
import { VisitorLayout } from '@/components/layout/VisitorLayout';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuthComplete } from '@/hooks/useAuthComplete';
import { fetchMarketNeeds, fetchMarketOffers } from '@/lib/marketApi';
import {
  ShoppingBag,
  TrendingUp,
  Users,
  Package,
  MapPin,
  ArrowRight,
} from 'lucide-react';

export default function AgroviaMarketPage() {
  const navigate = useNavigate();
  const { user } = useAuthComplete();
  const isFarmer = user?.role === 'AGRICULTEUR';
  const [offers, setOffers] = useState<Awaited<ReturnType<typeof fetchMarketOffers>>>([]);
  const [buyerNeeds, setBuyerNeeds] = useState<Awaited<ReturnType<typeof fetchMarketNeeds>>>([]);

  useEffect(() => {
    const loadMarket = async () => {
      try {
        const [offerData, needData] = await Promise.all([fetchMarketOffers(), fetchMarketNeeds()]);
        setOffers(offerData.filter((offer) => offer.status === 'active'));
        setBuyerNeeds(needData);
      } catch (error) {
        console.error('Erreur lors du chargement du marché:', error);
      }
    };

    void loadMarket();
  }, []);

  const averagePrice = offers.length
    ? Math.round(offers.reduce((total, offer) => total + offer.priceIndicative, 0) / offers.length)
    : 0;

  return (
    <VisitorLayout
      title="AgroviaMarket"
      subtitle="Le marché agricole sénégalais"
    >
      {/* Hero Section */}
      <section className="mb-8 rounded-2xl bg-gradient-to-br from-[#2d562b] to-[#4e7d4c] px-6 py-10 text-white shadow-lg sm:px-10 sm:py-14">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Achetez et vendez vos produits agricoles
          </h1>
          <p className="mt-4 text-lg text-white/90 sm:text-xl">
            Connectez-vous directement avec des agriculteurs et des acheteurs sur tout le Sénégal.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button 
              size="lg" 
              className="bg-[#d4a32b] text-white hover:bg-[#c4921a]"
              onClick={() => navigate(isFarmer ? '/visitor/market/harvest' : '/visitor/market/buyer')}
            >
              <Package className="mr-2 h-5 w-5" />
              {isFarmer ? 'Publier une récolte' : 'Publier un besoin'}
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-green text-white hover:bg-green hover:text-white"
              onClick={() => navigate('/visitor/market/matches')}
            >
              <Users className="mr-2 h-5 w-5" />
              Voir les correspondances
            </Button>
          </div>
        </div>
      </section>

      {/* Statistiques - Grille 2x2 */}
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-[#1d2a22]">Statistiques du marché</h2>
        <div className="grid gap-4 grid-cols-2">
          <div className="rounded-xl border border-[#dfe5df] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-[#edf5ef] p-2">
                <ShoppingBag className="h-6 w-6 text-[#2d562b]" />
              </div>
              <div>
                <p className="text-sm text-[#69756d]">Offres actives</p>
                <p className="text-2xl font-bold text-[#2d562b]">{offers.length}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-[#dfe5df] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-[#edf5ef] p-2">
                <TrendingUp className="h-6 w-6 text-[#2d562b]" />
              </div>
              <div>
                <p className="text-sm text-[#69756d]">Prix moyen</p>
                <p className="text-2xl font-bold text-[#2d562b]">{averagePrice} <span className="text-sm font-normal">FCFA/kg</span></p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-[#dfe5df] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-[#edf5ef] p-2">
                <Users className="h-6 w-6 text-[#2d562b]" />
              </div>
              <div>
                <p className="text-sm text-[#69756d]">Acheteurs</p>
                <p className="text-2xl font-bold text-[#2d562b]">{buyerNeeds.length}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-[#dfe5df] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-[#edf5ef] p-2">
                <MapPin className="h-6 w-6 text-[#2d562b]" />
              </div>
              <div>
                <p className="text-sm text-[#69756d]">Régions</p>
                <p className="text-2xl font-bold text-[#2d562b]">{new Set(offers.map((offer) => offer.region)).size}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Offres disponibles */}
      <section className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#1d2a22]">Offres disponibles</h2>
          <Button variant="ghost" size="sm" className="gap-1" onClick={() => navigate('/visitor/market/harvest')}>
            Voir tout
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-3">
          {offers.slice(0, 3).map((offer) => (
            <div key={offer.id} className="rounded-xl border border-[#dfe5df] bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-[#1d2a22]">{offer.crop}</h3>
                    <span className="rounded-full bg-[#eef7ef] px-2 py-0.5 text-xs font-medium text-[#1d4d2d]">{offer.quality}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-[#69756d]">
                    <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {offer.region}</span>
                    <span className="flex items-center gap-1"><Package className="h-4 w-4" /> {offer.quantity} kg</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-[#2d562b]">{offer.priceIndicative}</p>
                  <p className="text-xs text-[#69756d]">FCFA/kg</p>
                </div>
              </div>
            </div>
          ))}
          {offers.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Aucune offre disponible pour le moment
            </p>
          )}
        </div>
      </section>

      {/* Besoins acheteurs */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#1d2a22]">Besoins acheteurs</h2>
          <Button variant="ghost" size="sm" className="gap-1" onClick={() => navigate('/visitor/market/buyer')}>
            Voir tout
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-3">
          {buyerNeeds.slice(0, 3).map((need) => (
            <div key={need.id} className="rounded-xl border border-[#dfe5df] bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-[#1d2a22]">{need.buyerName}</h3>
                  <p className="mt-1 text-sm text-[#69756d]">{need.crop}</p>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-[#69756d]">
                    <span className="flex items-center gap-1"><Package className="h-4 w-4" /> {need.quantity} kg</span>
                    <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {need.region}</span>
                  </div>
                </div>
                <div className="rounded-lg bg-[#edf5ef] p-2">
                  <ShoppingBag className="h-5 w-5 text-[#2d562b]" />
                </div>
              </div>
            </div>
          ))}
          {buyerNeeds.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Aucun besoin enregistré pour le moment
            </p>
          )}
        </div>
      </section>
    </VisitorLayout>
  );
}
