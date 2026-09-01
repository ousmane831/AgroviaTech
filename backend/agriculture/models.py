from django.db import models
from django.conf import settings

class Parcelle(models.Model):
    """Modèle pour les parcelles agricoles"""
    
    STATUT_CHOICES = [
        ('active', 'Active'),
        ('en attente', 'En attente'),
        ('inactive', 'Inactive'),
    ]
    
    TYPE_CULTURE_CHOICES = [
        ('maïs', 'Maïs'),
        ('riz', 'Riz'),
        ('arachide', 'Arachide'),
        ('mil', 'Mil'),
        ('tomate', 'Tomate'),
        ('oignon', 'Oignon'),
        ('autre', 'Autre'),
    ]
    
    nom = models.CharField(max_length=200)
    type_culture = models.CharField(max_length=50, choices=TYPE_CULTURE_CHOICES)
    surface = models.DecimalField(max_digits=10, decimal_places=2)  # en hectares
    localisation = models.CharField(max_length=200)
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='active')
    proprietaire = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='parcelles')
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Parcelle"
        verbose_name_plural = "Parcelles"
        ordering = ['-date_creation']
    
    def __str__(self):
        return f"{self.nom} ({self.type_culture})"

class Recolte(models.Model):
    """Modèle pour les récoltes"""
    
    parcelle = models.ForeignKey(Parcelle, on_delete=models.CASCADE, related_name='recoltes')
    date_recolte = models.DateField()
    quantite = models.DecimalField(max_digits=10, decimal_places=2)  # en kg
    qualite = models.CharField(max_length=50, choices=[
        ('excellente', 'Excellente'),
        ('bonne', 'Bonne'),
        ('moyenne', 'Moyenne'),
        ('faible', 'Faible'),
    ])
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Récolte"
        verbose_name_plural = "Récoltes"
        ordering = ['-date_recolte']
    
    def __str__(self):
        return f"Récolte {self.parcelle.nom} - {self.date_recolte}"

class Alerte(models.Model):
    """Modèle pour les alertes"""
    
    PRIORITE_CHOICES = [
        ('haute', 'Haute'),
        ('moyenne', 'Moyenne'),
        ('basse', 'Basse'),
    ]
    
    TYPE_ALERTE_CHOICES = [
        ('irrigation', 'Irrigation'),
        ('maladie', 'Maladie'),
        ('météo', 'Météo'),
        ('stockage', 'Stockage'),
        ('récolte', 'Récolte'),
    ]
    
    STATUT_CHOICES = [
        ('active', 'Active'),
        ('resolue', 'Résolue'),
        ('ignoree', 'Ignorée'),
    ]
    
    parcelle = models.ForeignKey(Parcelle, on_delete=models.CASCADE, related_name='alertes', null=True, blank=True)
    type_alerte = models.CharField(max_length=50, choices=TYPE_ALERTE_CHOICES)
    priorite = models.CharField(max_length=20, choices=PRIORITE_CHOICES)
    message = models.TextField()
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='active')
    date_creation = models.DateTimeField(auto_now_add=True)
    date_resolution = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        verbose_name = "Alerte"
        verbose_name_plural = "Alertes"
        ordering = ['-date_creation']
    
    def __str__(self):
        return f"{self.type_alerte} - {self.priorite}"

class Prediction(models.Model):
    """Modèle pour les prédictions IA"""
    
    parcelle = models.ForeignKey(Parcelle, on_delete=models.CASCADE, related_name='predictions')
    rendement_prevu = models.DecimalField(max_digits=10, decimal_places=2)  # kg/ha
    pertes_estimees = models.DecimalField(max_digits=5, decimal_places=2)  # pourcentage
    confiance = models.IntegerField()  # pourcentage 0-100
    recommandations = models.JSONField(default=list)
    date_creation = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Prédiction"
        verbose_name_plural = "Prédictions"
        ordering = ['-date_creation']
    
    def __str__(self):
        return f"Prédiction {self.parcelle.nom} - {self.rendement_prevu} kg/ha"
