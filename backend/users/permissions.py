from rest_framework.permissions import BasePermission


class IsAdminUser(BasePermission):
    """Autorise uniquement les administrateurs."""

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and getattr(request.user, 'role', '') == 'admin')


class IsFarmerUser(BasePermission):
    """Autorise les agriculteurs."""

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and getattr(request.user, 'role', '') == 'farmer')


class IsVisitorUser(BasePermission):
    """Autorise les visiteurs."""

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and getattr(request.user, 'role', '') == 'visitor')


class IsOwnerOrAdmin(BasePermission):
    """Autorise le propriétaire ou l'admin."""

    def has_object_permission(self, request, view, obj):
        if not request.user or not request.user.is_authenticated:
            return False
        if getattr(request.user, 'role', '') == 'admin':
            return True
        return getattr(obj, 'proprietaire', None) == request.user
