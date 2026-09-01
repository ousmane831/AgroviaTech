from django.contrib import admin
from .models import Parcelle, Recolte, Alerte, Prediction

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
