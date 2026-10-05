from django.db import models
from django.conf import settings

class Conversation(models.Model):
    """Modèle pour stocker les conversations du chatbot"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='conversations')
    language = models.CharField(max_length=5, choices=[('fr', 'Français'), ('wo', 'Wolof'), ('ff', 'Poular'), ('sr', 'Sérère')], default='fr')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"Conversation {self.id} - {self.user.email} ({self.language})"

class Message(models.Model):
    """Modèle pour stocker les messages individuels"""
    ROLE_CHOICES = [('user', 'Utilisateur'), ('bot', 'Assistant')]
    
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    content = models.TextField()
    language = models.CharField(max_length=5, choices=[('fr', 'Français'), ('wo', 'Wolof'), ('ff', 'Poular'), ('sr', 'Sérère')], default='fr')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['created_at']
    
    def __str__(self):
        return f"{self.role}: {self.content[:50]}..."

class FAQ(models.Model):
    """Modèle pour stocker les questions fréquentes et réponses multilingues"""
    question_fr = models.TextField()
    question_wo = models.TextField(blank=True, null=True)
    question_ff = models.TextField(blank=True, null=True)
    question_sr = models.TextField(blank=True, null=True)
    
    answer_fr = models.TextField()
    answer_wo = models.TextField(blank=True, null=True)
    answer_ff = models.TextField(blank=True, null=True)
    answer_sr = models.TextField(blank=True, null=True)
    
    category = models.CharField(max_length=50, choices=[
        ('general', 'Général'),
        ('alerts', 'Alertes'),
        ('parcels', 'Parcelles'),
        ('harvests', 'Récoltes'),
        ('market', 'Marché'),
        ('account', 'Compte'),
    ])
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['category', 'question_fr']
    
    def __str__(self):
        return f"{self.category}: {self.question_fr[:50]}..."
    
    def get_question(self, language):
        if language == 'wo' and self.question_wo:
            return self.question_wo
        elif language == 'ff' and self.question_ff:
            return self.question_ff
        elif language == 'sr' and self.question_sr:
            return self.question_sr
        return self.question_fr
    
    def get_answer(self, language):
        if language == 'wo' and self.answer_wo:
            return self.answer_wo
        elif language == 'ff' and self.answer_ff:
            return self.answer_ff
        elif language == 'sr' and self.answer_sr:
            return self.answer_sr
        return self.answer_fr
