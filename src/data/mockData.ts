// AgroviaTech - Données simulées pour démonstration
// Ces données représentent 5 parcelles avec un historique de 3 mois

export type CultureType = 'maïs' | 'blé' | 'tomates' | 'pommes de terre' | 'riz';

export interface Parcelle {
  id: string;
  nom: string;
  surface: number; // en hectares
  typeCulture: CultureType;
  localisation: string;
  dateCreation: string;
  statut: 'active' | 'en repos' | 'en préparation';
}

export interface Culture {
  id: string;
  parcelleId: string;
  type: CultureType;
  dateSemis: string;
  dateRecolte: string | null;
  statut: 'en croissance' | 'mature' | 'récoltée';
}

export interface Recolte {
  id: string;
  cultureId: string;
  parcelleId: string;
  date: string;
  quantiteRecoltee: number; // en kg
  quantiteStockee: number; // en kg
  pertes: number; // en kg
  qualite: 'excellente' | 'bonne' | 'moyenne' | 'faible';
}

export interface Alerte {
  id: string;
  parcelleId: string;
  type: 'irrigation' | 'maladie' | 'météo' | 'stockage' | 'récolte';
  message: string;
  priorite: 'haute' | 'moyenne' | 'basse';
  date: string;
  statut: 'active' | 'résolue';
}

export interface Prediction {
  parcelleId: string;
  rendementPrevu: number; // en kg/ha
  pertesEstimees: number; // en pourcentage
  recommandations: string[];
  confiance: number; // pourcentage de confiance
}

// Parcelles simulées
export const parcelles: Parcelle[] = [
  {
    id: 'p1',
    nom: 'Parcelle Nord - Champ Principal',
    surface: 12.5,
    typeCulture: 'maïs',
    localisation: 'Secteur A - Nord',
    dateCreation: '2024-01-15',
    statut: 'active',
  },
  {
    id: 'p2',
    nom: 'Parcelle Est - Blé d\'hiver',
    surface: 8.3,
    typeCulture: 'blé',
    localisation: 'Secteur B - Est',
    dateCreation: '2024-02-01',
    statut: 'active',
  },
  {
    id: 'p3',
    nom: 'Serre Sud - Tomates',
    surface: 2.1,
    typeCulture: 'tomates',
    localisation: 'Secteur C - Sud',
    dateCreation: '2024-03-10',
    statut: 'active',
  },
  {
    id: 'p4',
    nom: 'Parcelle Ouest - Pommes de terre',
    surface: 6.7,
    typeCulture: 'pommes de terre',
    localisation: 'Secteur D - Ouest',
    dateCreation: '2024-02-20',
    statut: 'active',
  },
  {
    id: 'p5',
    nom: 'Rizière Centrale',
    surface: 15.0,
    typeCulture: 'riz',
    localisation: 'Secteur E - Centre',
    dateCreation: '2024-01-05',
    statut: 'active',
  },
];

// Cultures associées aux parcelles
export const cultures: Culture[] = [
  {
    id: 'c1',
    parcelleId: 'p1',
    type: 'maïs',
    dateSemis: '2024-04-15',
    dateRecolte: null,
    statut: 'en croissance',
  },
  {
    id: 'c2',
    parcelleId: 'p2',
    type: 'blé',
    dateSemis: '2024-03-01',
    dateRecolte: '2024-08-15',
    statut: 'mature',
  },
  {
    id: 'c3',
    parcelleId: 'p3',
    type: 'tomates',
    dateSemis: '2024-05-01',
    dateRecolte: null,
    statut: 'en croissance',
  },
  {
    id: 'c4',
    parcelleId: 'p4',
    type: 'pommes de terre',
    dateSemis: '2024-04-01',
    dateRecolte: null,
    statut: 'mature',
  },
  {
    id: 'c5',
    parcelleId: 'p5',
    type: 'riz',
    dateSemis: '2024-03-15',
    dateRecolte: null,
    statut: 'en croissance',
  },
];

// Historique des récoltes (3 mois)
export const recoltes: Recolte[] = [
  // Septembre 2024
  {
    id: 'r1',
    cultureId: 'c2',
    parcelleId: 'p2',
    date: '2024-09-01',
    quantiteRecoltee: 45000,
    quantiteStockee: 43200,
    pertes: 1800,
    qualite: 'excellente',
  },
  {
    id: 'r2',
    cultureId: 'c3',
    parcelleId: 'p3',
    date: '2024-09-10',
    quantiteRecoltee: 8500,
    quantiteStockee: 8000,
    pertes: 500,
    qualite: 'bonne',
  },
  // Octobre 2024
  {
    id: 'r3',
    cultureId: 'c4',
    parcelleId: 'p4',
    date: '2024-10-05',
    quantiteRecoltee: 52000,
    quantiteStockee: 49400,
    pertes: 2600,
    qualite: 'bonne',
  },
  {
    id: 'r4',
    cultureId: 'c3',
    parcelleId: 'p3',
    date: '2024-10-15',
    quantiteRecoltee: 7200,
    quantiteStockee: 6800,
    pertes: 400,
    qualite: 'excellente',
  },
  {
    id: 'r5',
    cultureId: 'c5',
    parcelleId: 'p5',
    date: '2024-10-20',
    quantiteRecoltee: 75000,
    quantiteStockee: 71250,
    pertes: 3750,
    qualite: 'bonne',
  },
  // Novembre 2024
  {
    id: 'r6',
    cultureId: 'c1',
    parcelleId: 'p1',
    date: '2024-11-01',
    quantiteRecoltee: 87500,
    quantiteStockee: 83125,
    pertes: 4375,
    qualite: 'excellente',
  },
  {
    id: 'r7',
    cultureId: 'c3',
    parcelleId: 'p3',
    date: '2024-11-10',
    quantiteRecoltee: 6000,
    quantiteStockee: 5700,
    pertes: 300,
    qualite: 'moyenne',
  },
];

// Alertes simulées
export const alertes: Alerte[] = [
  {
    id: 'a1',
    parcelleId: 'p1',
    type: 'irrigation',
    message: 'Niveau d\'humidité bas détecté. Irrigation recommandée dans les 24h.',
    priorite: 'haute',
    date: '2024-11-27T08:00:00',
    statut: 'active',
  },
  {
    id: 'a2',
    parcelleId: 'p3',
    type: 'maladie',
    message: 'Risque de moisissure détecté. Vérification des plants recommandée.',
    priorite: 'haute',
    date: '2024-11-27T06:30:00',
    statut: 'active',
  },
  {
    id: 'a3',
    parcelleId: 'p5',
    type: 'météo',
    message: 'Fortes pluies prévues dans 48h. Prévoir drainage.',
    priorite: 'moyenne',
    date: '2024-11-26T14:00:00',
    statut: 'active',
  },
  {
    id: 'a4',
    parcelleId: 'p4',
    type: 'récolte',
    message: 'Culture mature. Période optimale de récolte cette semaine.',
    priorite: 'moyenne',
    date: '2024-11-26T09:00:00',
    statut: 'active',
  },
  {
    id: 'a5',
    parcelleId: 'p2',
    type: 'stockage',
    message: 'Capacité de stockage à 85%. Planifier évacuation.',
    priorite: 'basse',
    date: '2024-11-25T16:00:00',
    statut: 'active',
  },
];

// Prédictions IA simulées
export const predictions: Prediction[] = [
  {
    parcelleId: 'p1',
    rendementPrevu: 7200,
    pertesEstimees: 4.5,
    recommandations: [
      'Augmenter la fréquence d\'irrigation',
      'Appliquer engrais azoté dans 2 semaines',
      'Surveiller les ravageurs',
    ],
    confiance: 87,
  },
  {
    parcelleId: 'p2',
    rendementPrevu: 5400,
    pertesEstimees: 3.8,
    recommandations: [
      'Rendement optimal atteint',
      'Préparer le stockage',
      'Planifier rotation des cultures',
    ],
    confiance: 92,
  },
  {
    parcelleId: 'p3',
    rendementPrevu: 4500,
    pertesEstimees: 6.2,
    recommandations: [
      'Traitement fongicide recommandé',
      'Améliorer la ventilation de la serre',
      'Récolter les fruits mûrs rapidement',
    ],
    confiance: 78,
  },
  {
    parcelleId: 'p4',
    rendementPrevu: 7800,
    pertesEstimees: 4.0,
    recommandations: [
      'Période de récolte idéale',
      'Vérifier la qualité du stockage',
      'Préparer le sol pour la prochaine saison',
    ],
    confiance: 85,
  },
  {
    parcelleId: 'p5',
    rendementPrevu: 5000,
    pertesEstimees: 5.0,
    recommandations: [
      'Maintenir le niveau d\'eau optimal',
      'Surveiller la croissance',
      'Préparer le drainage avant les pluies',
    ],
    confiance: 81,
  },
];

// Données pour les graphiques
export const donneesRendement = [
  { mois: 'Sept', maïs: 0, blé: 5420, tomates: 4048, pdt: 0, riz: 0 },
  { mois: 'Oct', maïs: 0, blé: 0, tomates: 3429, pdt: 7761, riz: 5000 },
  { mois: 'Nov', maïs: 7000, blé: 0, tomates: 2857, pdt: 0, riz: 0 },
];

export const donneesPertes = [
  { mois: 'Sept', pertes: 2300, stockees: 51200 },
  { mois: 'Oct', pertes: 6750, stockees: 127450 },
  { mois: 'Nov', pertes: 4675, stockees: 88825 },
];

// Statistiques globales
export const statistiquesGlobales = {
  surfaceTotale: parcelles.reduce((acc, p) => acc + p.surface, 0),
  nombreParcelles: parcelles.length,
  recolteTotale: recoltes.reduce((acc, r) => acc + r.quantiteRecoltee, 0),
  pertesTotales: recoltes.reduce((acc, r) => acc + r.pertes, 0),
  tauxPerte: 0,
  alertesActives: alertes.filter((a) => a.statut === 'active').length,
};

statistiquesGlobales.tauxPerte = (statistiquesGlobales.pertesTotales / statistiquesGlobales.recolteTotale) * 100;

// Icônes par type de culture
export const cultureIcons: Record<CultureType, string> = {
  maïs: '🌽',
  blé: '🌾',
  tomates: '🍅',
  'pommes de terre': '🥔',
  riz: '🌾',
};

// Couleurs par type de culture pour les graphiques
export const cultureColors: Record<CultureType, string> = {
  maïs: 'hsl(43, 85%, 46%)',
  blé: 'hsl(38, 70%, 50%)',
  tomates: 'hsl(0, 72%, 51%)',
  'pommes de terre': 'hsl(30, 50%, 45%)',
  riz: 'hsl(100, 40%, 50%)',
};
