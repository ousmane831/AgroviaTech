import { useState } from 'react';
import { VisitorLayout } from '@/components/layout/VisitorLayout';
import { DashboardVoiceAssistant } from '@/components/dashboard/DashboardVoiceAssistant';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Bot,
  MessageSquare,
  Brain,
  TrendingUp,
  Lightbulb,
  Zap,
  Shield,
  Users,
  Clock,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface AIFeature {
  id: string;
  titre: string;
  description: string;
  categorie: 'prediction' | 'conseil' | 'alerte' | 'optimisation';
  icone: any;
  disponible: boolean;
  demo?: string;
}

const mockAIFeatures: AIFeature[] = [
  {
    id: '1',
    titre: 'Assistant Vocal Intelligent',
    description: 'Discutez avec notre IA pour obtenir des conseils personnalisés, des prédictions et des réponses à vos questions agricoles.',
    categorie: 'conseil',
    icone: MessageSquare,
    disponible: true,
    demo: 'Essayez de demander : "Quand devrais-je planter mes tomates ?"'
  },
  {
    id: '2',
    titre: 'Prédiction de Rendement',
    description: 'Analyse prédictive basée sur les données historiques, météo et conditions du sol pour estimer vos futurs rendements.',
    categorie: 'prediction',
    icone: TrendingUp,
    disponible: false,
    demo: 'Nécessite des données de vos parcelles'
  },
  {
    id: '3',
    titre: 'Détection de Maladies',
    description: 'IA qui analyse les images de vos plantes pour détecter les maladies et suggérer des traitements.',
    categorie: 'alerte',
    icone: Shield,
    disponible: false,
    demo: 'Disponible avec compte agriculteur'
  },
  {
    id: '4',
    titre: 'Optimisation d\'Irrigation',
    description: 'Recommandations intelligentes pour optimiser votre irrigation en fonction des prévisions météo et des besoins des cultures.',
    categorie: 'optimisation',
    icone: Brain,
    disponible: false,
    demo: 'Nécessite capteurs IoT connectés'
  }
];

const VisitorAIDemoPage = () => {
  const [selectedFeature, setSelectedFeature] = useState<AIFeature | null>(null);

  const getCategorieColor = (categorie: string) => {
    switch (categorie) {
      case 'prediction':
        return 'bg-blue-100 text-blue-800';
      case 'conseil':
        return 'bg-green-100 text-green-800';
      case 'alerte':
        return 'bg-red-100 text-red-800';
      case 'optimisation':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <VisitorLayout
      title="IA Démo"
      subtitle="Découvrez l'intelligence artificielle au service de l'agriculture"
    >
      {/* Introduction */}
      <section className="mb-8">
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Brain className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  L'IA qui transforme l'agriculture
                </h2>
                <p className="text-gray-600">
                  Nos technologies d'intelligence artificielle aident les agriculteurs à prendre 
                  de meilleures décisions et à augmenter leurs rendements.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">95%</div>
                <div className="text-sm text-gray-600">Précision des prédictions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">+30%</div>
                <div className="text-sm text-gray-600">Augmentation des rendements</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">-40%</div>
                <div className="text-sm text-gray-600">Réduction des pertes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">24/7</div>
                <div className="text-sm text-gray-600">Assistance disponible</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Assistant Vocal - Démo active */}
      <section className="mb-8">
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Sparkles className="h-5 w-5" />
              Assistant Vocal - Démo Gratuite
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-green-50 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">Fonctionnalité complète</span>
              </div>
              <p className="text-sm text-green-700">
                Testez notre assistant vocal intelligent. Posez des questions sur l'agriculture, 
                demandez des conseils, ou discutez de vos projets. L'IA vous répondra en temps réel !
              </p>
            </div>
            
            {/* Intégration de l'assistant vocal */}
            <div className="flex justify-center">
              <DashboardVoiceAssistant />
            </div>
            
            <div className="mt-4 text-center text-sm text-gray-600">
              <Clock className="h-4 w-4 inline mr-1" />
              Disponible 24h/24 et 7j/7 • Gratuit pour les visiteurs
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Autres fonctionnalités IA */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Toutes nos fonctionnalités IA
        </h3>
        <div className="grid gap-6 md:grid-cols-2">
          {mockAIFeatures.map((feature) => {
            const Icon = feature.icone;
            
            return (
              <Card 
                key={feature.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedFeature?.id === feature.id ? 'ring-2 ring-purple-500' : ''
                } ${!feature.disponible ? 'opacity-75' : ''}`}
                onClick={() => setSelectedFeature(feature)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full ${
                      feature.disponible ? 'bg-purple-100' : 'bg-gray-100'
                    }`}>
                      <Icon className={`h-6 w-6 ${
                        feature.disponible ? 'text-purple-600' : 'text-gray-400'
                      }`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900">{feature.titre}</h4>
                        <Badge className={getCategorieColor(feature.categorie)}>
                          {feature.categorie}
                        </Badge>
                        {feature.disponible ? (
                          <Badge className="bg-green-100 text-green-800">
                            Disponible
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800">
                            Compte requis
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-3">{feature.description}</p>
                      
                      {feature.demo && (
                        <div className="bg-gray-50 rounded p-2 text-sm text-gray-700">
                          <Lightbulb className="h-3 w-3 inline mr-1" />
                          {feature.demo}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      {feature.disponible ? (
                        <>
                          <Zap className="h-4 w-4 text-green-500" />
                          <span>Actif maintenant</span>
                        </>
                      ) : (
                        <>
                          <Users className="h-4 w-4 text-gray-400" />
                          <span>Nécessite un compte</span>
                        </>
                      )}
                    </div>
                    
                    <Button size="sm" variant="outline" disabled={!feature.disponible}>
                      {feature.disponible ? 'Essayer' : 'Activer'}
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Détail de la fonctionnalité sélectionnée */}
      {selectedFeature && (
        <section className="mb-8">
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-800">
                <selectedFeature.icone className="h-5 w-5" />
                {selectedFeature.titre}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Description détaillée</h4>
                  <p className="text-gray-600">{selectedFeature.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Avantages</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Précision améliorée des décisions agricoles
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Gain de temps et réduction des coûts
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Accès à l'expertise agricole 24/7
                    </li>
                  </ul>
                </div>

                <div className="flex gap-4">
                  {selectedFeature.disponible ? (
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <Bot className="h-4 w-4 mr-2" />
                      Commencer maintenant
                    </Button>
                  ) : (
                    <Button variant="outline">
                      <Users className="h-4 w-4 mr-2" />
                      Créer un compte pour débloquer
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Call-to-action */}
      <section>
        <Card className="bg-gradient-to-r from-green-600 to-green-600 text-white border-purple-600">
          <CardContent className="p-8 text-center">
            <Bot className="h-12 w-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3">
              L'agriculture de demain, aujourd'hui
            </h2>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              Rejoignez des milliers d'agriculteurs qui utilisent déjà notre IA 
              pour transformer leurs exploitations. Accédez à toutes nos fonctionnalités 
              et boostez votre productivité.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" className="bg-white text-green-700 hover:bg-gray-100">
                Créer un compte gratuit
              </Button>
              <Button variant="outline" className="border-white text-green-700 hover:bg-white hover:text-green-700">
                En savoir plus sur l'IA
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </VisitorLayout>
  );
};

export default VisitorAIDemoPage;
