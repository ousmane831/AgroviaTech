from django.contrib import admin
from .models import (
    Parcelle,
    Recolte,
    Alerte,
    Prediction,
    MarketOffer,
    MarketNeed,
    MarketNegotiation,
)

@admin.register(Parcelle)
class ParcelleAdmin(admin.ModelAdmin):
    list_display = ['nom', 'type_culture', 'surface', 'localisation', 'statut', 'proprietaire', 'date_creation']
    list_filter = ['statut', 'type_culture', 'date_creation']
    search_fields = ['nom', 'localisation', 'proprietaire__username']
    ordering = ['-date_creation']

@admin.register(Recolte)
class RecolteAdmin(admin.ModelAdmin):
    list_display = ['parcelle', 'date_recolte', 'quantite', 'qualite', 'created_at']
    list_filter = ['qualite', 'date_recolte']
    search_fields = ['parcelle__nom']
    ordering = ['-date_recolte']

@admin.register(Alerte)
class AlerteAdmin(admin.ModelAdmin):
    list_display = ['type_alerte', 'priorite', 'statut', 'parcelle', 'date_creation']
    list_filter = ['type_alerte', 'priorite', 'statut', 'date_creation']
    search_fields = ['message', 'parcelle__nom']
    ordering = ['-date_creation']

@admin.register(Prediction)
class PredictionAdmin(admin.ModelAdmin):
    list_display = ['parcelle', 'rendement_prevu', 'pertes_estimees', 'confiance', 'date_creation']
    list_filter = ['confiance', 'date_creation']
    search_fields = ['parcelle__nom']
    ordering = ['-date_creation']


@admin.register(MarketOffer)
class MarketOfferAdmin(admin.ModelAdmin):
    list_display = [
        'crop',
        'farmer_name',
        'farmer_phone',
        'region',
        'quantity',
        'quality',
        'price_indicative',
        'status',
        'available_date',
        'created_at',
    ]
    list_filter = ['status', 'quality', 'region', 'available_date', 'created_at']
    search_fields = ['crop', 'region', 'farmer_name', 'farmer_phone', 'farmer__username', 'farmer__email']
    ordering = ['-created_at']
    readonly_fields = ['farmer', 'farmer_name', 'created_at', 'updated_at']


@admin.register(MarketNeed)
class MarketNeedAdmin(admin.ModelAdmin):
    list_display = [
        'crop',
        'buyer_name',
        'buyer_phone',
        'region',
        'quantity',
        'quality',
        'target_price',
        'buyer_type',
        'delivery_date',
        'created_at',
    ]
    list_filter = ['buyer_type', 'quality', 'region', 'delivery_date', 'created_at']
    search_fields = ['crop', 'region', 'buyer_name', 'buyer_phone', 'buyer__username', 'buyer__email']
    ordering = ['-created_at']
    readonly_fields = ['buyer', 'buyer_name', 'created_at', 'updated_at']


@admin.register(MarketNegotiation)
class MarketNegotiationAdmin(admin.ModelAdmin):
    list_display = ['offer', 'need', 'initiated_by', 'status', 'created_at', 'updated_at']
    list_filter = ['status', 'created_at', 'updated_at']
    search_fields = [
        'offer__crop',
        'offer__farmer_name',
        'need__crop',
        'need__buyer_name',
        'initiated_by__username',
        'initiated_by__email',
        'message',
    ]
    ordering = ['-created_at']
    readonly_fields = ['offer', 'need', 'initiated_by', 'created_at', 'updated_at']
