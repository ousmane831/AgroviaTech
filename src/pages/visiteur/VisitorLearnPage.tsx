import { useState, useEffect } from 'react';
import { VisitorLayout } from '@/components/layout/VisitorLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BookOpen,
  Search,
  Filter,
  Clock,
  TrendingUp,
  Users,
  Award,
  Download,
  Play,
  FileText,
  Video,
  Headphones,
  Star,
} from 'lucide-react';

interface Guide {
  id: string;
  titre: string;
  description: string;
  categorie: 'culture' | 'irrigation' | 'maladie' | 'technologie' | 'commercialisation';
  type: 'article' | 'video' | 'audio' | 'pdf';
  duree: string;
  niveau: 'debutant' | 'intermediaire' | 'avance';
  auteur: string;
  popularite: number;
  imageUrl?: string;
}

const mockGuides: Guide[] = [
  {
    id: '1',
    titre: 'Guide complet : Culture du maïs en zone tropicale',
    description: 'Apprenez toutes les étapes de la culture du maïs, de la préparation du sol à la récolte. Ce guide couvre les variétés adaptées, les techniques de plantation.',
    categorie: 'culture',
    type: 'article',
    duree: '15 min',
    niveau: 'debutant',
    auteur: 'Dr. Marie Sow',
    popularite: 95,
    imageUrl: 'https://images.unsplash.com/photo-1592982538623-62692e9bc1fc?w=800'
  },
  {
    id: '2',
    titre: 'Vidéo : Installation de capteurs d humidité',
    description: 'Tutoriel vidéo détaillé pour installer et configurer les capteurs IoT d humidité du sol.',
    categorie: 'technologie',
    type: 'video',
    duree: '8 min',
    niveau: 'intermediaire',
    auteur: 'Équipe technique AgroviaTech',
    popularite: 88,
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'
  }
];

const VisitorLearnPage = () => {
  const [guides, setGuides] = useState<Guide[]>(mockGuides);
  const [filteredGuides, setFilteredGuides] = useState<Guide[]>(mockGuides);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    const filtered = guides.filter(guide => {
      const matchesSearch = guide.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           guide.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || guide.categorie === selectedCategory;
      const matchesType = selectedType === 'all' || guide.type === selectedType;
      return matchesSearch && matchesCategory && matchesType;
    });
    setFilteredGuides(filtered);
  }, [guides, searchTerm, selectedCategory, selectedType]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return Video;
      case 'audio':
        return Headphones;
      case 'pdf':
        return FileText;
      default:
        return BookOpen;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-purple-100 text-purple-800';
      case 'audio':
        return 'bg-green-100 text-green-800';
      case 'pdf':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <VisitorLayout
      title="Apprendre"
      subtitle="Guides pratiques, tutoriels et ressources pour améliorer votre agriculture"
    >
      {/* Filtres */}
      <section className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher un guide..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="w-full md:w-48">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                <SelectItem value="culture">Culture</SelectItem>
                <SelectItem value="irrigation">Irrigation</SelectItem>
                <SelectItem value="maladie">Maladies</SelectItem>
                <SelectItem value="technologie">Technologie</SelectItem>
                <SelectItem value="commercialisation">Commercialisation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Guides */}
      <section className="space-y-6">
        {filteredGuides.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Aucun guide trouvé
              </h3>
              <p className="text-gray-600">
                Essayez de modifier vos critères de recherche.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredGuides.map((guide) => {
              const TypeIcon = getTypeIcon(guide.type);
              
              return (
                <Card key={guide.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {guide.imageUrl && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={guide.imageUrl}
                        alt={guide.titre}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <TypeIcon className="h-4 w-4 text-gray-600" />
                      <Badge className={getTypeColor(guide.type)}>
                        {guide.type}
                      </Badge>
                    </div>

                    <CardHeader className="p-0 mb-3">
                      <CardTitle className="text-lg text-gray-900">
                        {guide.titre}
                      </CardTitle>
                    </CardHeader>

                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {guide.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Par {guide.auteur}
                      </div>
                      
                      <Button size="sm" variant="outline">
                        {guide.type === 'video' ? (
                          <>
                            <Play className="h-3 w-3 mr-1" />
                            Voir
                          </>
                        ) : (
                          <>
                            <BookOpen className="h-3 w-3 mr-1" />
                            Lire
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </VisitorLayout>
  );
};

export default VisitorLearnPage;
