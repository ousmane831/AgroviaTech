import { Parcelle, cultureIcons } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Ruler, TrendingUp, Droplets } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ParcelleCardProps {
  parcelle: Parcelle;
  onClick?: () => void;
}

export function ParcelleCard({ parcelle, onClick }: ParcelleCardProps) {
  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'active': return 'bg-success/20 text-success border-success/30';
      case 'en attente': return 'bg-warning/20 text-warning border-warning/30';
      case 'inactive': return 'bg-muted/20 text-muted-foreground border-muted/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  return (
    <Card
      className={cn(
        'glass-effect hover-lift animate-slide-up cursor-pointer border-2 transition-all duration-300',
        parcelle.statut === 'active' ? 'border-primary/30 hover:border-primary/50' : 'border-muted/30'
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg',
              parcelle.statut === 'active' ? 'bg-gradient-to-br from-primary/30 to-primary/10' : 'bg-gradient-to-br from-muted to-muted/50'
            )}>
              {cultureIcons[parcelle.typeCulture]}
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">{parcelle.nom}</CardTitle>
              <p className="text-xs text-muted-foreground capitalize">{parcelle.typeCulture}</p>
            </div>
          </div>
          <Badge className={cn('font-semibold border', getStatusColor(parcelle.statut))}>
            {parcelle.statut}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
            <Ruler className="h-4 w-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Surface</p>
              <p className="text-sm font-semibold text-foreground">{parcelle.surface} ha</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
            <MapPin className="h-4 w-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Localisation</p>
              <p className="text-sm font-semibold text-foreground truncate">{parcelle.localisation}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <TrendingUp className="h-3 w-3" />
            <span>Rendement: {Math.floor(Math.random() * 30 + 70)}%</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Droplets className="h-3 w-3" />
            <span>Humidité: {Math.floor(Math.random() * 40 + 40)}%</span>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground text-center pt-2">
          Créée le {new Date(parcelle.dateCreation).toLocaleDateString('fr-FR')}
        </p>
      </CardContent>
    </Card>
  );
}
