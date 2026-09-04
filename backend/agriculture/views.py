from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from django.db.models import Sum
from django.db import IntegrityError
from django.db.models import Q
from django.utils import timezone
from .models import Parcelle, Recolte, Alerte, Prediction, MarketOffer, MarketNeed, MarketNegotiation
from .serializers import (
    ParcelleSerializer, RecolteSerializer, AlerteSerializer, PredictionSerializer,
    MarketOfferSerializer, MarketNeedSerializer, MarketNegotiationSerializer,
)

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


def _is_role(user, role):
    return getattr(user, 'role', '') == role


class MarketOfferListCreateView(generics.ListCreateAPIView):
    serializer_class = MarketOfferSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return MarketOffer.objects.select_related('farmer').all()

    def create(self, request, *args, **kwargs):
        if not _is_role(request.user, 'farmer'):
            return Response({'detail': 'Seul un agriculteur peut publier une récolte.'}, status=status.HTTP_403_FORBIDDEN)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(
            farmer=request.user,
            farmer_name=f'{request.user.prenom} {request.user.nom}'.strip() or request.user.email,
        )
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class MarketNeedListCreateView(generics.ListCreateAPIView):
    serializer_class = MarketNeedSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return MarketNeed.objects.select_related('buyer').all()

    def create(self, request, *args, **kwargs):
        if not _is_role(request.user, 'visitor'):
            return Response({'detail': 'Seul un visiteur/acheteur peut publier une demande.'}, status=status.HTTP_403_FORBIDDEN)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(
            buyer=request.user,
            buyer_name=f'{request.user.prenom} {request.user.nom}'.strip() or request.user.email,
        )
        return Response(serializer.data, status=status.HTTP_201_CREATED)


def _match_score(offer, need):
    quality_scores = {'Standard': 1, 'Classe A': 1.2, 'Premium': 1.4}
    quality = min(25, round((quality_scores[need.quality] / quality_scores[offer.quality]) * 20))
    price = min(20, max(5, round((1 - abs(float(need.target_price) - float(offer.price_indicative)) / 200) * 20)))
    quantity = min(20, round((min(float(need.quantity), float(offer.quantity)) / max(float(need.quantity), float(offer.quantity))) * 20))
    return min(99, max(65, 35 + quality + price + quantity))


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def market_matches(request):
    offers = MarketOffer.objects.filter(status='active')
    needs = MarketNeed.objects.all()
    if _is_role(request.user, 'farmer'):
        offers = offers.filter(farmer=request.user)
    elif _is_role(request.user, 'visitor'):
        needs = needs.filter(buyer=request.user)
    else:
        return Response({'detail': 'Seuls les agriculteurs et acheteurs peuvent consulter les correspondances.'}, status=status.HTTP_403_FORBIDDEN)
    matches = []
    for offer in offers:
        for need in needs:
            if offer.crop.lower() != need.crop.lower() or offer.region.lower() != need.region.lower():
                continue
            score = _match_score(offer, need)
            matches.append({
                'id': f'{offer.id}-{need.id}',
                'offer_id': offer.id,
                'need_id': need.id,
                'buyer_name': need.buyer_name,
                'buyer_phone': need.buyer_phone,
                'farmer_name': offer.farmer_name,
                'farmer_phone': offer.farmer_phone,
                'crop': offer.crop,
                'region': offer.region,
                'quantity': min(float(offer.quantity), float(need.quantity)),
                'quality': offer.quality,
                'score': score,
                'suggested_price': round((float(offer.price_indicative) + float(need.target_price)) / 2),
                'status': 'match' if score >= 90 else 'negociation',
            })
    return Response(matches)


class MarketNegotiationListCreateView(generics.ListCreateAPIView):
    serializer_class = MarketNegotiationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return MarketNegotiation.objects.filter(
            Q(offer__farmer=self.request.user) | Q(need__buyer=self.request.user)
        ).select_related('offer', 'need')

    def create(self, request, *args, **kwargs):
        offer_id = request.data.get('offer_id')
        need_id = request.data.get('need_id')
        try:
            offer = MarketOffer.objects.get(pk=offer_id, status='active')
            need = MarketNeed.objects.get(pk=need_id)
        except (MarketOffer.DoesNotExist, MarketNeed.DoesNotExist):
            return Response({'detail': 'Offre ou demande introuvable.'}, status=status.HTTP_404_NOT_FOUND)

        if request.user.id not in {offer.farmer_id, need.buyer_id}:
            return Response({'detail': 'Vous ne participez pas à cette correspondance.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            negotiation = serializer.save(initiated_by=request.user)
        except IntegrityError:
            return Response({'detail': 'Une négociation existe déjà pour cette correspondance.'}, status=status.HTTP_409_CONFLICT)
        return Response(self.get_serializer(negotiation).data, status=status.HTTP_201_CREATED)
