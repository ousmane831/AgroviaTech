import { useEffect, useMemo, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { AlertCard } from '@/components/dashboard/AlertCard';
import { ParcelleCard } from '@/components/dashboard/ParcelleCard';
import { Button } from '@/components/ui/button';
import {
  parcelles as mockParcelles,
  alertes,
  type Recolte,
} from '@/data/mockData';
import {
  MapPin,
  Wheat,
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
      subtitle="Vue d'ensemble de votre exploitation"
    >
      <section className="mb-6">
        <div className="grid gap-4 grid-cols-2">
          <div className="animate-slide-up" style={{ animationDelay: '0s' }}>
            <StatCard
              title="Parcelles"
              value={parcellesList.length}
              subtitle={`${totalSurface.toFixed(1)} ha`}
              icon={MapPin}
              variant="primary"
            />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <StatCard
              title="Récolte"
              value={`${(totalRecolte / 1000).toFixed(0)} T`}
              subtitle="3 derniers mois"
              icon={Wheat}
              variant="success"
            />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <StatCard
              title="Alertes"
              value={alertesActives.length}
              subtitle="À traiter"
              icon={Bell}
              variant={alertesActives.length > 3 ? 'destructive' : 'default'}
            />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/visitor/market" className="block h-full">
              <div className="h-full hover:bg-primary/10 cursor-pointer rounded-lg transition-colors">
                <StatCard
                  title="Marché"
                  value="Voir"
                  subtitle="Acheter/Vendre"
                  icon={ShoppingBag}
                  variant="primary"
                />
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            Alertes
          </h2>
          <Link to="/agriculteur/alerts">
            <Button variant="ghost" size="sm" className="gap-1">
              Voir tout
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="space-y-3">
          {alertesActives.slice(0, 3).map((alerte) => (
            <AlertCard
              key={alerte.id}
              alerte={alerte}
              parcelleName={getParcelleName(alerte.parcelleId)}
              onResolve={handleResolveAlert}
            />
          ))}
          {alertesActives.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Aucune alerte 🎉
            </p>
          )}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Parcelles</h2>
          <Link to="/agriculteur/parcels">
            <Button variant="outline" size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              Gérer
            </Button>
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {parcellesList.slice(0, 3).map((parcelle) => (
            <ParcelleCard key={parcelle.id} parcelle={parcelle} />
          ))}
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
