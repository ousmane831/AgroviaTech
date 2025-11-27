import { Alerte } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Droplets, Bug, Cloud, Package, Wheat, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

// Icônes par type d'alerte
const alertIcons = {
  irrigation: Droplets,
  maladie: Bug,
  météo: Cloud,
  stockage: Package,
  récolte: Wheat,
};

// Couleurs par priorité
const priorityColors = {
  haute: 'border-l-destructive',
  moyenne: 'border-l-warning',
  basse: 'border-l-info',
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

  return (
    <Card
      variant="interactive"
      className={cn(
        'border-l-4 animate-slide-up',
        priorityColors[alerte.priorite]
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
              alerte.priorite === 'haute' && 'bg-destructive/10 text-destructive',
              alerte.priorite === 'moyenne' && 'bg-warning/10 text-warning',
              alerte.priorite === 'basse' && 'bg-info/10 text-info'
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between gap-2">
              <Badge variant={alerte.priorite} className="capitalize">
                {alerte.priorite}
              </Badge>
              <span className="text-xs text-muted-foreground">{formattedDate}</span>
            </div>
            {parcelleName && (
              <p className="text-sm font-medium text-foreground">{parcelleName}</p>
            )}
            <p className="text-sm text-muted-foreground">{alerte.message}</p>
          </div>
          {onResolve && alerte.statut === 'active' && (
            <Button
              variant="ghost"
              size="sm"
              className="shrink-0"
              onClick={() => onResolve(alerte.id)}
            >
              <Check className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
