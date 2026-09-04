from django.urls import path
from .views import (
    AlerteDetailView,
    AlerteListCreateView,
    ParcelleDetailView,
    ParcelleListCreateView,
    PredictionDetailView,
    PredictionListView,
    RecolteDetailView,
    RecolteListCreateView,
    resolve_alerte,
    statistiques,
    MarketOfferListCreateView,
    MarketNeedListCreateView,
    MarketNegotiationListCreateView,
    market_matches,
)

urlpatterns = [
    path('parcelles/', ParcelleListCreateView.as_view(), name='parcelles-list-create'),
    path('parcelles/<int:pk>/', ParcelleDetailView.as_view(), name='parcelles-detail'),
    path('recoltes/', RecolteListCreateView.as_view(), name='recoltes-list-create'),
    path('recoltes/<int:pk>/', RecolteDetailView.as_view(), name='recoltes-detail'),
    path('alertes/', AlerteListCreateView.as_view(), name='alertes-list-create'),
    path('alertes/<int:pk>/', AlerteDetailView.as_view(), name='alertes-detail'),
    path('alertes/<int:pk>/resoudre/', resolve_alerte, name='resolve_alerte'),
    path('predictions/', PredictionListView.as_view(), name='predictions-list'),
    path('predictions/<int:pk>/', PredictionDetailView.as_view(), name='predictions-detail'),
    path('statistiques/', statistiques, name='agriculture-statistiques'),
    path('market/offers/', MarketOfferListCreateView.as_view(), name='market-offers'),
    path('market/needs/', MarketNeedListCreateView.as_view(), name='market-needs'),
    path('market/matches/', market_matches, name='market-matches'),
    path('market/negotiations/', MarketNegotiationListCreateView.as_view(), name='market-negotiations'),
]
