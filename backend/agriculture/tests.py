from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from users.models import User
from .models import MarketNegotiation


class MarketplaceApiTests(APITestCase):
    def setUp(self):
        self.farmer = User.objects.create_user(
            username='farmer-market', email='farmer-market@example.com', password='strongpass123',
            prenom='Moussa', nom='Sow', role='farmer', telephone='+221771111111',
        )
        self.buyer = User.objects.create_user(
            username='buyer-market', email='buyer-market@example.com', password='strongpass123',
            prenom='Aminata', nom='Diop', role='visitor', telephone='+221772222222',
        )

    def test_only_farmer_can_publish_offer(self):
        self.client.force_authenticate(user=self.buyer)
        response = self.client.post(reverse('market-offers'), {
            'crop': 'Arachides', 'region': 'Dakar', 'quantity': 300,
            'quality': 'Premium', 'available_date': '2026-09-10',
            'price_indicative': 570, 'farmer_phone': '+221771111111',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_offer_need_match_and_negotiation_are_persisted(self):
        self.client.force_authenticate(user=self.farmer)
        offer_response = self.client.post(reverse('market-offers'), {
            'crop': 'Arachides', 'region': 'Dakar', 'quantity': 300,
            'quality': 'Premium', 'available_date': '2026-09-10',
            'price_indicative': 570, 'farmer_phone': '+221771111111',
        }, format='json')
        self.assertEqual(offer_response.status_code, status.HTTP_201_CREATED)

        self.client.force_authenticate(user=self.buyer)
        need_response = self.client.post(reverse('market-needs'), {
            'crop': 'Arachides', 'region': 'Dakar', 'quantity': 250,
            'quality': 'Premium', 'delivery_date': '2026-09-12',
            'target_price': 600, 'buyer_type': 'Grossiste', 'buyer_phone': '+221772222222',
        }, format='json')
        self.assertEqual(need_response.status_code, status.HTTP_201_CREATED)

        match_response = self.client.get(reverse('market-matches'))
        self.assertEqual(match_response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(match_response.data), 1)

        self.client.force_authenticate(user=self.farmer)
        farmer_matches_response = self.client.get(reverse('market-matches'))
        self.assertEqual(farmer_matches_response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(farmer_matches_response.data), 1)

        negotiation_response = self.client.post(reverse('market-negotiations'), {
            'offer_id': offer_response.data['id'],
            'need_id': need_response.data['id'],
            'message': 'Bonjour, je souhaite échanger sur cette offre.',
        }, format='json')
        self.assertEqual(negotiation_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(MarketNegotiation.objects.count(), 1)