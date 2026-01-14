-- Migration pour ajouter le rôle visiteur et créer les tables publiques

-- 1. Mettre à jour la table users pour ajouter le rôle
ALTER TABLE users 
ADD COLUMN role TEXT DEFAULT 'visiteur' CHECK (role IN ('admin', 'agriculteur', 'visiteur'));

-- 2. Créer la table des actualités publiques
CREATE TABLE IF NOT EXISTS news_public (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    titre TEXT NOT NULL,
    contenu TEXT NOT NULL,
    image_url TEXT,
    auteur TEXT DEFAULT 'AgroviaTech',
    categorie TEXT DEFAULT 'general' CHECK (categorie IN ('general', 'conseil', 'innovation', 'evenement')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published BOOLEAN DEFAULT true
);

-- 3. Créer la table des statistiques publiques
CREATE TABLE IF NOT EXISTS public_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    titre TEXT NOT NULL,
    valeur NUMERIC NOT NULL,
    unite TEXT DEFAULT 'unité',
    description TEXT,
    categorie TEXT DEFAULT 'general' CHECK (categorie IN ('surface', 'production', 'agriculteurs', 'technologie')),
    annee INTEGER DEFAULT EXTRACT(YEAR FROM NOW()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Insérer des données de démonstration pour les actualités
INSERT INTO news_public (titre, contenu, image_url, categorie) VALUES
(
    'Nouvelle technologie IoT pour l''agriculture africaine',
    'AgroviaTech déploie des capteurs intelligents pour surveiller l''humidité des sols en temps réel. Cette innovation permet aux agriculteurs d''optimiser leur irrigation et d''économiser jusqu''à 30% d''eau.',
    'https://images.unsplash.com/photo-1592982538623-62692e9bc1fc?w=800',
    'innovation'
),
(
    'Conseils : Préparer votre terrain pour la saison des pluies',
    'Avec l''approche de la saison des pluies, découvrez nos meilleures pratiques pour préparer vos champs : analyse du sol, choix des semences, techniques de conservation...',
    'https://images.unsplash.com/photo-1605000797499-95a51c5269f9?w=800',
    'conseil'
),
(
    'Formation : Techniques de culture bio',
    'Rejoignez notre prochain atelier sur l''agriculture biologique. Apprenez les méthodes naturelles pour protéger vos cultures et améliorer vos rendements.',
    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800',
    'evenement'
);

-- 5. Insérer des données de démonstration pour les statistiques publiques
INSERT INTO public_stats (titre, valeur, unite, description, categorie, annee) VALUES
('Surface agricole totale', 2500000, 'hectares', 'Surface totale cultivée en Afrique de l''Ouest', 'surface', 2024),
('Nombre d''agriculteurs connectés', 15420, 'agriculteurs', 'Agriculteurs utilisant des technologies numériques', 'agriculteurs', 2024),
('Production céréalière', 8500000, 'tonnes', 'Production annuelle de céréales', 'production', 2024),
('Économie d''eau avec IoT', 35, '%', 'Réduction de la consommation d''eau grâce aux capteurs', 'technologie', 2024),
('Adoption mobile', 78, '%', 'Taux d''utilisation d''applications mobiles', 'technologie', 2024);

-- 6. Créer des index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_news_public_created_at ON news_public(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_public_published ON news_public(published);
CREATE INDEX IF NOT EXISTS idx_public_stats_categorie ON public_stats(categorie);
CREATE INDEX IF NOT EXISTS idx_public_stats_annee ON public_stats(annee);

-- 7. Mettre à jour les utilisateurs existants avec le rôle par défaut
UPDATE users SET role = 'admin' WHERE email = 'admin@agroviatech.com';
UPDATE users SET role = 'agriculteur' WHERE role IS NULL AND email NOT IN ('admin@agroviatech.com', 'visiteur@agroviatech.com');
UPDATE users SET role = 'visiteur' WHERE role IS NULL;
