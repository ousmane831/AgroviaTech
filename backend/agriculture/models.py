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

    # Identifiant provenant du dataset externe : P001, P002, etc.
    id_externe = models.CharField(
        max_length=50,
        unique=True,
        null=True,
        blank=True
    )

    type_culture = models.CharField(
        max_length=50,
        choices=TYPE_CULTURE_CHOICES
    )

    # Surface stockée en hectares
    surface = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    localisation = models.CharField(
        max_length=200
    )

    # Informations provenant du dataset
    type_sol = models.CharField(
        max_length=50,
        blank=True,
        default=''
    )

    date_plantation = models.DateField(
        null=True,
        blank=True
    )

    # Culture exacte telle qu'elle existe dans le dataset
    # Exemples : Laitue, Courgette, Radis, Poivron, Carotte
    culture_dataset = models.CharField(
        max_length=100,
        blank=True,
        default=''
    )

    statut = models.CharField(
        max_length=20,
        choices=STATUT_CHOICES,
        default='active'
    )

    proprietaire = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='parcelles'
    )
    est_demo = models.BooleanField(default=False)
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


class MarketOffer(models.Model):
    """Offre de récolte publiée par un agriculteur."""

    STATUS_CHOICES = [
        ('active', 'Active'),
        ('reserved', 'Réservée'),
        ('closed', 'Clôturée'),
    ]
    QUALITY_CHOICES = [
        ('Standard', 'Standard'),
        ('Premium', 'Premium'),
        ('Classe A', 'Classe A'),
    ]

    farmer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='market_offers')
    farmer_name = models.CharField(max_length=160)
    farmer_phone = models.CharField(max_length=30)
    crop = models.CharField(max_length=120)
    region = models.CharField(max_length=120)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    quality = models.CharField(max_length=30, choices=QUALITY_CHOICES)
    available_date = models.DateField()
    price_indicative = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']


class MarketNeed(models.Model):
    """Demande publiée par un visiteur/acheteur."""

    TYPE_CHOICES = [
        ('Grossiste', 'Grossiste'),
        ('Restaurant', 'Restaurant'),
        ('Transformateur', 'Transformateur'),
        ('Distributeur', 'Distributeur'),
    ]
    QUALITY_CHOICES = MarketOffer.QUALITY_CHOICES

    buyer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='market_needs')
    buyer_name = models.CharField(max_length=160)
    buyer_phone = models.CharField(max_length=30)
    crop = models.CharField(max_length=120)
    region = models.CharField(max_length=120)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    quality = models.CharField(max_length=30, choices=QUALITY_CHOICES)
    target_price = models.DecimalField(max_digits=10, decimal_places=2)
    delivery_date = models.DateField()
    buyer_type = models.CharField(max_length=30, choices=TYPE_CHOICES, default='Grossiste')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']


class MarketNegotiation(models.Model):
    """Prise de contact entre une offre et une demande compatibles."""

    STATUS_CHOICES = [
        ('opened', 'Ouverte'),
        ('accepted', 'Acceptée'),
        ('rejected', 'Refusée'),
        ('closed', 'Clôturée'),
    ]

    offer = models.ForeignKey(MarketOffer, on_delete=models.CASCADE, related_name='negotiations')
    need = models.ForeignKey(MarketNeed, on_delete=models.CASCADE, related_name='negotiations')
    initiated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='initiated_market_negotiations')
    message = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='opened')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        constraints = [
            models.UniqueConstraint(fields=['offer', 'need'], name='unique_market_negotiation_pair'),
        ]


class PhotoAnalysis(models.Model):
    """Modèle pour l'analyse de photos de cultures par IA"""
    
    parcelle = models.ForeignKey(Parcelle, on_delete=models.CASCADE, related_name='photo_analyses', null=True, blank=True)
    proprietaire = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='photo_analyses')
    photo = models.ImageField(upload_to='photo_analyses/')
    
    # Résultats de l'analyse
    etat_apparent = models.TextField()
    anomalies = models.JSONField(default=list)
    maturite = models.CharField(max_length=100)
    qualite = models.CharField(max_length=100)
    prescription = models.TextField()
    confiance = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Analyse photo"
        verbose_name_plural = "Analyses photos"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Analyse {self.proprietaire.username} - {self.created_at.strftime('%d/%m/%Y')}"


class MesureSol(models.Model):
    """Mesure provenant des capteurs d'irrigation."""

    parcelle = models.ForeignKey(
        Parcelle,
        on_delete=models.CASCADE,
        related_name='mesures_sol'
    )
    timestamp = models.DateTimeField()
    volume_eau_m3 = models.DecimalField(
        max_digits=10,
        decimal_places=3
    )
    humidite_sol_pct = models.DecimalField(
        max_digits=5,
        decimal_places=2
    )
    capteur_id = models.CharField(max_length=100)

    class Meta:
        verbose_name = "Mesure du sol"
        verbose_name_plural = "Mesures du sol"
        ordering = ['-timestamp']
        indexes = [
            models.Index(
                fields=['parcelle', '-timestamp'],
                name='mesure_parcelle_time_idx'
            ),
        ]

    def __str__(self):
        return f"{self.parcelle.nom} - {self.timestamp}"


class DonneeProduction(models.Model):
    """Historique de production provenant du dataset."""

    parcelle = models.ForeignKey(
        Parcelle,
        on_delete=models.CASCADE,
        related_name='productions_dataset'
    )
    id_production = models.CharField(
        max_length=50,
        unique=True
    )
    date_production = models.DateField()
    rendement_estime = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )
    volume_recolte = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )
    couts_production = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    class Meta:
        verbose_name = "Donnée de production"
        verbose_name_plural = "Données de production"
        ordering = ['-date_production']

    def __str__(self):
        return f"{self.parcelle.nom} - {self.date_production}"


class VenteHistorique(models.Model):
    """Historique des ventes provenant du dataset."""

    parcelle = models.ForeignKey(
        Parcelle,
        on_delete=models.CASCADE,
        related_name='ventes_historiques'
    )
    id_vente = models.CharField(
        max_length=50,
        unique=True
    )
    date_vente = models.DateField()
    recolte_kg = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )
    vendu_kg = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )
    invendu_kg = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )
    prix_unitaire_eur = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    class Meta:
        verbose_name = "Vente historique"
        verbose_name_plural = "Ventes historiques"
        ordering = ['-date_vente']

    def __str__(self):
        return f"{self.parcelle.nom} - {self.date_vente}"


class CultureDataset(models.Model):
    """Données de référence issues du dataset culture.csv."""

    id_culture = models.CharField(max_length=50, unique=True)
    nom_culture = models.CharField(max_length=100)
    type = models.CharField(max_length=100)
    saison = models.CharField(max_length=100)

    duree_cycle_jours = models.PositiveIntegerField()

    rendement_moyen_t_ha = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    besoin_eau_mm_cycle = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    # Identifiants conservés tels quels dans le dataset.
    # Pas de ForeignKey car PARCxxx n'est pas forcément Pxxx.
    id_parcelle_dataset = models.CharField(
        max_length=50,
        blank=True,
        default=''
    )

    id_producteur_dataset = models.CharField(
        max_length=50,
        blank=True,
        default=''
    )

    class Meta:
        verbose_name = "Culture du dataset"
        verbose_name_plural = "Cultures du dataset"
        ordering = ['id_culture']
        indexes = [
            models.Index(
                fields=['id_parcelle_dataset'],
                name='culture_parcelle_idx'
            ),
            models.Index(
                fields=['id_producteur_dataset'],
                name='culture_producteur_idx'
            ),
        ]

    def __str__(self):
        return f"{self.id_culture} - {self.nom_culture}"