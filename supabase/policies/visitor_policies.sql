-- Politiques RLS pour le rôle visiteur

-- 1. Politiques pour la table users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Le visiteur peut voir son propre profil
CREATE POLICY "Les visiteurs peuvent voir leur propre profil" ON users
    FOR SELECT USING (auth.uid()::text = id AND role = 'visiteur');

-- Le visiteur peut mettre à jour son propre profil (pour devenir agriculteur)
CREATE POLICY "Les visiteurs peuvent mettre à jour leur propre profil" ON users
    FOR UPDATE USING (auth.uid()::text = id AND role = 'visiteur');

-- 2. Politiques pour news_public (lecture seule pour tous)
ALTER TABLE news_public ENABLE ROW LEVEL SECURITY;

-- Tout le monde peut lire les actualités publiées
CREATE POLICY "Tout le monde peut lire les actualités publiées" ON news_public
    FOR SELECT USING (published = true);

-- Seuls les admins peuvent insérer/modifier/supprimer les actualités
CREATE POLICY "Seuls les admins peuvent gérer les actualités" ON news_public
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid()::text AND role = 'admin'
        )
    );

-- 3. Politiques pour public_stats (lecture seule pour tous)
ALTER TABLE public_stats ENABLE ROW LEVEL SECURITY;

-- Tout le monde peut lire les statistiques publiques
CREATE POLICY "Tout le monde peut lire les statistiques publiques" ON public_stats
    FOR SELECT USING (true);

-- Seuls les admins peuvent insérer/modifier/supprimer les statistiques
CREATE POLICY "Seuls les admins peuvent gérer les statistiques" ON public_stats
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid()::text AND role = 'admin'
        )
    );

-- 4. Politiques restrictives pour les tables privées (bloquer l'accès aux visiteurs)

-- Pour parcelles
ALTER TABLE parcelles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Les visiteurs ne peuvent pas accéder aux parcelles" ON parcelles
    FOR ALL USING (
        NOT EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid()::text AND role = 'visiteur'
        )
    );

-- Pour recoltes
ALTER TABLE recoltes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Les visiteurs ne peuvent pas accéder aux récoltes" ON recoltes
    FOR ALL USING (
        NOT EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid()::text AND role = 'visiteur'
        )
    );

-- Pour alertes
ALTER TABLE alertes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Les visiteurs ne peuvent pas accéder aux alertes" ON alertes
    FOR ALL USING (
        NOT EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid()::text AND role = 'visiteur'
        )
    );

-- Pour predictions
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Les visiteurs ne peuvent pas accéder aux prédictions" ON predictions
    FOR ALL USING (
        NOT EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid()::text AND role = 'visiteur'
        )
    );

-- Pour cultures
ALTER TABLE cultures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Les visiteurs ne peuvent pas accéder aux cultures" ON cultures
    FOR ALL USING (
        NOT EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid()::text AND role = 'visiteur'
        )
    );
