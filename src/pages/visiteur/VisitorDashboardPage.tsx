import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { VisitorLayout } from '@/components/layout/VisitorLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PublicStats } from '@/types/visitor';
import { useAgriculteurRequest } from '@/hooks/useAgriculteurRequest';
import { useAuth } from '@/hooks/useAuth';
import {
  TrendingUp,
  Users,
  Droplets,
  Smartphone,
  BarChart3,
  ArrowRight,
  Leaf,
  Sprout,
  TreePine,
  BookOpen,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';

// Données de démonstration pour les statistiques publiques
const mockPublicStats: PublicStats[] = [
  {
    id: '1',
    titre: 'Arrachides',
    prix: 520,
    unite: 'FCFA/KG',
    description: 'Prix moyen marché local',
    categorie: 'agricol',
    region: 'Dakar',
    annee: 2024,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    titre: 'Maïs',
    prix: 410,
    unite: 'FCFA/KG',
    description: 'Prix moyen du maïs sec',
    categorie: 'agricol',
    region: 'Thiès',
    annee: 2024,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    titre: 'Tomates',
    prix: 600,
    unite: 'FCFA/KG',
    description: 'Tomates fraîches – production maraîchère',
    categorie: 'marechaire',
    region: 'Dakar',
    annee: 2024,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    titre: 'Oignons',
    prix: 480,
    unite: 'FCFA/KG',
    description: 'Oignons locaux – prix moyen saisonnier',
    categorie: 'marechaire',
    region: 'Thiès',
    annee: 2024,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const regions = ['Dakar', 'Thiès', 'Kédougou', 'Saint-Louis', 'Matam'];


const VisitorDashboardPage = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>(regions[0]);
  const navigate = useNavigate();
  const [stats, setStats] = useState<PublicStats[]>(mockPublicStats);
  const { user, updateRole } = useAuth();
  const { 
    currentRequest, 
    isLoading: requestLoading, 
    hasPendingRequest, 
    hasApprovedRequest, 
    hasRejectedRequest
  } = useAgriculteurRequest();

  // Rediriger automatiquement si la demande est approuvée
  useEffect(() => {
    if (hasApprovedRequest && user?.role === 'VISITEUR') {
      // Mettre à jour le rôle localement et rediriger
      updateRole('AGRICULTEUR');
      navigate('/agriculteur/dashboard');
    }
  }, [hasApprovedRequest, user, updateRole, navigate]);

  const getIconForStat = (categorie: string) => {
    switch (categorie) {
      case 'marechaire':
        return TreePine;
      case 'agricol':
        return Users;
      default:
        return TrendingUp;
    }
  };

  const getVariantForStat = (categorie: string) => {
    switch (categorie) {
      case 'marechaire':
        return 'default';
      case 'agricol':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <VisitorLayout
      title="Dashboard Public"
      subtitle="Statistiques agricoles anonymisées et tendances du secteur"
    >
      {/* Sélecteur de région */}
<div className="mb-6 flex items-center gap-4">
  <label htmlFor="region" className="text-sm font-medium text-green-700">
    Région :
  </label>
  <select
    id="region"
    value={selectedRegion}
    onChange={(e) => setSelectedRegion(e.target.value)}
    className="border border-green-300 rounded-md p-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
  >
    {regions.map(region => (
      <option key={region} value={region}>
        {region}
      </option>
    ))}
  </select>
</div>

      {/* Statistiques principales */}
      <section className="mb-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = getIconForStat(stat.categorie);
            const filteredStats = stats.filter(stat => stat.region === selectedRegion);

            return (
              <StatCard
              title={stat.titre}
              value={`${stat.prix.toLocaleString('fr-FR')} ${stat.unite}`}
              subtitle={`Mis à jour: ${new Date(stat.updated_at).toLocaleTimeString()}`}
              icon={Icon}
              annee={stat.annee}
              variant={getVariantForStat(stat.categorie)}
            />

            );
          })}
        </div>
      </section>

      {/* Section Introduction */}
      <section className="mb-8">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Leaf className="h-5 w-5" />
              Bienvenue sur AgroviaTech
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Découvrez comment la technologie transforme l'agriculture en Afrique. 
              Notre plateforme connecte les agriculteurs, optimise les ressources 
              et augmente les rendements grâce à l'IoT et l'intelligence artificielle.
            </p>
            
            <div className="grid gap-4 md:grid-cols-3">
              <div className="bg-white rounded-lg p-4 border border-green-100">
                <Sprout className="h-8 w-8 text-green-600 mb-2" />
                <h3 className="font-semibold text-green-800 mb-1">Innovation</h3>
                <p className="text-sm text-gray-600">
                  Capteurs IoT, IA, et technologies modernes au service de l'agriculture
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-green-100">
                <Droplets className="h-8 w-8 text-blue-600 mb-2" />
                <h3 className="font-semibold text-blue-800 mb-1">Durabilité</h3>
                <p className="text-sm text-gray-600">
                  Optimisation de l'eau et réduction de l'impact environnemental
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-green-100">
                <Users className="h-8 w-8 text-purple-600 mb-2" />
                <h3 className="font-semibold text-purple-800 mb-1">Communauté</h3>
                <p className="text-sm text-gray-600">
                  Réseau d'agriculteurs partageant connaissances et meilleures pratiques
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Actions disponibles */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Explorez nos fonctionnalités</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Actualités</h3>
              <p className="text-sm text-gray-600 mb-3">
                Dernières nouvelles et innovations agricoles
              </p>
              <Button size="sm" className="w-full" onClick={() => navigate('/visitor/actualites')}>
                Voir les actualités
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Apprendre</h3>
              <p className="text-sm text-gray-600 mb-3">
                Guides et conseils pratiques pour agriculteurs
              </p>
              <Button size="sm" className="w-full" onClick={() => navigate('/visitor/apprendre')}>
                Accéder aux guides
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Carte</h3>
              <p className="text-sm text-gray-600 mb-3">
                Vue d'ensemble des zones agricoles
              </p>
              <Button size="sm" className="w-full" onClick={() => navigate('/visitor/carte')}>
                Explorer la carte
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Leaf className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">IA Démo</h3>
              <p className="text-sm text-gray-600 mb-3">
                Testez notre assistant intelligent
              </p>
              <Button size="sm" className="w-full" onClick={() => navigate('/visitor/demo-ia')}>
                Essayer l'IA
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call-to-action avec statut de demande */}
      <section>
        <Card className="bg-gradient-to-r from-green-600 to-green-700 text-white border-green-600">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-3">Devenir Agriculteur</h2>
            
            {requestLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Chargement du statut de votre demande...</span>
              </div>
            ) : hasPendingRequest ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <Clock className="h-6 w-6" />
                  <Badge className="bg-yellow-100 text-yellow-800 text-lg px-4 py-2">
                    Demande en cours de validation
                  </Badge>
                </div>
                <p className="text-green-100">
                  Votre demande est en cours d'examen par notre équipe administrative.
                  Vous recevrez une réponse par email dans les plus brefs délais.
                </p>
                {currentRequest && (
                  <p className="text-sm text-green-200">
                    Date de demande: {new Date(currentRequest.created_at).toLocaleDateString('fr-FR')}
                  </p>
                )}
              </div>
            ) : hasRejectedRequest ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <XCircle className="h-6 w-6" />
                  <Badge className="bg-red-100 text-red-800 text-lg px-4 py-2">
                    Demande rejetée
                  </Badge>
                </div>
                <p className="text-green-100 mb-4">
                  Votre demande précédente n'a pas été acceptée. 
                  Vous pouvez soumettre une nouvelle demande si vous souhaitez réessayer.
                </p>
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="bg-white text-green-700 hover:bg-gray-100"
                  onClick={() => navigate('/visitor/demande-agriculteur')}
                >
                  <Sprout className="mr-2 h-5 w-5" />
                  Soumettre une nouvelle demande
                </Button>
              </div>
            ) : hasApprovedRequest ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-6 w-6" />
                  <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">
                    Demande approuvée
                  </Badge>
                </div>
                <p className="text-green-100">
                  Félicitations ! Votre demande a été approuvée.
                  Redirection vers votre espace agriculteur...
                </p>
                <div className="flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Configuration de votre espace...</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-green-100 mb-6 max-w-2xl mx-auto">
                  Transformez votre exploitation avec nos technologies IoT et IA. 
                  Accédez à des données en temps réel, recevez des alertes personnalisées 
                  et optimisez vos rendements.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    variant="secondary" 
                    className="bg-white text-green-700 hover:bg-gray-100"
                    onClick={() => navigate('/visitor/demande-agriculteur')}
                  >
                    <Sprout className="mr-2 h-5 w-5" />
                    Devenir Agriculteur
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white text-green-700 hover:bg-white hover:text-green-700"
                  >
                    En savoir plus
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </VisitorLayout>
  );
};

export default VisitorDashboardPage;
