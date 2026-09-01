import { useEffect, useMemo, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { AlertCard } from '@/components/dashboard/AlertCard';
import { ParcelleCard } from '@/components/dashboard/ParcelleCard';
import { RecolteChart } from '@/components/dashboard/RecolteChart';
import { PertesChart } from '@/components/dashboard/PertesChart';
import { PredictionCard } from '@/components/dashboard/PredictionCard';
import { DashboardVoiceAssistant } from '@/components/dashboard/DashboardVoiceAssistant';
import { Button } from '@/components/ui/button';
import {
  parcelles as mockParcelles,
  alertes,
  predictions,
  statistiquesGlobales,
  type Recolte,
} from '@/data/mockData';
import {
  MapPin,
  Wheat,
  TrendingDown,
  Bell,
  Plus,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchParcelles, fetchRecoltes } from '@/lib/agricultureApi';

const Index = () => {
  const [parcellesList, setParcellesList] = useState(mockParcelles);
  const [recoltesList, setRecoltesList] = useState<Recolte[]>([]);
  const [alertesList, setAlertesList] = useState(alertes);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [parcelleData, recolteData] = await Promise.all([
          fetchParcelles(),
          fetchRecoltes(),
        ]);

        if (!isMounted) return;

        setParcellesList(parcelleData.length > 0 ? parcelleData : mockParcelles);
        setRecoltesList(recolteData.length > 0 ? recolteData : []);
      } catch {
        if (isMounted) {
          setParcellesList(mockParcelles);
          setRecoltesList([]);
        }
      }
    };

    void loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const alertesActives = alertesList.filter((a) => a.statut === 'active');

  const totalSurface = useMemo(
    () => parcellesList.reduce((sum, parcelle) => sum + parcelle.surface, 0),
    [parcellesList]
  );

  const totalRecolte = useMemo(
    () => recoltesList.reduce((sum, recolte) => sum + recolte.quantiteRecoltee, 0),
    [recoltesList]
  );

  const totalPertes = useMemo(
    () => recoltesList.reduce((sum, recolte) => sum + recolte.pertes, 0),
    [recoltesList]
  );

  const handleResolveAlert = (id: string) => {
    setAlertesList((prev) =>
      prev.map((a) => (a.id === id ? { ...a, statut: 'résolue' as const } : a))
    );
  };

  const getParcelleName = (parcelleId: string) => {
    return parcellesList.find((p) => p.id === parcelleId)?.nom || 'Parcelle inconnue';
  };

  return (
    <MainLayout
      title="Tableau de bord"
      subtitle="Vue d'ensemble de votre exploitation agricole"
    >
      <section className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Vue d&apos;ensemble</h2>
        </div>
        <Link to="/visitor/market">
          <Button variant="outline" className="gap-2 border-primary/30 text-primary hover:bg-primary/5">
            <ShoppingBag className="h-4 w-4" />
            Voir le marché
          </Button>
        </Link>
      </section>

      <section className="mb-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="animate-slide-up" style={{ animationDelay: '0s' }}>
            <StatCard
              title="Parcelles actives"
              value={parcellesList.length}
              subtitle={`${totalSurface.toFixed(1)} ha total`}
              icon={MapPin}
              variant="primary"
              trend={{ value: 12, isPositive: true }}
            />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <StatCard
              title="Récolte totale"
              value={`${(totalRecolte / 1000).toFixed(0)} T`}
              subtitle="Sur les 3 derniers mois"
              icon={Wheat}
              variant="success"
              trend={{ value: 8.5, isPositive: true }}
            />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <StatCard
              title="Taux de perte"
              value={`${((totalPertes / Math.max(totalRecolte, 1)) * 100).toFixed(1)}%`}
              subtitle={`${(totalPertes / 1000).toFixed(1)} T perdues`}
              icon={TrendingDown}
              variant="warning"
              trend={{ value: 2.3, isPositive: false }}
            />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <StatCard
              title="Alertes actives"
              value={alertesActives.length}
              subtitle="Nécessitent attention"
              icon={Bell}
              variant={alertesActives.length > 3 ? 'destructive' : 'default'}
            />
          </div>
        </div>
      </section>

      <section className="mb-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <RecolteChart />
          <PertesChart />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Alertes récentes
            </h2>
            <Link to="/alertes">
              <Button variant="ghost" size="sm" className="gap-1">
                Voir tout
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {alertesActives.slice(0, 4).map((alerte) => (
              <AlertCard
                key={alerte.id}
                alerte={alerte}
                parcelleName={getParcelleName(alerte.parcelleId)}
                onResolve={handleResolveAlert}
              />
            ))}
            {alertesActives.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Aucune alerte active 🎉
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Vos parcelles</h2>
          <Link to="/parcelles">
            <Button variant="outline" size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              Gérer les parcelles
            </Button>
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {parcellesList.slice(0, 3).map((parcelle) => (
            <ParcelleCard key={parcelle.id} parcelle={parcelle} />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Prédictions IA
          </h2>
          <Link to="/predictions">
            <Button variant="ghost" size="sm" className="gap-1">
              Voir toutes les prédictions
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {predictions.slice(0, 3).map((prediction) => (
            <PredictionCard key={prediction.parcelleId} prediction={prediction} />
          ))}
        </div>
      </section>

      <div className="fixed bottom-8 right-8 z-50">
        <DashboardVoiceAssistant />
      </div>
    </MainLayout>
  );
};

export default Index;
