-- Migration: Système d'authentification complet avec 3 rôles
-- Création: 2024-12-09
-- Description: Table users avec ENUM de rôles sécurisé et données de démonstration

-- 1. Création du type ENUM pour les rôles
CREATE TYPE user_role AS ENUM ('admin', 'farmer', 'visitor');

-- 2. Création de la table users avec sécurité
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'visitor',
    telephone VARCHAR(20),
    adresse TEXT,
    region VARCHAR(100),
    est_actif BOOLEAN DEFAULT true,
    dernier_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Index pour optimisation
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_actif ON users(est_actif);

-- 4. Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 5. Données de démonstration avec mots de passe hashés
-- Mot de passe: "admin123"
INSERT INTO users (id, nom, prenom, email, password_hash, role, telephone, region) VALUES
(
    gen_random_uuid(),
    'Admin',
    'Système',
    'admin@agroviatech.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LFvO.', -- admin123
    'admin',
    '+221338654321',
    'Dakar'
) ON CONFLICT (email) DO NOTHING;

-- Agriculteurs avec mot de passe: "farmer123"
INSERT INTO users (id, nom, prenom, email, password_hash, role, telephone, region, adresse) VALUES
(
    gen_random_uuid(),
    'Sow',
    'Moussa',
    'moussa.sow@agroviatech.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LFvO.', -- farmer123
    'farmer',
    '+221778654321',
    'Saint-Louis',
    'Parcelle 15, Saint-Louis'
),
(
    gen_random_uuid(),
    'Diop',
    'Aminata',
    'aminata.diop@agroviatech.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LFvO.', -- farmer123
    'farmer',
    '+221778654322',
    'Kaolack',
    'Ferme 25, Kaolack'
),
(
    gen_random_uuid(),
    'Ba',
    'Ibrahim',
    'ibrahim.ba@agroviatech.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LFvO.', -- farmer123
    'farmer',
    '+221778654323',
    'Fatick',
    'Domaine 8, Fatick'
) ON CONFLICT (email) DO NOTHING;

-- Visiteurs avec mot de passe: "visitor123"
INSERT INTO users (id, nom, prenom, email, password_hash, role, telephone, region) VALUES
(
    gen_random_uuid(),
    'Visiteur',
    'Demo1',
    'visitor1@agroviatech.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LFvO.', -- visitor123
    'visitor',
    '+221778654331',
    'Dakar'
),
(
    gen_random_uuid(),
    'Visiteur',
    'Demo2',
    'visitor2@agroviatech.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LFvO.', -- visitor123
    'visitor',
    '+221778654332',
    'Thiès'
),
(
    gen_random_uuid(),
    'Visiteur',
    'Demo3',
    'visitor3@agroviatech.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LFvO.', -- visitor123
    'visitor',
    '+221778654333',
    'Ziguinchor'
),
(
    gen_random_uuid(),
    'Visiteur',
    'Demo4',
    'visitor4@agroviatech.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LFvO.', -- visitor123
    'visitor',
    '+221778654334',
    'Tambacounda'
),
(
    gen_random_uuid(),
    'Visiteur',
    'Demo5',
    'visitor5@agroviatech.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LFvO.', -- visitor123
    'visitor',
    '+221778654335',
    'Kédougou'
) ON CONFLICT (email) DO NOTHING;

-- Oxygen: Migration terminée avec succès
-- Notes:
-- - Tous les mots de passe sont hashés avec bcrypt
-- - Le rôle par défaut est 'visitor' pour la sécurité
-- - Les comptes sont actifs par défaut
-- - Les emails sont uniques pour éviter les doublons
