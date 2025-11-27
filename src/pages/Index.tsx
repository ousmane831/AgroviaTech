import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { AlertCard } from '@/components/dashboard/AlertCard';
import { ParcelleCard } from '@/components/dashboard/ParcelleCard';
import { RecolteChart } from '@/components/dashboard/RecolteChart';
import { PertesChart } from '@/components/dashboard/PertesChart';
import { PredictionCard } from '@/components/dashboard/PredictionCard';
import { Button } from '@/components/ui/button';
import {
  parcelles,
  alertes,
  predictions,
  statistiquesGlobales,
} from '@/data/mockData';
import {
  MapPin,
  Wheat,
  TrendingDown,
  Bell,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Page principale du tableau de bord AgroviaTech
 * Affiche un aperçu des parcelles, statistiques, alertes et prédictions IA
 */
const Index = () => {
  const [alertesList, setAlertesList] = useState(alertes);
  const alertesActives = alertesList.filter((a) => a.statut === 'active');

  const handleResolveAlert = (id: string) => {
    setAlertesList((prev) =>
      prev.map((a) => (a.id === id ? { ...a, statut: 'résolue' as const } : a))
    );
  };

  const getParcelleName = (parcelleId: string) => {
    return parcelles.find((p) => p.id === parcelleId)?.nom || 'Parcelle inconnue';
  };

  return (
    <MainLayout
      title="Tableau de bord"
      subtitle="Vue d'ensemble de votre exploitation agricole"
    >
      {/* Statistiques principales */}
      <section className="mb-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Parcelles actives"
            value={statistiquesGlobales.nombreParcelles}
            subtitle={`${statistiquesGlobales.surfaceTotale.toFixed(1)} ha total`}
            icon={MapPin}
            variant="primary"
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Récolte totale"
            value={`${(statistiquesGlobales.recolteTotale / 1000).toFixed(0)} T`}
            subtitle="Sur les 3 derniers mois"
            icon={Wheat}
            variant="success"
            trend={{ value: 8.5, isPositive: true }}
          />
          <StatCard
            title="Taux de perte"
            value={`${statistiquesGlobales.tauxPerte.toFixed(1)}%`}
            subtitle={`${(statistiquesGlobales.pertesTotales / 1000).toFixed(1)} T perdues`}
            icon={TrendingDown}
            variant="warning"
            trend={{ value: 2.3, isPositive: false }}
          />
          <StatCard
            title="Alertes actives"
            value={alertesActives.length}
            subtitle="Nécessitent attention"
            icon={Bell}
            variant={alertesActives.length > 3 ? 'destructive' : 'default'}
          />
        </div>
      </section>

      {/* Section principale : Graphiques et Alertes */}
      <section className="mb-8 grid gap-6 lg:grid-cols-3">
        {/* Graphiques (2/3) */}
        <div className="space-y-6 lg:col-span-2">
          <RecolteChart />
          <PertesChart />
        </div>

        {/* Alertes (1/3) */}
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

      {/* Section Parcelles */}
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
          {parcelles.slice(0, 3).map((parcelle) => (
            <ParcelleCard key={parcelle.id} parcelle={parcelle} />
          ))}
        </div>
      </section>

      {/* Section Prédictions IA */}
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
    </MainLayout>
  );
};

export default Index;
