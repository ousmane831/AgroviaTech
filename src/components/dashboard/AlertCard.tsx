import { Alerte } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Droplets, Bug, Cloud, Package, Wheat, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Icônes par type d'alerte
const alertIcons = {
  irrigation: Droplets,
  maladie: Bug,
  météo: Cloud,
  stockage: Package,
  récolte: Wheat,
};

// Styles par priorité
const priorityStyles = {
  haute: {
    border: 'border-destructive/50 bg-destructive/5',
    icon: 'bg-gradient-to-br from-destructive/20 to-destructive/10 text-destructive',
    badge: 'bg-destructive/20 text-destructive border-destructive/30',
    glow: 'shadow-glow'
  },
  moyenne: {
    border: 'border-warning/50 bg-warning/5',
    icon: 'bg-gradient-to-br from-warning/20 to-warning/10 text-warning',
    badge: 'bg-warning/20 text-warning border-warning/30',
    glow: 'shadow-md'
  },
  basse: {
    border: 'border-info/50 bg-info/5',
    icon: 'bg-gradient-to-br from-info/20 to-info/10 text-info',
    badge: 'bg-info/20 text-info border-info/30',
    glow: 'shadow-sm'
  },
};

interface AlertCardProps {
  alerte: Alerte;
  parcelleName?: string;
  onResolve?: (id: string) => void;
}

export function AlertCard({ alerte, parcelleName, onResolve }: AlertCardProps) {
  const Icon = alertIcons[alerte.type];
  const formattedDate = new Date(alerte.date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  const style = priorityStyles[alerte.priorite];

  return (
    <Card
      className={cn(
        'glass-effect hover-lift animate-slide-up border-2 transition-all duration-300',
        style.border,
        style.glow
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-lg transform hover:scale-110 transition-transform duration-200',
              style.icon
            )}
          >
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Badge className={cn('font-semibold border capitalize', style.badge)}>
                <AlertCircle className="h-3 w-3 mr-1" />
                {alerte.priorite}
              </Badge>
              <span className="text-xs text-muted-foreground font-medium">{formattedDate}</span>
            </div>
            {parcelleName && (
              <p className="text-sm font-semibold text-foreground">{parcelleName}</p>
            )}
            <p className="text-sm text-muted-foreground leading-relaxed">{alerte.message}</p>
          </div>
          {onResolve && alerte.statut === 'active' && (
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 hover:bg-success/10 hover:text-success hover:border-success/30 transition-colors"
              onClick={() => onResolve(alerte.id)}
            >
              <Check className="h-4 w-4 mr-1" />
              Résoudre
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
