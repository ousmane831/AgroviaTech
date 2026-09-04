import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { VisitorLayout } from '@/components/layout/VisitorLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { PublicStats } from '@/types/visitor';
import { useAgriculteurRequest } from '@/hooks/useAgriculteurRequest';
import { useAuth } from '@/hooks/useAuth';
import { Leaf, Sprout, Droplets, Users, TreePine } from 'lucide-react';

// Données de démonstration pour les statistiques publiques
const mockPublicStats: PublicStats[] = [
  // Dakar
  {
    id: '1',
    titre: 'Arrachides',
    prix: 520,
    unite: 'FCFA/KG',
    description: 'Prix moyen marché local',
    categorie: 'agricol',
    region: 'Dakar',
    annee: 2024,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    titre: 'Tomates',
    prix: 600,
    unite: 'FCFA/KG',
    description: 'Tomates fraîches – production maraîchère',
    categorie: 'marechaire',
    region: 'Dakar',
    annee: 2024,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    titre: 'Mil',
    prix: 380,
    unite: 'FCFA/KG',
    description: 'Mil local – prix moyen saisonnier',
    categorie: 'agricol',
    region: 'Dakar',
    annee: 2024,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    titre: 'Carottes',
    prix: 450,
    unite: 'FCFA/KG',
    description: 'Carottes fraîches – production maraîchère',
    categorie: 'marechaire',
    region: 'Dakar',
    annee: 2024,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  // Thiès
  {
    id: '5',
    titre: 'Maïs',
    prix: 410,
    unite: 'FCFA/KG',
    description: 'Prix moyen du maïs sec',
    categorie: 'agricol',
    region: 'Thiès',
    annee: 2024,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '6',
    titre: 'Oignons',
    prix: 480,
    unite: 'FCFA/KG',
    description: 'Oignons locaux – prix moyen saisonnier',
    categorie: 'marechaire',
    region: 'Thiès',
    annee: 2024,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '7',
    titre: 'Sorgho',
    prix: 350,
    unite: 'FCFA/KG',
    description: 'Sorgho local – prix moyen',
    categorie: 'agricol',
    region: 'Thiès',
    annee: 2024,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '8',
    titre: 'Poivrons',
    prix: 520,
    unite: 'FCFA/KG',
    description: 'Poivrons frais – production maraîchère',
    categorie: 'marechaire',
    region: 'Thiès',
    annee: 2024,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  // Kédougou
  {
    id: '9',
    titre: 'Riz',
    prix: 550,
    unite: 'FCFA/KG',
    description: 'Riz local – prix moyen',
    categorie: 'agricol',
    region: 'Kédougou',
    annee: 2024,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '10',
    titre: 'Aubergines',
    prix: 420,
    unite: 'FCFA/KG',
    description: 'Aubergines fraîches – production maraîchère',
    categorie: 'marechaire',
    region: 'Kédougou',
    annee: 2024,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '11',
    titre: 'Niébé',
    prix: 480,
    unite: 'FCFA/KG',
    description: 'Niébé local – prix moyen',
    categorie: 'agricol',
    region: 'Kédougou',
    annee: 2024,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '12',
    titre: 'Concombres',
    prix: 380,
    unite: 'FCFA/KG',
    description: 'Concombres frais – production maraîchère',
    categorie: 'marechaire',
    region: 'Kédougou',
    annee: 2024,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  // Saint-Louis
  {
    id: '13',
    titre: 'Blé',
    prix: 620,
    unite: 'FCFA/KG',
    description: 'Blé local – prix moyen',
    categorie: 'agricol',
    region: 'Saint-Louis',
    annee: 2024,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '14',
    titre: 'Laitues',
    prix: 320,
    unite: 'FCFA/KG',
    description: 'Laitues fraîches – production maraîchère',
    categorie: 'marechaire',
    region: 'Saint-Louis',
    annee: 2024,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '15',
    titre: 'Haricots',
    prix: 580,
    unite: 'FCFA/KG',
    description: 'Haricots secs – prix moyen',
    categorie: 'agricol',
    region: 'Saint-Louis',
    annee: 2024,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '16',
    titre: 'Choux',
    prix: 280,
    unite: 'FCFA/KG',
    description: 'Choux frais – production maraîchère',
    categorie: 'marechaire',
    region: 'Saint-Louis',
    annee: 2024,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  // Matam
  {
    id: '17',
    titre: 'Arachides',
    prix: 560,
    unite: 'FCFA/KG',
    description: 'Arachides locales – prix moyen',
    categorie: 'agricol',
    region: 'Matam',
    annee: 2024,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '18',
    titre: 'Courgettes',
    prix: 340,
    unite: 'FCFA/KG',
    description: 'Courgettes fraîches – production maraîchère',
    categorie: 'marechaire',
    region: 'Matam',
    annee: 2024,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '19',
    titre: 'Sésame',
    prix: 720,
    unite: 'FCFA/KG',
    description: 'Sésame local – prix moyen',
    categorie: 'agricol',
    region: 'Matam',
    annee: 2024,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '20',
    titre: 'Betteraves',
    prix: 460,
    unite: 'FCFA/KG',
    description: 'Betteraves fraîches – production maraîchère',
    categorie: 'marechaire',
    region: 'Matam',
    annee: 2024,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const regions = ['Dakar', 'Thiès', 'Kédougou', 'Saint-Louis', 'Matam'];


const VisitorDashboardPage = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>(regions[0]);
  const navigate = useNavigate();
  const [stats, setStats] = useState<PublicStats[]>(mockPublicStats);
  const { user, updateRole } = useAuth();
  const { 
    currentRequest, 
    isLoading: requestLoading, 
    hasPendingRequest, 
    hasApprovedRequest, 
    hasRejectedRequest
  } = useAgriculteurRequest();

  // Rediriger automatiquement si la demande est approuvée
  useEffect(() => {
    if (hasApprovedRequest && user?.role === 'VISITEUR') {
      // Mettre à jour le rôle localement et rediriger
      updateRole('AGRICULTEUR');
      navigate('/agriculteur/dashboard');
    }
  }, [hasApprovedRequest, user, updateRole, navigate]);

  const getIconForStat = (categorie: string) => {
    switch (categorie) {
      case 'marechaire':
        return TreePine;
      case 'agricol':
        return Users;
      default:
        return Leaf;
    }
  };

  const getVariantForStat = (categorie: string) => {
    switch (categorie) {
      case 'marechaire':
        return 'default';
      case 'agricol':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <VisitorLayout
      title="Dashboard Public"
      subtitle="Statistiques agricoles anonymisées et tendances du secteur"
    >
      <div className="mb-7 flex flex-col gap-3 rounded-xl border border-[#dfe5df] bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div>
          <p className="text-sm font-semibold text-[#1d2a22]">Prix agricoles par région</p>
          <p className="mt-1 text-xs text-[#69756d]">Consultez les indicateurs disponibles pour votre zone.</p>
        </div>
        <label htmlFor="region" className="text-sm font-medium text-[#1d2a22]">
          Région
        </label>
        <select
          id="region"
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="min-w-[160px] rounded-lg border border-[#cfd9d2] bg-[#f8faf8] px-3 py-2 text-sm text-[#1d2a22] focus:outline-none focus:ring-2 focus:ring-[#2d5f3a]"
        >
          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>

      <section className="mb-8">
        {(() => {
          const filteredStats = stats.filter((stat) => stat.region === selectedRegion);
          return (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {filteredStats.map((stat, index) => {
                const Icon = getIconForStat(stat.categorie);

                return (
                  <div
                    key={stat.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <StatCard
                      title={stat.titre}
                      value={`${stat.prix.toLocaleString('fr-FR')}\n${stat.unite}`}
                      subtitle={`Mis à jour: ${new Date(stat.updated_at).toLocaleTimeString('fr-FR')}`}
                      icon={Icon}
                      annee={stat.annee}
                      variant={getVariantForStat(stat.categorie)}
                    />
                  </div>
                );
              })}
            </div>
          );
        })()}
      </section>

      <section className="animate-slide-up rounded-2xl border border-[#dfe5df] bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e7f1e8] text-[#1f5a35]">
            <Leaf className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#1d2a22]">Bienvenue sur AgroviaTech</h2>
        </div>

        <p className="mb-6 max-w-[1200px] text-base leading-relaxed text-[#4e5b55]">
          Découvrez comment la technologie transforme l'agriculture en Afrique. Notre plateforme connecte les agriculteurs,
          optimise les ressources et augmente les rendements grâce à l'IoT et l'intelligence artificielle.
        </p>

        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-[18px] border border-[#8ec7a1] bg-[#eaf5ec] p-5">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#f3faf5] text-[#1d4d2d]">
              <Sprout className="h-7 w-7" />
            </div>
            <h3 className="mb-2 text-[1.1rem] font-semibold text-[#1d2a22]">Innovation</h3>
            <p className="text-[0.98rem] leading-relaxed text-[#4e5b55]">
              Capteurs IoT, IA, et technologies modernes au service de l'agriculture
            </p>
          </div>

          <div className="rounded-[18px] border border-[#9bc0ea] bg-[#eef5ff] p-5">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#f4f9ff] text-[#1d4d2d]">
              <Droplets className="h-7 w-7 text-[#2a7ad8]" />
            </div>
            <h3 className="mb-2 text-[1.1rem] font-semibold text-[#1d2a22]">Durabilité</h3>
            <p className="text-[0.98rem] leading-relaxed text-[#4e5b55]">
              Optimisation de l'eau et réduction de l'impact environnemental
            </p>
          </div>

          <div className="rounded-[18px] border border-[#d2b0e1] bg-[#f7eefb] p-5">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#fff7ff] text-[#1d4d2d]">
              <Users className="h-7 w-7 text-[#8f4ab0]" />
            </div>
            <h3 className="mb-2 text-[1.1rem] font-semibold text-[#1d2a22]">Communauté</h3>
            <p className="text-[0.98rem] leading-relaxed text-[#4e5b55]">
              Réseau d'agriculteurs partageant connaissances et meilleures pratiques
            </p>
          </div>
        </div>
      </section>
    </VisitorLayout>
  );
};

export default VisitorDashboardPage;
