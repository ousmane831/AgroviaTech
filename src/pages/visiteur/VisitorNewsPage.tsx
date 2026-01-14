import { useState, useEffect } from 'react';
import { VisitorLayout } from '@/components/layout/VisitorLayout';
import { NewsPublic } from '@/types/visitor';
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
  Newspaper,
  Calendar,
  Search,
  Filter,
  TrendingUp,
  Lightbulb,
  CalendarDays,
  Star,
} from 'lucide-react';

// Données de démonstration pour les actualités
const mockNews: NewsPublic[] = [
  {
    id: '1',
    titre: "Nouvelle technologie IoT pour l'agriculture africaine",
    contenu: `AgroviaTech déploie des capteurs intelligents pour surveiller l''humidité des sols en temps réel. Cette innovation permet aux agriculteurs d''optimiser leur irrigation et d''économiser jusqu''à 30% d''eau.

Les capteurs, installés directement dans les champs, transmettent des données toutes les heures via une connexion satellitaire. Les agriculteurs reçoivent des alertes sur leur téléphone mobile lorsque l''humidité atteint un seuil critique.

Cette technologie a déjà été testée avec succès dans plus de 50 exploitations au Sénégal et au Mali, avec des résultats impressionnants : augmentation des rendements de 25% et réduction de 40% de la consommation d''eau.`,
    image_url: 'https://images.unsplash.com/photo-1592982538623-62692e9bc1fc?w=800',
    auteur: 'AgroviaTech',
    categorie: 'innovation',
    created_at: '2024-12-01T10:00:00Z',
    updated_at: '2024-12-01T10:00:00Z',
    published: true
  },
  {
    id: '2',
    titre: "Conseils : Préparer votre terrain pour la saison des pluies",
    contenu: `Avec l''approche de la saison des pluies, découvrez nos meilleures pratiques pour préparer vos champs :

1. **Analyse du sol** : Faites tester votre sol pour connaître sa composition et ses besoins en nutriments.

2. **Choix des semences** : Sélectionnez des variétés adaptées à votre région et résistantes aux maladies locales.

3. **Techniques de conservation** : Mettez en place des systèmes de collecte d''eau de pluie pour l''irrigation.

4. **Planification** : Établissez un calendrier de plantation basé sur les prévisions météorologiques.

Nos experts agronomes sont disponibles pour vous accompagner dans chaque étape.`,
    image_url: 'https://images.unsplash.com/photo-1605000797499-95a51c5269f9?w=800',
    auteur: 'AgroviaTech',
    categorie: 'conseil',
    created_at: '2024-11-28T14:30:00Z',
    updated_at: '2024-11-28T14:30:00Z',
    published: true
  },
  {
    id: '3',
    titre: "Formation : Techniques de culture bio",
    contenu: `Rejoignez notre prochain atelier sur l''agriculture biologique !

**Programme de la formation :**
- Jour 1 : Principes de l'agriculture biologique
- Jour 2 : Gestion naturelle des ravageurs
- Jour 3 : Compostage et fertilisation naturelle
- Jour 4 : Commercialisation des produits bio

**Dates** : 15-18 Décembre 2024
**Lieu** : Centre de formation AgroviaTech, Dakar
**Coût** : Gratuit pour les agriculteurs inscrits

Places limitées à 30 participants. Inscrivez-vous dès maintenant !`,
    image_url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800',
    auteur: 'AgroviaTech',
    categorie: 'evenement',
    created_at: '2024-11-25T09:00:00Z',
    updated_at: '2024-11-25T09:00:00Z',
    published: true
  }
];

const VisitorNewsPage = () => {
  const [news, setNews] = useState<NewsPublic[]>(mockNews);
  const [filteredNews, setFilteredNews] = useState<NewsPublic[]>(mockNews);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const filtered = news.filter(item => {
      const matchesSearch = item.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.contenu.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.categorie === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    setFilteredNews(filtered);
  }, [news, searchTerm, selectedCategory]);

  const getCategoryIcon = (categorie: string) => {
    switch (categorie) {
      case 'innovation':
        return Lightbulb;
      case 'conseil':
        return TrendingUp;
      case 'evenement':
        return CalendarDays;
      default:
        return Newspaper;
    }
  };

  const getCategoryColor = (categorie: string) => {
    switch (categorie) {
      case 'innovation':
        return 'bg-blue-100 text-blue-800';
      case 'conseil':
        return 'bg-green-100 text-green-800';
      case 'evenement':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <VisitorLayout
      title="Actualités Agricoles"
      subtitle="Dernières nouvelles et innovations du secteur agricole"
    >
      {/* Filtres */}
      <section className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher une actualité..."
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
                <SelectItem value="innovation">Innovation</SelectItem>
                <SelectItem value="conseil">Conseils</SelectItem>
                <SelectItem value="evenement">Événements</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="space-y-6">
        {filteredNews.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Newspaper className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Aucune actualité trouvée
              </h3>
              <p className="text-gray-600">
                Essayez de modifier vos critères de recherche.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNews.map((article) => {
            const CategoryIcon = getCategoryIcon(article.categorie);
            return (
              <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="md:flex">
                  {article.image_url && (
                    <div className="md:w-1/3">
                      <img
                        src={article.image_url}
                        alt={article.titre}
                        className="w-full h-48 md:h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <CategoryIcon className="h-5 w-5 text-gray-600" />
                        <Badge className={getCategoryColor(article.categorie)}>
                          {article.categorie}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        {formatDate(article.created_at)}
                      </div>
                    </div>

                    <CardHeader className="p-0 mb-4">
                      <CardTitle className="text-xl text-gray-900">
                        {article.titre}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="p-0">
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {article.contenu}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm text-gray-600">
                            Par {article.auteur}
                          </span>
                        </div>
                        
                        <Button variant="outline" size="sm">
                          Lire la suite
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </section>

      {/* Newsletter */}
      <section className="mt-12">
        <Card className="bg-gradient-to-r from-green-600 to-green-700 text-white border-green-600">
          <CardContent className="p-8 text-center">
            <Newspaper className="h-12 w-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3">
              Restez informé
            </h2>
            <p className="text-green-100 mb-6 max-w-2xl mx-auto">
              Abonnez-vous à notre newsletter pour recevoir les dernières actualités 
              agricoles et innovations directement dans votre boîte mail.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                placeholder="Votre adresse email"
                className="bg-white text-gray-900 placeholder-gray-500"
              />
              <Button variant="secondary" className="bg-white text-green-700 hover:bg-gray-100">
                S'abonner
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </VisitorLayout>
  );
};

export default VisitorNewsPage;
