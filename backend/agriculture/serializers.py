from rest_framework import serializers
from .models import (
    Parcelle,
    Recolte,
    Alerte,
    Prediction,
    MarketOffer,
    MarketNeed,
    MarketNegotiation,
)

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


class MarketOfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketOffer
        fields = '__all__'
        read_only_fields = ['id', 'farmer', 'farmer_name', 'created_at', 'updated_at']


class MarketNeedSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketNeed
        fields = '__all__'
        read_only_fields = ['id', 'buyer', 'buyer_name', 'created_at', 'updated_at']


class MarketNegotiationSerializer(serializers.ModelSerializer):
    offer = MarketOfferSerializer(read_only=True)
    need = MarketNeedSerializer(read_only=True)
    offer_id = serializers.PrimaryKeyRelatedField(source='offer', queryset=MarketOffer.objects.all(), write_only=True)
    need_id = serializers.PrimaryKeyRelatedField(source='need', queryset=MarketNeed.objects.all(), write_only=True)

    class Meta:
        model = MarketNegotiation
        fields = ['id', 'offer', 'need', 'offer_id', 'need_id', 'initiated_by', 'message', 'status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'initiated_by', 'status', 'created_at', 'updated_at']
