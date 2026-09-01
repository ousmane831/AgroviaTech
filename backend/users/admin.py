from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'prenom', 'nom', 'role', 'region', 'est_actif', 'created_at']
    list_filter = ['role', 'est_actif', 'region', 'created_at']
    search_fields = ['username', 'email', 'prenom', 'nom', 'telephone']
    ordering = ['-created_at']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Informations personnelles', {
            'fields': ('prenom', 'nom', 'telephone', 'region', 'adresse', 'role', 'est_actif')
        }),
    )
    
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Informations personnelles', {
            'fields': ('email', 'prenom', 'nom', 'telephone', 'region', 'adresse', 'role')
        }),
    )
