from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChatbotViewSet, FAQViewSet, TTSViewSet, STTViewSet

router = DefaultRouter()
router.register(r'conversations', ChatbotViewSet, basename='conversation')
router.register(r'faq', FAQViewSet, basename='faq')
router.register(r'tts', TTSViewSet, basename='tts')
router.register(r'stt', STTViewSet, basename='stt')

urlpatterns = [
    path('', include(router.urls)),
]
