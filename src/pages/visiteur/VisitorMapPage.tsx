import { useState } from 'react';
import { VisitorLayout } from '@/components/layout/VisitorLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  TreePine,
  Droplets,
  Thermometer,
  Cloud,
  Users,
  TrendingUp,
  ZoomIn,
  ZoomOut,
  Layers,
  Filter,
  Activity,
} from 'lucide-react';

interface ZoneInfo {
  id: string;
  nom: string;
  region: string;
  type: 'cereales' | 'legumes' | 'fruits' | 'elevage' | 'mixte';
  surface: number;
  conditions: {
    temperature: string;
    humidite: string;
    pluviometrie: string;
  };
  productions: string[];
  statut: 'active' | 'developpement' | 'potentielle';
}

const mockZones: ZoneInfo[] = [
  {
    id: '1',
    nom: 'Bassin du Sénégal',
    region: 'Saint-Louis',
    type: 'cereales',
    surface: 250000,
    conditions: {
      temperature: '28-35°C',
      humidite: '60-80%',
      pluviometrie: '400-600mm/an'
    },
    productions: ['Riz', 'Maïs', 'Sorgho'],
    statut: 'active'
  },
  {
    id: '2',
    nom: 'Zone de Kaolack',
    region: 'Kaolack-Fatick',
    type: 'cereales',
    surface: 180000,
    conditions: {
      temperature: '25-32°C',
      humidite: '65-75%',
      pluviometrie: '500-700mm/an'
    },
    productions: ['Arachide', 'Mil', 'Niébé'],
    statut: 'active'
  }
];

const VisitorMapPage = () => {
  const [selectedZone, setSelectedZone] = useState<ZoneInfo | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'cereales':
        return TreePine;
      case 'legumes':
        return Activity;
      case 'fruits':
        return Cloud;
      case 'elevage':
        return Users;
      default:
        return MapPin;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'cereales':
        return 'bg-yellow-100 text-yellow-800';
      case 'legumes':
        return 'bg-green-100 text-green-800';
      case 'fruits':
        return 'bg-orange-100 text-orange-800';
      case 'elevage':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'developpement':
        return 'bg-yellow-100 text-yellow-800';
      case 'potentielle':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredZones = mockZones.filter(zone => 
    filterType === 'all' || zone.type === filterType
  );

  return (
    <VisitorLayout
      title="Carte Agricole"
      subtitle="Vue d'ensemble des zones agricoles et conditions environnementales"
    >
      {/* Filtres */}
      <section className="mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filtrer par type:</span>
          </div>
          
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={filterType === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterType('all')}
            >
              Toutes les zones
            </Button>
            <Button
              size="sm"
              variant={filterType === 'cereales' ? 'default' : 'outline'}
              onClick={() => setFilterType('cereales')}
            >
              Céréales
            </Button>
            <Button
              size="sm"
              variant={filterType === 'legumes' ? 'default' : 'outline'}
              onClick={() => setFilterType('legumes')}
            >
              Légumes
            </Button>
          </div>
        </div>
      </section>

      {/* Carte simulée */}
      <section className="mb-8">
        <Card className="h-96 bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Carte interactive</h3>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Layers className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Simulation de carte avec zones cliquables */}
            <div className="relative h-64 bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100">
                {/* Zones cliquables simulées */}
                {filteredZones.map((zone, index) => {
                  const TypeIcon = getTypeIcon(zone.type);
                  const positions = [
                    { top: '20%', left: '15%' },
                    { top: '40%', left: '60%' }
                  ];
                  
                  return (
                    <button
                      key={zone.id}
                      onClick={() => setSelectedZone(zone)}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                        selectedZone?.id === zone.id
                          ? 'bg-green-600 text-white shadow-lg'
                          : 'bg-white text-green-600 shadow-md hover:bg-green-100'
                      }`}
                      style={positions[index % positions.length]}
                    >
                      <TypeIcon className="h-4 w-4" />
                    </button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Liste des zones */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Zones agricoles ({filteredZones.length})
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredZones.map((zone) => {
            const TypeIcon = getTypeIcon(zone.type);
            
            return (
              <Card 
                key={zone.id} 
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedZone?.id === zone.id ? 'ring-2 ring-green-500' : ''
                }`}
                onClick={() => setSelectedZone(zone)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <TypeIcon className="h-5 w-5 text-gray-600" />
                      <Badge className={getTypeColor(zone.type)}>
                        {zone.type}
                      </Badge>
                    </div>
                    <Badge className={getStatutColor(zone.statut)}>
                      {zone.statut}
                    </Badge>
                  </div>

                  <h4 className="font-semibold text-gray-900 mb-1">{zone.nom}</h4>
                  <p className="text-sm text-gray-600 mb-3">{zone.region}</p>

                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Surface:</span>
                      <span className="font-medium">{zone.surface.toLocaleString()} ha</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-3 w-3 text-red-500" />
                      <span className="text-gray-600">{zone.conditions.temperature}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </VisitorLayout>
  );
};

export default VisitorMapPage;
