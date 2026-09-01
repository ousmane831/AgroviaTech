from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """Serializer pour le modèle User"""
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'prenom', 'nom', 'role', 'account_status', 'telephone', 'region', 'adresse', 'est_actif', 'created_at']
        read_only_fields = ['id', 'created_at']

class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer pour l'inscription"""
    username = serializers.CharField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password_confirm = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'prenom', 'nom', 'telephone', 'region', 'adresse', 'role']

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Les mots de passe ne correspondent pas"})

        email = attrs.get('email')
        username = (attrs.get('username') or '').strip() or email
        attrs['username'] = username

        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError({"username": "Ce nom d'utilisateur est déjà utilisé"})

        if email and User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError({"email": "Cet email est déjà utilisé"})

        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        username = validated_data.get('username') or validated_data.get('email')
        validated_data['username'] = username

        role = (validated_data.get('role') or 'visitor').lower()
        validated_data['role'] = role

        if role == 'farmer':
            validated_data['account_status'] = 'pending'
            validated_data['est_actif'] = False
        else:
            validated_data['account_status'] = 'approved'
            validated_data['est_actif'] = True

        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Serializer personnalisé pour le token JWT"""

    def validate(self, attrs):
        username = attrs.get('username')
        if username and '@' in username:
            try:
                user = User.objects.get(email__iexact=username)
                attrs['username'] = user.username
            except User.DoesNotExist:
                pass

        data = super().validate(attrs)
        user = self.user
        if user.account_status != 'approved' or not user.est_actif:
            raise AuthenticationFailed('Votre compte est en attente de validation par l’administrateur.')
        return data

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['role'] = user.role
        token['prenom'] = user.prenom
        token['nom'] = user.nom
        token['region'] = user.region

        return token
