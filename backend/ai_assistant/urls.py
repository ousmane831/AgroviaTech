from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChatbotViewSet, FAQViewSet

router = DefaultRouter()
router.register(r'conversations', ChatbotViewSet, basename='conversation')
router.register(r'faq', FAQViewSet, basename='faq')

urlpatterns = [
    path('', include(router.urls)),
]
