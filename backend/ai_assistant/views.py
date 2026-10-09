from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Conversation, Message, FAQ
from .serializers import MessageSerializer, ConversationSerializer, FAQSerializer, ChatRequestSerializer
from .services import galsen_ai
import os
import json
from django.db.models import Q
from agriculture.models import Parcelle
from agriculture.services import (
    get_parcelle_context,
    resolve_parcelle_from_question,
)

from .gemini_service import (
    analyser_intention,
    formuler_reponse,
    repondre_conversation,
)
from agriculture.services import executer_intention_agricole

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

        # Générer l'audio avec le même moteur que le chat vocal.
        audio_url = None
        try:
            resultat_tts = galsen_ai.synthesize_text(bot_response, language)
            audio_url = resultat_tts.get('audio_url')

            if audio_url and audio_url.startswith('/'):
                if request.get_host().startswith(('localhost', '127.0.0.1')):
                    agrivoice_url = 'http://127.0.0.1:8002'
                else:
                    agrivoice_url = 'https://voice.agroviatechh.com'

                audio_url = f"{agrivoice_url}{audio_url}"
        except Exception as e:
            print(f"Erreur TTS chat écrit : {e}")


                
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
            'bot_message_id': bot_message.id,
            'audio_url': audio_url,
        })

    
    @action(detail=False, methods=['post'], url_path='voice-chat')
    def voice_chat(self, request):
        """Question vocale -> Gemini -> données Django -> réponse vocale."""

        audio_file = request.FILES.get('audio')
        language = request.data.get('language', 'wo')
        conversation_id = request.data.get('conversation_id')

        if not audio_file:
            return Response(
                {'error': 'Fichier audio requis'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # 1. Récupérer ou créer la conversation.
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

            # 2. Vérifier le fichier audio reçu.
            print("\n=== DIAGNOSTIC AUDIO ===")
            print("Nom du fichier :", audio_file.name)
            print("Type MIME :", audio_file.content_type)
            print("Taille du fichier :", audio_file.size)
            print("Langue demandée :", language)

            if audio_file.size == 0:
                return Response(
                    {
                        'error': 'Fichier audio vide',
                        'detail': 'Le fichier reçu ne contient aucune donnée.'
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Transcrire l'audio avec Sama Agri Voice / KIRIKU.
            question = galsen_ai.transcribe_audio(
                audio_file,
                language
            )

            if not question or not question.strip():
                return Response(
                    {'error': 'Aucune question n’a été détectée dans l’audio.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            print("\n=== QUESTION TRANSCRITE ===")
            print(question)

            # 3. Comprendre l'intention avec Gemini.
            intention = analyser_intention(question)

            print("=== INTENTION GEMINI ===")
            print(intention.model_dump())

            
            # 4. Déterminer la langue de réponse.
            langues = {
                'wo': 'wolof',
                'ff': 'pulaar',
                'sr': 'serere',
                'fr': 'français',
            }
            langue_reponse = langues.get(language, language)

            
            # 5. Orienter les questions selon leur intention.

            # Intentions qui nécessitent une réponse conversationnelle
            # et ne nécessitent pas obligatoirement une consultation de la base.
            intentions_conversationnelles = {
                'inconnue',
                'culture',
            }

            if intention.intent in intentions_conversationnelles:

                answer = repondre_conversation(
                    question=question,
                    langue=langue_reponse,
                )

                donnees = {
                    'success': True,
                    'type': 'conversationnelle',
                    'source': 'reponse_conversationnelle',
                    'intent': intention.intent,
                }

                print(
                    f"=== MODE CONVERSATIONNEL : "
                    f"{intention.intent} ==="
                )

            else:
                # Utiliser la parcelle active du frontend comme solution
                # de repli, sauf pour les comparaisons.

                if (
                    not intention.parcelle
                    and intention.intent not in (
                        'comparaison_ventes',
                        'comparaison_recoltes',
                    )
                ):
                    parcelle_frontend = request.data.get('parcelle_id')

                    if parcelle_frontend:
                        intention.parcelle = parcelle_frontend.strip()

                # Récupérer les données vérifiées depuis PostgreSQL.
                donnees = executer_intention_agricole(
                    intention,
                    request.user
                )

                print("=== DONNÉES AGRICOLES ===")
                print(donnees)

                # Formuler la réponse à partir des données reçues.
                answer = formuler_reponse(
                    question=question,
                    langue=langue_reponse,
                    donnees=donnees
                )

            # 7. Générer l'audio de la réponse avec KIRIKU TTS.
            resultat_tts = galsen_ai.synthesize_text(
                answer,
                language
            )
            audio_url = resultat_tts.get('audio_url')

            # 8. Enregistrer les messages.
            user_message = Message.objects.create(
                conversation=conversation,
                role='user',
                content=question,
                language=language
            )

            bot_message = Message.objects.create(
                conversation=conversation,
                role='bot',
                content=answer,
                language=language
            )

            # 9. Construire l'URL publique de l'audio.
            if audio_url and audio_url.startswith('/'):
                if request.get_host().startswith(('localhost', '127.0.0.1')):
                    agrivoice_url = 'http://127.0.0.1:8002'
                else:
                    agrivoice_url = 'https://voice.agroviatechh.com'

                audio_url = f"{agrivoice_url}{audio_url}"

            return Response({
                'question': question,
                'message': answer,
                'audio_url': audio_url,
                'conversation_id': conversation.id,
                'user_message_id': user_message.id,
                'bot_message_id': bot_message.id,
                'intention': intention.model_dump(),
                'donnees': donnees,
            })

        except Exception as e:
            print(f"Erreur voice_chat : {e}")
            return Response(
                {
                    'error': 'Erreur lors du traitement vocal',
                    'detail': str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
    def generate_response(self, user_message, language, user):
        """Générer une réponse en utilisant le même moteur agricole que le chat vocal."""
        langues = {
            'wo': 'wolof',
            'ff': 'pulaar',
            'sr': 'serere',
            'fr': 'français',
        }
        langue_reponse = langues.get(language, language)

        # 1. Comprendre la question, comme dans voice_chat().
        intention = analyser_intention(user_message)

        # 2. Si la question est conversationnelle, chercher une FAQ pertinente,
        # puis utiliser le moteur conversationnel.
        if intention.intent == 'inconnue':
            message_lower = user_message.lower().strip()

            best_match = None
            best_score = 0

            for faq in FAQ.objects.all():
                question = faq.get_question(language).lower().strip()

                if question == message_lower:
                    score = 100
                else:
                    mots = [
                        mot for mot in question.split()
                        if len(mot) > 3 and mot in message_lower
                    ]
                    score = len(mots) * 20

                if score > best_score:
                    best_score = score
                    best_match = faq

            if best_match and best_score >= 40:
                return best_match.get_answer(language)

            return repondre_conversation(
                question=user_message,
                langue=langue_reponse,
            )

        # 3. Exécuter la requête agricole avec les données Django,
        # comme dans voice_chat().
        donnees = executer_intention_agricole(intention, user)

        # 4. Formuler la réponse à partir des résultats obtenus.
        return formuler_reponse(
            question=user_message,
            langue=langue_reponse,
            donnees=donnees,
        )

    
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
