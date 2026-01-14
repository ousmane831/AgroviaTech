-- Table pour les demandes de passage au rôle agriculteur
CREATE TABLE IF NOT EXISTS agriculteur_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  location TEXT,
  phone TEXT,
  experience TEXT,
  culture_type TEXT,
  justification TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les recherches
CREATE INDEX idx_agriculteur_requests_user_id ON agriculteur_requests(user_id);
CREATE INDEX idx_agriculteur_requests_status ON agriculteur_requests(status);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_agriculteur_requests_updated_at 
    BEFORE UPDATE ON agriculteur_requests 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security)
ALTER TABLE agriculteur_requests ENABLE ROW LEVEL SECURITY;

-- Politique RLS : les utilisateurs ne peuvent voir que leurs propres demandes
CREATE POLICY "Users can view own requests" ON agriculteur_requests
    FOR SELECT USING (auth.uid() = user_id);

-- Politique RLS : les utilisateurs peuvent insérer leurs propres demandes
CREATE POLICY "Users can insert own requests" ON agriculteur_requests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politique RLS : les utilisateurs peuvent modifier leurs propres demandes (seulement si pending)
CREATE POLICY "Users can update own pending requests" ON agriculteur_requests
    FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

-- Politique RLS : les admins peuvent tout faire
CREATE POLICY "Admins full access" ON agriculteur_requests
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Fonction pour vérifier si un utilisateur est admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND raw_user_meta_data->>'role' = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
