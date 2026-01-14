export type UserRole = 'ADMIN' | 'AGRICULTEUR' | 'VISITEUR';

export interface User {
  id: string;
  email: string;
  nom?: string;
  prenom?: string;
  telephone?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface NewsPublic {
  id: string;
  titre: string;
  contenu: string;
  image_url?: string;
  auteur: string;
  categorie: 'general' | 'conseil' | 'innovation' | 'evenement';
  created_at: string;
  updated_at: string;
  published: boolean;
}

export interface PublicStats {
  id: string;
  titre: string;

  prix: number;           // 🔥 nombre, pas string
  unite: 'FCFA/KG';       // ou string si tu veux plus de flexibilité

  description?: string;

  categorie: 'marechaire' | 'agricol';
  region: string,
  annee: number;

  created_at: string;
  updated_at: string;
}


export interface VisitorMenuItem {
  path: string;
  icon: any; // Lucide icon component
  label: string;
  badge?: string;
}
