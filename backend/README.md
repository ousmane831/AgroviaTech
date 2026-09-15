# AgroviaTech Backend - Django REST API

Backend Django pour l'application AgroviaTech avec API REST pour la gestion agricole.

## 🚀 Installation

### Prérequis
- Python 3.9+
- PostgreSQL 12+
- Virtual environment (recommandé)

### Configuration

1. **Créer et activer l'environnement virtuel**
```bash
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac
```

2. **Installer les dépendances**
```bash
pip install -r requirements.txt
```

3. **Configurer les variables d'environnement**
```bash
cp .env.example .env
# Éditer .env avec vos configurations
```

4. **Configurer PostgreSQL**
```bash
# Créer la base de données
createdb agroviatech
```

5. **Exécuter les migrations**
```bash
python manage.py makemigrations
python manage.py migrate
```

6. **Créer un superutilisateur**
```bash
python manage.py createsuperuser
```

7. **Démarrer le serveur de développement**
```bash
python manage.py runserver
```

L'API sera accessible sur `http://localhost:8000`

## 📚 Structure du Projet

```
backend/
├── agroviatech/          # Configuration principale
│   ├── settings.py       # Configuration Django
│   ├── urls.py           # URLs principales
│   ├── wsgi.py           # WSGI config
│   └── asgi.py           # ASGI config
├── agriculture/           # App gestion agricole
│   ├── models.py         # Modèles (Parcelle, Recolte, Alerte, Prediction, PhotoAnalysis)
│   ├── serializers.py    # Serializers DRF
│   ├── views.py          # Vues API
│   ├── urls.py           # URLs agriculture
│   └── admin.py          # Admin Django
├── users/                 # App gestion utilisateurs
│   ├── models.py         # Modèle User personnalisé
│   ├── serializers.py    # Serializers auth
│   ├── views.py          # Vues auth
│   └── urls.py           # URLs auth
├── manage.py              # Script de gestion Django
├── requirements.txt       # Dépendances Python
└── .env.example          # Exemple variables d'environnement
```

## 🔌 API Endpoints

### Authentification
- `POST /api/auth/login/` - Connexion JWT
- `POST /api/auth/register/` - Inscription
- `GET /api/auth/profile/` - Profil utilisateur
- `GET /api/auth/users/` - Liste utilisateurs (admin)
- `POST /api/auth/request-farmer/` - Demande compte agriculteur

### Agriculture
- `GET /api/agriculture/parcelles/` - Liste parcelles
- `POST /api/agriculture/parcelles/` - Créer parcelle
- `GET /api/agriculture/parcelles/<id>/` - Détails parcelle
- `PUT /api/agriculture/parcelles/<id>/` - Modifier parcelle
- `DELETE /api/agriculture/parcelles/<id>/` - Supprimer parcelle

- `GET /api/agriculture/recoltes/` - Liste récoltes
- `POST /api/agriculture/recoltes/` - Créer récolte
- `GET /api/agriculture/recoltes/<id>/` - Détails récolte

- `GET /api/agriculture/alertes/` - Liste alertes
- `POST /api/agriculture/alertes/` - Créer alerte
- `POST /api/agriculture/alertes/<id>/resoudre/` - Résoudre alerte

- `GET /api/agriculture/predictions/` - Liste prédictions IA
- `GET /api/agriculture/predictions/<id>/` - Détails prédiction

- `GET /api/agriculture/analyse-photo/` - Liste analyses photos
- `POST /api/agriculture/analyse-photo/` - Créer analyse photo
- `GET /api/agriculture/analyse-photo/<id>/` - Détails analyse

- `GET /api/agriculture/statistiques/` - Statistiques agriculteur

### Marché
- `GET /api/agriculture/market/offers/` - Offres du marché
- `POST /api/agriculture/market/offers/` - Créer offre
- `GET /api/agriculture/market/needs/` - Demandes du marché
- `POST /api/agriculture/market/needs/` - Créer demande
- `GET /api/agriculture/market/matches/` - Correspondances
- `GET /api/agriculture/market/negotiations/` - Négociations

## 🔐 Authentification

L'API utilise JWT (JSON Web Tokens) pour l'authentification.

### Exemple de connexion
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "testpass123"}'
```

Réponse :
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "role": "farmer",
  "prenom": "Jean",
  "nom": "Dupont",
  "region": "Dakar"
}
```

### Utiliser le token
```bash
curl -X GET http://localhost:8000/api/agriculture/parcelles/ \
  -H "Authorization: Bearer <access_token>"
```

## 📊 Modèles de Données

### User (Utilisateur personnalisé)
- `username`, `email`, `password`
- `prenom`, `nom`, `telephone`, `region`, `adresse`
- `role` (admin, farmer, visitor)
- `est_actif`

### Parcelle
- `nom`, `type_culture`, `surface` (ha)
- `localisation`, `statut`
- `proprietaire` (FK User)

### Recolte
- `parcelle` (FK Parcelle)
- `date_recolte`, `quantite` (kg)
- `qualite`, `notes`

### Alerte
- `parcelle` (FK Parcelle)
- `type_alerte`, `priorite`, `message`
- `statut`, `date_resolution`

### Prediction
- `parcelle` (FK Parcelle)
- `rendement_prevu` (kg/ha), `pertes_estimees` (%)
- `confiance` (%), `recommandations` (JSON)

### PhotoAnalysis
- `parcelle` (FK Parcelle), `proprietaire` (FK User)
- `photo` (ImageField)
- `etat_apparent`, `anomalies` (JSON)
- `maturite`, `qualite`, `prescription`
- `confiance` (%)

## 🧪 Tests

```bash
# Exécuter les tests
python manage.py test

# Avec couverture
pip install pytest pytest-django
pytest --cov=.
```

## 🚀 Déploiement

### Production
1. Définir `DEBUG=False` et `SECRET_KEY` dans `.env`
2. Configurer `ALLOWED_HOSTS`
3. Utiliser PostgreSQL en production
4. Collecter les fichiers statiques
```bash
python manage.py collectstatic
```

### Docker (optionnel)
```bash
docker build -t agroviatech-backend .
docker run -p 8000:8000 agroviatech-backend
```

## 📝 Notes de Développement

- **Timezone**: Africa/Dakar
- **Language**: French (fr-fr)
- **Custom User Model**: users.User
- **Pagination**: 20 items par page
- **JWT Token Lifetime**: 2 heures (access), 7 jours (refresh)

## 🔧 Dépannage

### Erreurs communes
1. **ModuleNotFoundError**: Installer les dépendances avec `pip install -r requirements.txt`
2. **Database connection error**: Vérifier les credentials PostgreSQL dans `.env`
3. **CORS error**: Ajouter l'URL frontend dans `CORS_ALLOWED_ORIGINS`

### Logs
```bash
# Voir les logs Django
python manage.py runserver --verbosity=2
```

## 📞 Support

Pour toute question ou problème, contactez l'équipe de développement AgroviaTech.
