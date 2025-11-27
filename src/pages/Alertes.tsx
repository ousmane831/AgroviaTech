import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { AlertCard } from '@/components/dashboard/AlertCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { alertes as initialAlertes, parcelles } from '@/data/mockData';
import { Bell, BellOff, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Page de gestion des alertes
 * Affiche les alertes actives et l'historique des alertes résolues
 */
const Alertes = () => {
  const [alertesList, setAlertesList] = useState(initialAlertes);

  const alertesActives = alertesList.filter((a) => a.statut === 'active');
  const alertesResolues = alertesList.filter((a) => a.statut === 'résolue');

  // Obtenir le nom de la parcelle
  const getParcelleName = (parcelleId: string) => {
    return parcelles.find((p) => p.id === parcelleId)?.nom || 'Parcelle inconnue';
  };

  // Résoudre une alerte
  const handleResolveAlert = (id: string) => {
    setAlertesList((prev) =>
      prev.map((a) => (a.id === id ? { ...a, statut: 'résolue' as const } : a))
    );
    toast.success('Alerte marquée comme résolue');
  };

  // Résoudre toutes les alertes
  const handleResolveAll = () => {
    setAlertesList((prev) =>
      prev.map((a) => ({ ...a, statut: 'résolue' as const }))
    );
    toast.success('Toutes les alertes ont été résolues');
  };

  // Compter par priorité
  const countByPriority = (priority: string) =>
    alertesActives.filter((a) => a.priorite === priority).length;

  return (
    <MainLayout
      title="Alertes"
      subtitle="Notifications et alertes de votre exploitation"
    >
      {/* En-tête avec badges de priorité */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          <Badge variant="haute" className="gap-1">
            <Bell className="h-3 w-3" />
            {countByPriority('haute')} haute{countByPriority('haute') > 1 ? 's' : ''}
          </Badge>
          <Badge variant="moyenne" className="gap-1">
            {countByPriority('moyenne')} moyenne{countByPriority('moyenne') > 1 ? 's' : ''}
          </Badge>
          <Badge variant="basse" className="gap-1">
            {countByPriority('basse')} basse{countByPriority('basse') > 1 ? 's' : ''}
          </Badge>
        </div>
        {alertesActives.length > 0 && (
          <Button variant="outline" onClick={handleResolveAll} className="gap-2">
            <CheckCircle className="h-4 w-4" />
            Tout résoudre
          </Button>
        )}
      </div>

      {/* Onglets */}
      <Tabs defaultValue="actives" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="actives" className="gap-2">
            <Bell className="h-4 w-4" />
            Actives ({alertesActives.length})
          </TabsTrigger>
          <TabsTrigger value="resolues" className="gap-2">
            <BellOff className="h-4 w-4" />
            Résolues ({alertesResolues.length})
          </TabsTrigger>
        </TabsList>

        {/* Alertes actives */}
        <TabsContent value="actives">
          {alertesActives.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {alertesActives
                .sort((a, b) => {
                  const priorityOrder = { haute: 0, moyenne: 1, basse: 2 };
                  return priorityOrder[a.priorite] - priorityOrder[b.priorite];
                })
                .map((alerte) => (
                  <AlertCard
                    key={alerte.id}
                    alerte={alerte}
                    parcelleName={getParcelleName(alerte.parcelleId)}
                    onResolve={handleResolveAlert}
                  />
                ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 rounded-full bg-success/10 p-4">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                Aucune alerte active
              </h3>
              <p className="text-sm text-muted-foreground">
                Votre exploitation fonctionne normalement. Continuez comme ça ! 🌱
              </p>
            </div>
          )}
        </TabsContent>

        {/* Alertes résolues */}
        <TabsContent value="resolues">
          {alertesResolues.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {alertesResolues.map((alerte) => (
                <AlertCard
                  key={alerte.id}
                  alerte={alerte}
                  parcelleName={getParcelleName(alerte.parcelleId)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 rounded-full bg-muted p-4">
                <BellOff className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                Aucune alerte résolue
              </h3>
              <p className="text-sm text-muted-foreground">
                L'historique des alertes résolues apparaîtra ici.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default Alertes;
