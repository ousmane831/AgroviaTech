import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ParcelleCard } from '@/components/dashboard/ParcelleCard';
import { ParcelleForm } from '@/components/forms/ParcelleForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { parcelles as initialParcelles, Parcelle, CultureType } from '@/data/mockData';
import { Plus, Search, Filter } from 'lucide-react';

/**
 * Page de gestion des parcelles
 * Permet d'afficher, filtrer, ajouter et modifier les parcelles
 */
const Parcelles = () => {
  const [parcellesList, setParcellesList] = useState<Parcelle[]>(initialParcelles);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCulture, setFilterCulture] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedParcelle, setSelectedParcelle] = useState<Parcelle | undefined>();

  // Filtrer les parcelles
  const filteredParcelles = parcellesList.filter((p) => {
    const matchesSearch =
      p.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.localisation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCulture =
      filterCulture === 'all' || p.typeCulture === filterCulture;
    return matchesSearch && matchesCulture;
  });

  // Gérer l'ajout/modification d'une parcelle
  const handleSubmitParcelle = (data: Partial<Parcelle>) => {
    if (selectedParcelle) {
      // Modification
      setParcellesList((prev) =>
        prev.map((p) => (p.id === selectedParcelle.id ? { ...p, ...data } as Parcelle : p))
      );
    } else {
      // Ajout
      setParcellesList((prev) => [...prev, data as Parcelle]);
    }
    setSelectedParcelle(undefined);
  };

  // Ouvrir le formulaire d'édition
  const handleEditParcelle = (parcelle: Parcelle) => {
    setSelectedParcelle(parcelle);
    setIsFormOpen(true);
  };

  // Ouvrir le formulaire d'ajout
  const handleAddParcelle = () => {
    setSelectedParcelle(undefined);
    setIsFormOpen(true);
  };

  return (
    <MainLayout
      title="Parcelles"
      subtitle={`${parcellesList.length} parcelles enregistrées`}
    >
      {/* Barre d'outils */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-3">
          {/* Recherche */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher une parcelle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Filtre par culture */}
          <Select value={filterCulture} onValueChange={setFilterCulture}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filtrer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les cultures</SelectItem>
              <SelectItem value="maïs">Maïs</SelectItem>
              <SelectItem value="blé">Blé</SelectItem>
              <SelectItem value="tomates">Tomates</SelectItem>
              <SelectItem value="pommes de terre">Pommes de terre</SelectItem>
              <SelectItem value="riz">Riz</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bouton d'ajout */}
        <Button onClick={handleAddParcelle} className="gap-2">
          <Plus className="h-4 w-4" />
          Ajouter une parcelle
        </Button>
      </div>

      {/* Liste des parcelles */}
      {filteredParcelles.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredParcelles.map((parcelle) => (
            <ParcelleCard
              key={parcelle.id}
              parcelle={parcelle}
              onClick={() => handleEditParcelle(parcelle)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 rounded-full bg-muted p-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-foreground">
            Aucune parcelle trouvée
          </h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Modifiez vos filtres ou ajoutez une nouvelle parcelle.
          </p>
          <Button onClick={handleAddParcelle} className="gap-2">
            <Plus className="h-4 w-4" />
            Ajouter une parcelle
          </Button>
        </div>
      )}

      {/* Formulaire */}
      <ParcelleForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        parcelle={selectedParcelle}
        onSubmit={handleSubmitParcelle}
      />
    </MainLayout>
  );
};

export default Parcelles;
