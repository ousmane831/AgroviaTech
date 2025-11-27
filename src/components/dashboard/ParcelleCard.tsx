import { Parcelle, cultureIcons } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Ruler } from 'lucide-react';

interface ParcelleCardProps {
  parcelle: Parcelle;
  onClick?: () => void;
}

export function ParcelleCard({ parcelle, onClick }: ParcelleCardProps) {
  return (
    <Card
      variant="interactive"
      className="animate-slide-up cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{cultureIcons[parcelle.typeCulture]}</span>
            <CardTitle className="text-lg">{parcelle.nom}</CardTitle>
          </div>
          <Badge variant={parcelle.statut}>{parcelle.statut}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Ruler className="h-4 w-4" />
            <span>{parcelle.surface} ha</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{parcelle.localisation}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium capitalize text-foreground">
            {parcelle.typeCulture}
          </span>
          <span className="text-xs text-muted-foreground">
            Créée le {new Date(parcelle.dateCreation).toLocaleDateString('fr-FR')}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
