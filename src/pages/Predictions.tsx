import { MainLayout } from '@/components/layout/MainLayout';
import { PredictionCard } from '@/components/dashboard/PredictionCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { predictions, parcelles, cultureIcons } from '@/data/mockData';
import { Brain, TrendingUp, AlertTriangle, Sparkles } from 'lucide-react';

/**
 * Page des prédictions IA
 * Affiche les prédictions de rendement et recommandations générées par l'IA
 */
const Predictions = () => {
  // Calculer les moyennes
  const moyenneRendement =
    predictions.reduce((acc, p) => acc + p.rendementPrevu, 0) / predictions.length;
  const moyennePertes =
    predictions.reduce((acc, p) => acc + p.pertesEstimees, 0) / predictions.length;
  const moyenneConfiance =
    predictions.reduce((acc, p) => acc + p.confiance, 0) / predictions.length;

  // Obtenir toutes les recommandations uniques
  const toutesRecommandations = [
    ...new Set(predictions.flatMap((p) => p.recommandations)),
  ];

  return (
    <MainLayout
      title="Prédictions IA"
      subtitle="Analyses et recommandations basées sur l'intelligence artificielle"
    >
      {/* Bannière IA */}
      <Card className="mb-8 border-info/30 bg-info/5">
        <CardContent className="flex items-center gap-4 py-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-info/20">
            <Brain className="h-6 w-6 text-info" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              Modèle de prédiction AgroviaTech
            </h3>
            <p className="text-sm text-muted-foreground">
              Prédictions basées sur les données simulées des 3 derniers mois.
              Confiance moyenne : {moyenneConfiance.toFixed(0)}%
            </p>
          </div>
          <Badge variant="info" className="ml-auto gap-1">
            <Sparkles className="h-3 w-3" />
            Simulé
          </Badge>
        </CardContent>
      </Card>

      {/* KPIs des prédictions */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              Rendement moyen prévu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              {moyenneRendement.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} kg/ha
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <AlertTriangle className="h-4 w-4" />
              Pertes estimées moyennes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-warning">
              {moyennePertes.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Brain className="h-4 w-4" />
              Confiance du modèle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-info">
              {moyenneConfiance.toFixed(0)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Prédictions par parcelle */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Prédictions par parcelle
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {predictions.map((prediction) => (
            <PredictionCard key={prediction.parcelleId} prediction={prediction} />
          ))}
        </div>
      </div>

      {/* Recommandations globales */}
      <Card>
        <CardHeader>
          <CardTitle>Recommandations globales</CardTitle>
          <CardDescription>
            Actions suggérées par l'IA pour optimiser vos rendements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {toutesRecommandations.map((rec, index) => {
              // Trouver la parcelle associée
              const predWithRec = predictions.find((p) =>
                p.recommandations.includes(rec)
              );
              const parcelle = parcelles.find(
                (p) => p.id === predWithRec?.parcelleId
              );

              return (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-lg border bg-card p-3"
                >
                  <span className="text-lg">
                    {parcelle ? cultureIcons[parcelle.typeCulture] : '🌱'}
                  </span>
                  <div>
                    <p className="text-sm text-foreground">{rec}</p>
                    {parcelle && (
                      <p className="text-xs text-muted-foreground">
                        {parcelle.nom}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default Predictions;
