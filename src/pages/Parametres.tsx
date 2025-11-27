import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Database, 
  Bell, 
  Shield, 
  Smartphone, 
  Download,
  Info,
  Leaf
} from 'lucide-react';
import { toast } from 'sonner';

/**
 * Page des paramètres
 * Configuration de l'application et informations sur le mode démo
 */
const Parametres = () => {
  const handleExportData = () => {
    toast.success('Données exportées avec succès (simulation)');
  };

  return (
    <MainLayout
      title="Paramètres"
      subtitle="Configuration de votre application AgroviaTech"
    >
      {/* Informations sur le mode démo */}
      <Card className="mb-6 border-primary/30 bg-primary/5">
        <CardContent className="flex items-start gap-4 py-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/20">
            <Info className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">Mode Démonstration</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Cette application fonctionne avec des données simulées pour la présentation au jury.
              Toutes les parcelles, récoltes, alertes et prédictions IA sont générées automatiquement.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="secondary">5 parcelles</Badge>
              <Badge variant="secondary">3 mois d'historique</Badge>
              <Badge variant="secondary">Alertes simulées</Badge>
              <Badge variant="secondary">Prédictions IA</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Configuration générale */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Données
            </CardTitle>
            <CardDescription>
              Gestion des données de l'application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Mode hors-ligne</Label>
                <p className="text-xs text-muted-foreground">
                  Stocker les données localement
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Synchronisation auto</Label>
                <p className="text-xs text-muted-foreground">
                  Synchroniser quand connecté
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <Button variant="outline" className="w-full gap-2" onClick={handleExportData}>
              <Download className="h-4 w-4" />
              Exporter les données
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Paramètres des alertes et notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Alertes irrigation</Label>
                <p className="text-xs text-muted-foreground">
                  Notification quand irrigation nécessaire
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Alertes maladies</Label>
                <p className="text-xs text-muted-foreground">
                  Notification en cas de risque détecté
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Alertes météo</Label>
                <p className="text-xs text-muted-foreground">
                  Prévisions météo importantes
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Sécurité */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Sécurité
            </CardTitle>
            <CardDescription>
              Paramètres de sécurité et confidentialité
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Authentification</Label>
                <p className="text-xs text-muted-foreground">
                  Connexion sécurisée activée
                </p>
              </div>
              <Badge variant="success">Actif</Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Chiffrement des données</Label>
                <p className="text-xs text-muted-foreground">
                  Protection des données sensibles
                </p>
              </div>
              <Badge variant="success">Actif</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Application mobile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Application Mobile
            </CardTitle>
            <CardDescription>
              Accès mobile à AgroviaTech
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Cette application web est responsive et peut être utilisée sur mobile.
              Pour une expérience optimale, vous pouvez l'ajouter à votre écran d'accueil.
            </p>
            <div className="rounded-lg bg-muted p-3">
              <p className="text-xs text-muted-foreground">
                <strong>Sur iOS :</strong> Safari → Partager → Ajouter à l'écran d'accueil
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                <strong>Sur Android :</strong> Chrome → Menu → Ajouter à l'écran d'accueil
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* À propos */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-primary" />
            À propos d'AgroviaTech
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm font-medium text-foreground">Version</p>
              <p className="text-sm text-muted-foreground">1.0.0 (Démo)</p>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Technologies</p>
              <p className="text-sm text-muted-foreground">React, TypeScript, Tailwind</p>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Backend</p>
              <p className="text-sm text-muted-foreground">API REST (simulée)</p>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">IA</p>
              <p className="text-sm text-muted-foreground">Prédictions simulées</p>
            </div>
          </div>
          <Separator className="my-4" />
          <p className="text-xs text-muted-foreground">
            AgroviaTech est une solution de gestion agricole intelligente conçue pour aider
            les agriculteurs à optimiser leurs rendements et réduire les pertes grâce à
            l'analyse de données et l'intelligence artificielle.
          </p>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default Parametres;
