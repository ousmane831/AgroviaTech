from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import User
from .permissions import IsAdminUser
from .serializers import UserSerializer, UserRegistrationSerializer, CustomTokenObtainPairSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    """Vue personnalisée pour l'obtention du token JWT"""
    serializer_class = CustomTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    """Vue pour l'inscription des utilisateurs"""
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UserRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)
        user_data = UserSerializer(user).data

        return Response({
            'user': user_data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)

class UserProfileView(generics.RetrieveUpdateAPIView):
    """Vue pour le profil utilisateur"""
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user

class UserListView(generics.ListAPIView):
    """Vue pour la liste des utilisateurs (admin only)"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def get_queryset(self):
        return User.objects.all()


@api_view(['PATCH'])
@permission_classes([IsAuthenticated, IsAdminUser])
def update_user_role(request, user_id):
    """Met à jour le rôle d'un utilisateur par un administrateur."""
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return Response({'detail': 'Utilisateur introuvable.'}, status=status.HTTP_404_NOT_FOUND)

    role = (request.data.get('role') or '').lower()
    if role not in {'admin', 'farmer', 'visitor'}:
        return Response({'detail': 'Rôle invalide.'}, status=status.HTTP_400_BAD_REQUEST)

    user.role = role
    user.save(update_fields=['role', 'updated_at'])
    return Response(UserSerializer(user).data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def request_farmer_account(request):
    """Vue pour demander un compte agriculteur"""
    data = request.data
    # Logique pour créer une demande de compte agriculteur
    return Response({
        'message': 'Demande de compte agriculteur envoyée avec succès',
        'status': 'pending'
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def approve_farmer_account(request, user_id):
    """Active un compte agriculteur après validation admin."""
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return Response({'detail': 'Utilisateur introuvable.'}, status=status.HTTP_404_NOT_FOUND)

    if user.role != 'farmer':
        return Response({'detail': 'Cet utilisateur n’est pas un agriculteur.'}, status=status.HTTP_400_BAD_REQUEST)

    user.account_status = 'approved'
    user.est_actif = True
    user.save(update_fields=['account_status', 'est_actif', 'updated_at'])

    return Response({
        'message': 'Compte agriculteur validé avec succès.',
        'user': UserSerializer(user).data,
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def reject_farmer_account(request, user_id):
    """Bloque un compte agriculteur après rejet admin."""
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return Response({'detail': 'Utilisateur introuvable.'}, status=status.HTTP_404_NOT_FOUND)

    if user.role != 'farmer':
        return Response({'detail': 'Cet utilisateur n’est pas un agriculteur.'}, status=status.HTTP_400_BAD_REQUEST)

    user.account_status = 'rejected'
    user.est_actif = False
    user.save(update_fields=['account_status', 'est_actif', 'updated_at'])

    return Response({
        'message': 'Compte agriculteur rejeté et désactivé.',
        'user': UserSerializer(user).data,
    }, status=status.HTTP_200_OK)
