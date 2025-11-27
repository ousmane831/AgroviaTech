import { Prediction, parcelles, cultureIcons } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';

interface PredictionCardProps {
  prediction: Prediction;
}

export function PredictionCard({ prediction }: PredictionCardProps) {
  const parcelle = parcelles.find((p) => p.id === prediction.parcelleId);
  if (!parcelle) return null;

  const confianceColor =
    prediction.confiance >= 85
      ? 'text-success'
      : prediction.confiance >= 70
      ? 'text-warning'
      : 'text-destructive';

  return (
    <Card variant="gradient" className="animate-slide-up">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{cultureIcons[parcelle.typeCulture]}</span>
            <CardTitle className="text-base">{parcelle.nom}</CardTitle>
          </div>
          <Badge variant="info" className="gap-1">
            <Brain className="h-3 w-3" />
            IA
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Métriques principales */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              Rendement prévu
            </div>
            <p className="text-lg font-bold text-foreground">
              {prediction.rendementPrevu.toLocaleString('fr-FR')} kg/ha
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <AlertTriangle className="h-3 w-3" />
              Pertes estimées
            </div>
            <p className="text-lg font-bold text-destructive">
              {prediction.pertesEstimees}%
            </p>
          </div>
        </div>

        {/* Niveau de confiance */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Confiance</span>
            <span className={`font-medium ${confianceColor}`}>
              {prediction.confiance}%
            </span>
          </div>
          <Progress value={prediction.confiance} className="h-2" />
        </div>

        {/* Recommandations */}
        <div className="space-y-2">
          <div className="flex items-center gap-1 text-sm font-medium text-foreground">
            <Lightbulb className="h-4 w-4 text-warning" />
            Recommandations
          </div>
          <ul className="space-y-1">
            {prediction.recommandations.map((rec, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-xs text-muted-foreground"
              >
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {rec}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
