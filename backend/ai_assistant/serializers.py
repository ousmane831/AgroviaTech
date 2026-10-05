from rest_framework import serializers
from .models import Conversation, Message, FAQ

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'role', 'content', 'language', 'created_at']

class ConversationSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Conversation
        fields = ['id', 'user', 'language', 'created_at', 'updated_at', 'messages']

class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = ['id', 'question_fr', 'question_wo', 'question_ff', 'question_sr', 
                  'answer_fr', 'answer_wo', 'answer_ff', 'answer_sr', 'category']

class ChatRequestSerializer(serializers.Serializer):
    message = serializers.CharField()
    language = serializers.CharField(max_length=5, default='fr')
    conversation_id = serializers.IntegerField(required=False)
