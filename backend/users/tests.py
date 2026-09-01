from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import User


class FarmerValidationFlowTests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            username='admin',
            email='admin@agroviatech.com',
            password='admin123',
            prenom='Admin',
            nom='System',
            role='admin',
            est_actif=True,
        )

    def test_farmer_registration_is_pending_until_admin_approval(self):
        payload = {
            'username': 'farmer1',
            'email': 'farmer1@example.com',
            'password': 'strongpass123',
            'password_confirm': 'strongpass123',
            'prenom': 'Moussa',
            'nom': 'Sow',
            'telephone': '+221771234567',
            'region': 'Dakar',
            'adresse': 'Zone agricole',
            'role': 'farmer',
        }

        response = self.client.post(reverse('register'), payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user = User.objects.get(email='farmer1@example.com')
        self.assertEqual(user.role, 'farmer')
        self.assertFalse(user.est_actif)

    def test_farmer_cannot_login_before_admin_approval(self):
        user = User.objects.create_user(
            username='pendingfarmer',
            email='pendingfarmer@example.com',
            password='strongpass123',
            prenom='Pending',
            nom='Farmer',
            role='farmer',
            est_actif=False,
        )

        response = self.client.post(
            reverse('token_obtain_pair'),
            {'username': user.email, 'password': 'strongpass123'},
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_admin_can_approve_pending_farmer_account(self):
        user = User.objects.create_user(
            username='pendingfarmer2',
            email='pendingfarmer2@example.com',
            password='strongpass123',
            prenom='Aminata',
            nom='Diop',
            role='farmer',
            est_actif=False,
        )

        self.client.force_authenticate(user=self.admin)
        response = self.client.post(reverse('approve_farmer_account', kwargs={'user_id': user.id}))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user.refresh_from_db()
        self.assertTrue(user.est_actif)
        self.assertEqual(user.role, 'farmer')
