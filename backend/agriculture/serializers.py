from rest_framework import serializers
from .models import Parcelle, Recolte, Alerte, Prediction

class ParcelleSerializer(serializers.ModelSerializer):
    """Serializer pour les parcelles"""
    proprietaire_username = serializers.CharField(source='proprietaire.username', read_only=True)
    
    class Meta:
        model = Parcelle
        fields = ['id', 'nom', 'type_culture', 'surface', 'localisation', 'statut', 'proprietaire', 'proprietaire_username', 'date_creation', 'date_modification']
        read_only_fields = ['id', 'date_creation', 'date_modification']

class RecolteSerializer(serializers.ModelSerializer):
    """Serializer pour les récoltes"""
    parcelle_nom = serializers.CharField(source='parcelle.nom', read_only=True)
    
    class Meta:
        model = Recolte
        fields = ['id', 'parcelle', 'parcelle_nom', 'date_recolte', 'quantite', 'qualite', 'notes', 'created_at']
        read_only_fields = ['id', 'created_at']

class AlerteSerializer(serializers.ModelSerializer):
    """Serializer pour les alertes"""
    parcelle_nom = serializers.CharField(source='parcelle.nom', read_only=True)
    
    class Meta:
        model = Alerte
        fields = ['id', 'parcelle', 'parcelle_nom', 'type_alerte', 'priorite', 'message', 'statut', 'date_creation', 'date_resolution']
        read_only_fields = ['id', 'date_creation', 'date_resolution']

class PredictionSerializer(serializers.ModelSerializer):
    """Serializer pour les prédictions"""
    parcelle_nom = serializers.CharField(source='parcelle.nom', read_only=True)
    
    class Meta:
        model = Prediction
        fields = ['id', 'parcelle', 'parcelle_nom', 'rendement_prevu', 'pertes_estimees', 'confiance', 'recommandations', 'date_creation']
        read_only_fields = ['id', 'date_creation']
