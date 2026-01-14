import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { CreateAgriculteurRequestData } from '@/types/auth';
import { 
  User, 
  MapPin, 
  Phone, 
  Sprout,
  FileText,
  AlertCircle,
  Loader2,
  ArrowLeft
} from 'lucide-react';

interface AgriculteurRequestFormProps {
  onSubmit: (data: CreateAgriculteurRequestData) => Promise<void>;
  isLoading?: boolean;
}

const AgriculteurRequestForm = ({ onSubmit, isLoading = false }: AgriculteurRequestFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<CreateAgriculteurRequestData>({
    first_name: '',
    last_name: '',
    location: '',
    phone: '',
    experience: '',
    culture_type: '',
    justification: ''
  });

  const experiences = [
    'Moins d\'1 an',
    '1-3 ans',
    '3-5 ans',
    '5-10 ans',
    'Plus de 10 ans'
  ];

  const cultureTypes = [
    'Céréales (maïs, mil, sorgho)',
    'Légumineuses (arachide, niébé)',
    'Maraîchage (tomates, oignons, carottes)',
    'Fruits (mangues, agrumes, bananes)',
    'Cultures industrielles (coton, canne à sucre)',
    'Élevage (bovins, ovins, volailles)',
    'Autre'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.first_name || !formData.last_name || !formData.location || !formData.phone) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    try {
      await onSubmit(formData);
      toast({
        title: "Demande envoyée",
        description: "Votre demande a été soumise et est en cours de validation",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de votre demande",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (field: keyof CreateAgriculteurRequestData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/visitor/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au dashboard
          </Button>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-green-600 rounded-full">
                <Sprout className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Devenir Agriculteur</h1>
            <p className="text-gray-600 mt-2">
              Rejoignez notre communauté d'agriculteurs et accédez à des outils avancés
            </p>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Formulaire de demande</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informations personnelles */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informations personnelles
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Nom *</Label>
                    <Input
                      id="last_name"
                      type="text"
                      placeholder="Votre nom"
                      value={formData.last_name}
                      onChange={(e) => handleInputChange('last_name', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="first_name">Prénom *</Label>
                    <Input
                      id="first_name"
                      type="text"
                      placeholder="Votre prénom"
                      value={formData.first_name}
                      onChange={(e) => handleInputChange('first_name', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+221XXXXXXXXX"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Localisation *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="location"
                        type="text"
                        placeholder="Votre région/ville"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Expérience agricole */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Sprout className="h-5 w-5" />
                  Expérience agricole
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="experience">Années d'expérience *</Label>
                  <Select 
                    value={formData.experience} 
                    onValueChange={(value) => handleInputChange('experience', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez votre expérience" />
                    </SelectTrigger>
                    <SelectContent>
                      {experiences.map((exp) => (
                        <SelectItem key={exp} value={exp}>
                          {exp}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="culture_type">Type de culture pratiquée *</Label>
                  <Select 
                    value={formData.culture_type} 
                    onValueChange={(value) => handleInputChange('culture_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez votre type de culture" />
                    </SelectTrigger>
                    <SelectContent>
                      {cultureTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Justification */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Message libre
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="justification">
                    Pourquoi souhaitez-vous devenir agriculteur sur AgroviaTech ? *
                  </Label>
                  <Textarea
                    id="justification"
                    placeholder="Décrivez vos motivations, vos projets, vos besoins..."
                    value={formData.justification}
                    onChange={(e) => handleInputChange('justification', e.target.value)}
                    rows={4}
                    required
                  />
                </div>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Votre demande sera étudiée par notre équipe administrative. 
                  Vous recevrez une réponse par email dans les plus brefs délais.
                </AlertDescription>
              </Alert>

              <div className="flex gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/visitor/dashboard')}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    'Envoyer la demande'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgriculteurRequestForm;
