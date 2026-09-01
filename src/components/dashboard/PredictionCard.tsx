import { Prediction, parcelles, cultureIcons } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  const confianceBg =
    prediction.confiance >= 85
      ? 'bg-success/20'
      : prediction.confiance >= 70
      ? 'bg-warning/20'
      : 'bg-destructive/20';

  return (
    <Card className="glass-effect hover-lift animate-slide-up border-2 border-primary/30 shadow-glow">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-2xl shadow-lg">
              {cultureIcons[parcelle.typeCulture]}
            </div>
            <div>
              <CardTitle className="text-base font-semibold">{parcelle.nom}</CardTitle>
              <p className="text-xs text-muted-foreground capitalize">{parcelle.typeCulture}</p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-accent/20 to-accent/10 text-accent border-accent/30 font-semibold gap-1 shadow-sm">
            <Sparkles className="h-3 w-3" />
            IA
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Métriques principales */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 p-3 rounded-xl bg-gradient-to-br from-success/10 to-success/5 border border-success/20">
            <div className="flex items-center gap-2 text-xs font-semibold text-success">
              <TrendingUp className="h-3 w-3" />
              Rendement prévu
            </div>
            <p className="text-xl font-bold text-foreground">
              {prediction.rendementPrevu.toLocaleString('fr-FR')} kg/ha
            </p>
          </div>
          <div className="space-y-2 p-3 rounded-xl bg-gradient-to-br from-destructive/10 to-destructive/5 border border-destructive/20">
            <div className="flex items-center gap-2 text-xs font-semibold text-destructive">
              <AlertTriangle className="h-3 w-3" />
              Pertes estimées
            </div>
            <p className="text-xl font-bold text-destructive">
              {prediction.pertesEstimees}%
            </p>
          </div>
        </div>

        {/* Niveau de confiance */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-muted-foreground">Confiance IA</span>
            <span className={cn('font-bold text-lg', confianceColor)}>
              {prediction.confiance}%
            </span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className={cn('h-full rounded-full transition-all duration-500', confianceBg)}
              style={{ width: `${prediction.confiance}%` }}
            />
          </div>
        </div>

        {/* Recommandations */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Lightbulb className="h-4 w-4 text-accent" />
            Recommandations IA
          </div>
          <ul className="space-y-2">
            {prediction.recommandations.map((rec, index) => (
              <li
                key={index}
                className="flex items-start gap-3 text-sm text-muted-foreground p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent shadow-glow" />
                <span className="leading-relaxed">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
