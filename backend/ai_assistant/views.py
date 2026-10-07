from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Conversation, Message, FAQ
from .serializers import MessageSerializer, ConversationSerializer, FAQSerializer, ChatRequestSerializer
from django.utils import timezone
from .services import galsen_ai
import re
import io
import base64
import os
import json

from agriculture.models import Parcelle
from agriculture.services import get_parcelle_context

class ChatbotViewSet(viewsets.ViewSet):
    """ViewSet pour les opérations du chatbot"""
    
    def get_queryset(self):
        return Conversation.objects.filter(user=self.request.user)
    
    def list(self, request):
        """Lister toutes les conversations de l'utilisateur"""
        conversations = self.get_queryset()
        serializer = ConversationSerializer(conversations, many=True)
        return Response(serializer.data)
    
    def retrieve(self, request, pk=None):
        """Récupérer une conversation spécifique"""
        conversation = self.get_object()
        serializer = ConversationSerializer(conversation)
        return Response(serializer.data)
    
    def create(self, request):
        """Créer une nouvelle conversation"""
        serializer = ConversationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def chat(self, request):
        """Endpoint principal pour le chat - traite les messages et retourne les réponses"""
        serializer = ChatRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        message = serializer.validated_data['message']
        language = serializer.validated_data['language']
        conversation_id = serializer.validated_data.get('conversation_id')
        
        # Récupérer ou créer la conversation
        if conversation_id:
            try:
                conversation = Conversation.objects.get(id=conversation_id, user=request.user)
            except Conversation.DoesNotExist:
                return Response({'error': 'Conversation non trouvée'}, status=status.HTTP_404_NOT_FOUND)
        else:
            conversation = Conversation.objects.create(user=request.user, language=language)
        
        # Sauvegarder le message utilisateur
        user_message = Message.objects.create(
            conversation=conversation,
            role='user',
            content=message,
            language=language
        )
        
        # Générer la réponse du bot
        bot_response = self.generate_response(message, language, request.user)
        
        # Sauvegarder la réponse du bot
        bot_message = Message.objects.create(
            conversation=conversation,
            role='bot',
            content=bot_response,
            language=language
        )
        
        # Retourner la réponse
        return Response({
            'message': bot_response,
            'conversation_id': conversation.id,
            'user_message_id': user_message.id,
            'bot_message_id': bot_message.id
        })

    @action(detail=False, methods=['post'], url_path='voice-chat')
    def voice_chat(self, request):
        """Traiter une question vocale avec Sama Agri Voice."""
        audio_file = request.FILES.get('audio')
        language = request.data.get('language', 'fr')
        conversation_id = request.data.get('conversation_id')

        if not audio_file:
            return Response(
                {'error': 'Fichier audio requis'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Récupérer ou créer la conversation
            if conversation_id:
                try:
                    conversation = Conversation.objects.get(
                        id=conversation_id,
                        user=request.user
                    )
                except Conversation.DoesNotExist:
                    return Response(
                        {'error': 'Conversation non trouvée'},
                        status=status.HTTP_404_NOT_FOUND
                    )
            else:
                conversation = Conversation.objects.create(
                    user=request.user,
                    language=language
                )
            # Détecter une parcelle mentionnée dans la question transcrite.
            parcelle_id = None
            parcelle_context = None

            parcelle_id = request.data.get("parcelle_id")
            parcelle_context = None

            if parcelle_id:
                try:
                    parcelle = Parcelle.objects.get(
                        id_externe=parcelle_id
                    )

                    # Même règle de sécurité que l'endpoint contexte.
                    if not parcelle.est_demo and parcelle.proprietaire != request.user:
                        return Response(
                            {"error": "Accès à cette parcelle non autorisé."},
                            status=status.HTTP_403_FORBIDDEN
                        )

                    if parcelle.est_demo and request.user.role != "admin":
                        return Response(
                            {"error": "Accès à la parcelle démo non autorisé."},
                            status=status.HTTP_403_FORBIDDEN
                        )

                    parcelle_context = get_parcelle_context(parcelle)

                except Parcelle.DoesNotExist:
                    return Response(
                        {"error": "Parcelle non trouvée."},
                        status=status.HTTP_404_NOT_FOUND
                    )

                        # La transcription est obtenue par Sama Agri Voice.
                        # On regarde d'abord le résultat retourné.

            # Envoyer l'audio à Sama Agri Voice
            result = galsen_ai.agriculture_voice(
                audio_file,
                language,
                parcelle_id=parcelle_id,
                context=parcelle_context
            )
            question = result.get('question', '')
            answer = result.get('answer', '')
            audio_url = result.get('audio_url')

            # Sauvegarder la question de l'utilisateur
            user_message = Message.objects.create(
                conversation=conversation,
                role='user',
                content=question,
                language=language
            )

            # Sauvegarder la réponse du bot
            bot_message = Message.objects.create(
                conversation=conversation,
                role='bot',
                content=answer,
                language=language
            )

            # Sama Agri Voice retourne actuellement
            # un chemin relatif : /audio/reponse_xxx.wav
            if audio_url and audio_url.startswith('/'):
                agrivoice_url = os.getenv(
                    'AGRIVOICE_API_URL',
                    'http://127.0.0.1:8001'
                )
                audio_url = f"{agrivoice_url}{audio_url}"

            return Response({
                'question': question,
                'message': answer,
                'audio_url': audio_url,
                'conversation_id': conversation.id,
                'user_message_id': user_message.id,
                'bot_message_id': bot_message.id
            })

        except Exception as e:
            return Response(
                {
                    'error': 'Erreur lors du traitement vocal',
                    'detail': str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def generate_response(self, user_message, language, user):
        """Générer une réponse intelligente basée sur le message et le contexte"""
        # Normaliser le message pour la recherche
        message_lower = user_message.lower()
        
        # Chercher dans les FAQ
        faqs = FAQ.objects.all()
        
        # Recherche de correspondance dans les questions
        best_match = None
        best_score = 0
        
        for faq in faqs:
            # Score de similarité simple
            score = 0
            question = faq.get_question(language).lower()
            
            # Correspondance exacte
            if question == message_lower:
                score = 100
            # Correspondance partielle
            elif any(word in message_lower for word in question.split()):
                score = len([word for word in question.split() if word in message_lower]) * 20
            
            if score > best_score:
                best_score = score
                best_match = faq
        
        # Si une FAQ correspond bien, utiliser la réponse
        if best_match and best_score >= 40:
            return best_match.get_answer(language)
        
        # Sinon, utiliser des réponses basées sur le contexte
        # Vérifier si l'utilisateur est agriculteur ou visiteur
        is_farmer = hasattr(user, 'role') and user.role == 'AGRICULTEUR'
        
        # Réponses contextuelles basées sur les mots-clés
        if any(word in message_lower for word in ['alert', 'alerte', 'warning']):
            if is_farmer:
                return self.get_farmer_alerts_response(language)
            else:
                return self.get_visitor_alerts_response(language)
        
        elif any(word in message_lower for word in ['parcelle', 'champ', 'terrain', 'field']):
            if is_farmer:
                return self.get_farmer_parcels_response(language)
            else:
                return self.get_visitor_parcels_response(language)
        
        elif any(word in message_lower for word in ['recolte', 'récolte', 'harvest', 'production']):
            if is_farmer:
                return self.get_farmer_harvests_response(language)
            else:
                return self.get_visitor_harvests_response(language)
        
        elif any(word in message_lower for word in ['marche', 'marché', 'market', 'prix', 'price', 'offre', 'offer']):
            return self.get_market_response(language)
        
        elif any(word in message_lower for word in ['compte', 'profil', 'account', 'profile']):
            return self.get_account_response(language)
        
        # Réponse par défaut
        return self.get_default_response(language)
    
    def get_farmer_alerts_response(self, language):
        responses = {
            'fr': "Vous avez actuellement des alertes actives. Voulez-vous que je vous montre les détails ?",
            'wo': "Yaa am alert ci bi. Naka la yegg ?",
            'ff': "Aɗa am alert ci bi. Aɗa yiyde ?",
            'sr': "Yaa am alert ci bi. Naka la yegg ?"
        }
        return responses.get(language, responses['fr'])
    
    def get_visitor_alerts_response(self, language):
        responses = {
            'fr': "Les alertes sont disponibles pour les agriculteurs. Vous pouvez consulter les offres sur le marché.",
            'wo': "Alert yi ci agriculteur yi la. Man mana yegg offre ci marché bi.",
            'ff': "Alert yi ci agriculteur yi la. Mi mana yegg offre ci marché bi.",
            'sr': "Alert yi ci agriculteur yi la. Man mana yegg offre ci marché bi."
        }
        return responses.get(language, responses['fr'])
    
    def get_farmer_parcels_response(self, language):
        responses = {
            'fr': "Vos parcelles sont enregistrées dans le système. Vous pouvez les gérer depuis votre tableau de bord.",
            'wo': "Sa parcelle yi ci system bi la. Man mana lekk ko ci dashboard bi.",
            'ff': "Sa parcelle yi ci system bi la. Mi mana lekk ko ci dashboard bi.",
            'sr': "Sa parcelle yi ci system bi la. Man mana lekk ko ci dashboard bi."
        }
        return responses.get(language, responses['fr'])
    
    def get_visitor_parcels_response(self, language):
        responses = {
            'fr': "Les parcelles des agriculteurs sont visibles sur le marché avec leurs produits disponibles.",
            'wo': "Parcelle yi ci agriculteur yi la ci market bi ak product yi.",
            'ff': "Parcelle yi ci agriculteur yi la ci market bi ak product yi.",
            'sr': "Parcelle yi ci agriculteur yi la ci market bi ak product yi."
        }
        return responses.get(language, responses['fr'])
    
    def get_farmer_harvests_response(self, language):
        responses = {
            'fr': "Vos récoltes sont enregistrées. Vous pouvez publier de nouvelles récoltes sur le marché.",
            'wo': "Sa recolte yi ci system bi la. Man mana publie recolte bu ci market bi.",
            'ff': "Sa recolte yi ci system bi la. Mi mana publie recolte bu ci market bi.",
            'sr': "Sa recolte yi ci system bi la. Man mana publie recolte bu ci market bi."
        }
        return responses.get(language, responses['fr'])
    
    def get_visitor_harvests_response(self, language):
        responses = {
            'fr': "Vous pouvez consulter les récoltes disponibles sur le marché et contacter les agriculteurs.",
            'wo': "Man mana yegg recolte yi ci market bi ak contact agriculteur yi.",
            'ff': "Mi mana yegg recolte yi ci market bi ak contact agriculteur yi.",
            'sr': "Man mana yegg recolte yi ci market bi ak contact agriculteur yi."
        }
        return responses.get(language, responses['fr'])
    
    def get_market_response(self, language):
        responses = {
            'fr': "Le marché AgroviaTech connecte agriculteurs et acheteurs. Vous pouvez y trouver des offres et publier vos besoins.",
            'wo': "AgroviaMarket bi connect agriculteur ak buyer. Man mana yegg offre ak publie sa besoin.",
            'ff': "AgroviaMarket bi connect agriculteur ak buyer. Mi mana yegg offre ak publie sa besoin.",
            'sr': "AgroviaMarket bi connect agriculteur ak buyer. Man mana yegg offre ak publie sa besoin."
        }
        return responses.get(language, responses['fr'])
    
    def get_account_response(self, language):
        responses = {
            'fr': "Vous pouvez gérer votre profil et vos paramètres depuis votre tableau de bord.",
            'wo': "Man mana lekk sa profil ak sa settings ci dashboard bi.",
            'ff': "Mi mana lekk sa profil ak sa settings ci dashboard bi.",
            'sr': "Man mana lekk sa profil ak sa settings ci dashboard bi."
        }
        return responses.get(language, responses['fr'])
    
    def get_default_response(self, language):
        responses = {
            'fr': "Je suis là pour vous aider. Vous pouvez me poser des questions sur vos alertes, parcelles, récoltes ou le marché.",
            'wo': "Man di dimbale la. Man mana la jange ci sa alert, sa parcelle, sa recolte walla sa market.",
            'ff': "Mi di ɓeyda la. Mi mana la jange ci sa alert, sa parcelle, sa recolte walla sa market.",
            'sr': "Man di dimbale la. Man mana la jange ci sa alert, sa parcelle, sa recolte walla sa market."
        }
        return responses.get(language, responses['fr'])

class FAQViewSet(viewsets.ModelViewSet):
    """ViewSet pour gérer les FAQ"""
    queryset = FAQ.objects.all()
    serializer_class = FAQSerializer

class TTSViewSet(viewsets.ViewSet):
    """ViewSet pour la synthèse vocale (Text-to-Speech)"""
    
    @action(detail=False, methods=['post'])
    def synthesize(self, request):
        """Synthétiser du texte en audio"""
        text = request.data.get('text')
        language = request.data.get('language', 'wo')
        
        if not text:
            return Response({'error': 'Texte requis'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Générer l'audio
            audio_array = galsen_ai.text_to_speech(text, language)
            
            if audio_array is None:
                return Response({'error': 'Erreur lors de la génération audio'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            # Convertir en base64 pour le frontend
            # Note: En production, on retournerait un fichier audio directement
            return Response({
                'success': True,
                'message': 'Audio généré avec succès',
                'language': language
            })
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class STTViewSet(viewsets.ViewSet):
    """ViewSet pour la reconnaissance vocale (Speech-to-Text)"""
    
    @action(detail=False, methods=['post'])
    def transcribe(self, request):
        """Transcrire de l'audio en texte"""
        audio_file = request.FILES.get('audio')
        language = request.data.get('language', 'wo')
        
        if not audio_file:
            return Response({'error': 'Fichier audio requis'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Transcrire l'audio
            text = galsen_ai.speech_to_text(audio_file, language)
            
            if text is None:
                return Response({'error': 'Erreur lors de la transcription'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            return Response({
                'text': text,
                'language': language
            })
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
