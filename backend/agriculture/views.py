from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from django.db.models import Sum
from django.utils import timezone
from .models import Parcelle, Recolte, Alerte, Prediction
from .serializers import ParcelleSerializer, RecolteSerializer, AlerteSerializer, PredictionSerializer

class ParcelleListCreateView(generics.ListCreateAPIView):
    """Vue pour lister et créer des parcelles"""
    serializer_class = ParcelleSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['statut', 'type_culture']
    search_fields = ['nom', 'localisation']
    ordering_fields = ['date_creation', 'surface', 'nom']
    ordering = ['-date_creation']
    
    def get_queryset(self):
        return Parcelle.objects.filter(proprietaire=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(proprietaire=self.request.user)

class ParcelleDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Vue pour les détails d'une parcelle"""
    serializer_class = ParcelleSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Parcelle.objects.filter(proprietaire=self.request.user)

class RecolteListCreateView(generics.ListCreateAPIView):
    """Vue pour lister et créer des récoltes"""
    serializer_class = RecolteSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['parcelle', 'qualite']
    ordering_fields = ['date_recolte', 'quantite']
    ordering = ['-date_recolte']
    
    def get_queryset(self):
        return Recolte.objects.filter(parcelle__proprietaire=self.request.user)

class RecolteDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Vue pour les détails d'une récolte"""
    serializer_class = RecolteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Recolte.objects.filter(parcelle__proprietaire=self.request.user)

class AlerteListCreateView(generics.ListCreateAPIView):
    """Vue pour lister et créer des alertes"""
    serializer_class = AlerteSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['statut', 'type_alerte', 'priorite']
    ordering_fields = ['date_creation', 'priorite']
    ordering = ['-date_creation']
    
    def get_queryset(self):
        return Alerte.objects.filter(parcelle__proprietaire=self.request.user)

class AlerteDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Vue pour les détails d'une alerte"""
    serializer_class = AlerteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Alerte.objects.filter(parcelle__proprietaire=self.request.user)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def resolve_alerte(request, pk):
    """Vue pour résoudre une alerte"""
    try:
        alerte = Alerte.objects.get(pk=pk, parcelle__proprietaire=request.user)
        alerte.statut = 'resolue'
        alerte.date_resolution = timezone.now()
        alerte.save()
        return Response({'message': 'Alerte résolue avec succès'}, status=status.HTTP_200_OK)
    except Alerte.DoesNotExist:
        return Response({'error': 'Alerte non trouvée'}, status=status.HTTP_404_NOT_FOUND)

class PredictionListView(generics.ListAPIView):
    """Vue pour lister les prédictions"""
    serializer_class = PredictionSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['parcelle']
    ordering_fields = ['date_creation', 'confiance']
    ordering = ['-date_creation']
    
    def get_queryset(self):
        return Prediction.objects.filter(parcelle__proprietaire=self.request.user)

class PredictionDetailView(generics.RetrieveAPIView):
    """Vue pour les détails d'une prédiction"""
    serializer_class = PredictionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Prediction.objects.filter(parcelle__proprietaire=self.request.user)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def statistiques(request):
    """Vue pour les statistiques de l'agriculteur"""
    user = request.user
    parcelles = Parcelle.objects.filter(proprietaire=user)
    
    total_surface = parcelles.aggregate(total=Sum('surface'))['total'] or 0
    total_recoltes = Recolte.objects.filter(parcelle__proprietaire=user).count()
    alertes_actives = Alerte.objects.filter(parcelle__proprietaire=user, statut='active').count()
    
    return Response({
        'total_parcelles': parcelles.count(),
        'total_surface': total_surface,
        'total_recoltes': total_recoltes,
        'alertes_actives': alertes_actives,
    })
