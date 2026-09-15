import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VisitorLayout } from '@/components/layout/VisitorLayout';
import { Button } from '@/components/ui/button';
import { Leaf, Users, ShoppingBag, TrendingUp, ArrowRight, Sprout } from 'lucide-react';

// Données de prix par région
const pricesByRegion = {
  Dakar: [
    { name: 'Arrachides', price: 520, unit: 'FCFA/KG', trend: '+5%', icon: Sprout },
    { name: 'Tomates', price: 600, unit: 'FCFA/KG', trend: '+8%', icon: Leaf },
    { name: 'Mil', price: 380, unit: 'FCFA/KG', trend: '-2%', icon: TrendingUp },
  ],
  'Thiès': [
    { name: 'Maïs', price: 410, unit: 'FCFA/KG', trend: '+3%', icon: Sprout },
    { name: 'Oignons', price: 480, unit: 'FCFA/KG', trend: '+4%', icon: Leaf },
    { name: 'Sorgho', price: 350, unit: 'FCFA/KG', trend: '-1%', icon: TrendingUp },
  ],
  Kédougou: [
    { name: 'Riz', price: 550, unit: 'FCFA/KG', trend: '+6%', icon: Sprout },
    { name: 'Aubergines', price: 420, unit: 'FCFA/KG', trend: '+2%', icon: Leaf },
    { name: 'Niébé', price: 480, unit: 'FCFA/KG', trend: '+3%', icon: TrendingUp },
  ],
  'Saint-Louis': [
    { name: 'Blé', price: 620, unit: 'FCFA/KG', trend: '+7%', icon: Sprout },
    { name: 'Laitues', price: 320, unit: 'FCFA/KG', trend: '-3%', icon: Leaf },
    { name: 'Haricots', price: 580, unit: 'FCFA/KG', trend: '+5%', icon: TrendingUp },
  ],
  Matam: [
    { name: 'Arachides', price: 560, unit: 'FCFA/KG', trend: '+4%', icon: Sprout },
    { name: 'Courgettes', price: 340, unit: 'FCFA/KG', trend: '+1%', icon: Leaf },
    { name: 'Sésame', price: 720, unit: 'FCFA/KG', trend: '+9%', icon: TrendingUp },
  ],
};

const regions = ['Dakar', 'Thiès', 'Kédougou', 'Saint-Louis', 'Matam'];

const VisitorDashboardPage = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>(regions[0]);
  const navigate = useNavigate();

  return (
    <VisitorLayout
      title="AgroviaTech"
      subtitle="L'agriculture sénégalaise connectée"
    >
      {/* Hero Section - Plus impactant */}
      <section className="mb-8 rounded-2xl bg-gradient-to-br from-[#2d562b] to-[#4e7d4c] px-6 py-10 text-white shadow-lg sm:px-10 sm:py-14">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Connectez-vous à l'agriculture sénégalaise
          </h1>
          <p className="mt-4 text-lg text-white/90 sm:text-xl">
            Accédez aux prix du marché, trouvez des acheteurs et développez votre exploitation avec AgroviaTech.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button 
              size="lg" 
              className="bg-[#d4a32b] text-white hover:bg-[#c4921a]"
              onClick={() => navigate('/visitor/demande-agriculteur')}
            >
              <Users className="mr-2 h-5 w-5" />
              Devenir agriculteur
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-green text-white hover:bg-green hover:text-white"
              onClick={() => navigate('/visitor/market')}
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Accéder au marché
            </Button>
          </div>
        </div>
      </section>

      {/* Statistiques rapides - Simplifiées */}
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-[#1d2a22]">Prix du jour - {selectedRegion}</h2>
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
          {pricesByRegion[selectedRegion as keyof typeof pricesByRegion]?.map((product, index) => (
            <div
              key={product.name}
              className="animate-slide-up rounded-xl border border-[#dfe5df] bg-white p-5 shadow-sm transition-all hover:shadow-md"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between">
                <div className="rounded-lg bg-[#edf5ef] p-2">
                  <product.icon className="h-6 w-6 text-[#2d562b]" />
                </div>
                <span className={`text-sm font-medium ${product.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {product.trend}
                </span>
              </div>
              <h3 className="mt-3 text-lg font-semibold text-[#1d2a22]">{product.name}</h3>
              <p className="mt-1 text-2xl font-bold text-[#2d562b]">{product.price} <span className="text-sm font-normal text-[#69756d]">{product.unit}</span></p>
            </div>
          ))}
        </div>
      </section>

      {/* Sélecteur de région - Plus simple */}
      <section className="mb-8 rounded-xl border border-[#dfe5df] bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold text-[#1d2a22]">Prix par région</h3>
            <p className="text-sm text-[#69756d]">Consultez les indicateurs pour votre zone</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedRegion === region
                    ? 'bg-[#2d562b] text-white'
                    : 'bg-[#f8faf8] text-[#1d2a22] hover:bg-[#edf5ef]'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Section avantages */}
      <section className="grid gap-6 sm:grid-cols-3">
        <div className="rounded-xl border border-[#dfe5df] bg-white p-6 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#edf5ef]">
            <ShoppingBag className="h-6 w-6 text-[#2d562b]" />
          </div>
          <h3 className="font-semibold text-[#1d2a22]">Marché en ligne</h3>
          <p className="mt-2 text-sm text-[#69756d]">Achetez et vendez vos produits agricoles</p>
        </div>
        <div className="rounded-xl border border-[#dfe5df] bg-white p-6 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#edf5ef]">
            <TrendingUp className="h-6 w-6 text-[#2d562b]" />
          </div>
          <h3 className="font-semibold text-[#1d2a22]">Prix en temps réel</h3>
          <p className="mt-2 text-sm text-[#69756d]">Suivez les prix du marché par région</p>
        </div>
        <div className="rounded-xl border border-[#dfe5df] bg-white p-6 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#edf5ef]">
            <Users className="h-6 w-6 text-[#2d562b]" />
          </div>
          <h3 className="font-semibold text-[#1d2a22]">Réseau agricole</h3>
          <p className="mt-2 text-sm text-[#69756d]">Connectez-vous avec d'autres agriculteurs</p>
        </div>
      </section>

    </VisitorLayout>
  );
};

export default VisitorDashboardPage;
