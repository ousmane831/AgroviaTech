from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    """Custom user model for AgroviaTech"""

    ROLE_CHOICES = [
        ('admin', 'Administrateur'),
        ('farmer', 'Agriculteur'),
        ('visitor', 'Visiteur'),
    ]

    ACCOUNT_STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('approved', 'Approuvé'),
        ('rejected', 'Rejeté'),
    ]

    prenom = models.CharField(max_length=50, blank=True, default='')
    nom = models.CharField(max_length=50, blank=True, default='')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='visitor')
    account_status = models.CharField(
        max_length=20,
        choices=ACCOUNT_STATUS_CHOICES,
        default='approved',
    )
    telephone = models.CharField(max_length=20, blank=True, default='')
    region = models.CharField(max_length=100, blank=True, default='')
    adresse = models.TextField(blank=True, default='')
    est_actif = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Utilisateur"
        verbose_name_plural = "Utilisateurs"

    def __str__(self):
        full_name = ' '.join(part for part in [self.prenom, self.nom] if part).strip()
        return full_name or self.username
