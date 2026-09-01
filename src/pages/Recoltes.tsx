import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { RecolteForm } from '@/components/forms/RecolteForm';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { recoltes as initialRecoltes, parcelles, type Recolte } from '@/data/mockData';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { createRecolte, deleteRecolte, fetchRecoltes, updateRecolte } from '@/lib/agricultureApi';

const Recoltes = () => {
  const [recoltesList, setRecoltesList] = useState<Recolte[]>(initialRecoltes);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRecolte, setSelectedRecolte] = useState<Recolte | undefined>();

  useEffect(() => {
    let isMounted = true;

    const loadRecoltes = async () => {
      try {
        const data = await fetchRecoltes();
        if (isMounted) {
          setRecoltesList(data.length > 0 ? data : initialRecoltes);
        }
      } catch {
        if (isMounted) setRecoltesList(initialRecoltes);
      }
    };

    void loadRecoltes();
    return () => {
      isMounted = false;
    };
  }, []);

  const getParcelleName = (parcelleId: string) => {
    return parcelles.find((p) => p.id === parcelleId)?.nom || 'Parcelle inconnue';
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatQuantity = (kg: number) => {
    if (kg >= 1000) {
      return `${(kg / 1000).toFixed(1)} T`;
    }
    return `${kg.toLocaleString('fr-FR')} kg`;
  };

  const handleSubmitRecolte = async (data: Partial<Recolte>) => {
    try {
      if (selectedRecolte) {
        const updated = await updateRecolte(selectedRecolte.id, data);
        const merged = {
          ...selectedRecolte,
          ...data,
          id: String(updated?.id ?? selectedRecolte.id),
        } as Recolte;

        setRecoltesList((prev) =>
          prev.map((r) => (r.id === selectedRecolte.id ? merged : r))
        );
      } else {
        const created = await createRecolte(data);
        const newRecolte = {
          ...data,
          id: String(created?.id ?? `r${Date.now()}`),
          date: data.date || new Date().toISOString().split('T')[0],
          quantiteStockee: Number(data.quantiteStockee ?? 0),
          pertes: Number(data.pertes ?? 0),
        } as Recolte;

        setRecoltesList((prev) => [...prev, newRecolte]);
      }

      setSelectedRecolte(undefined);
      setIsFormOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Erreur lors de l’enregistrement de la récolte'
      );
    }
  };

  const handleDeleteRecolte = async (id: string) => {
    try {
      await deleteRecolte(id);
      setRecoltesList((prev) => prev.filter((r) => r.id !== id));
      toast.success('Récolte supprimée');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la suppression');
    }
  };

  const handleEditRecolte = (recolte: Recolte) => {
    setSelectedRecolte(recolte);
    setIsFormOpen(true);
  };

  const qualiteBadgeVariant = (qualite: string) => {
    switch (qualite) {
      case 'excellente':
        return 'success';
      case 'bonne':
        return 'info';
      case 'moyenne':
        return 'warning';
      case 'faible':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const totaux = recoltesList.reduce(
    (acc, r) => ({
      recoltee: acc.recoltee + r.quantiteRecoltee,
      stockee: acc.stockee + r.quantiteStockee,
      pertes: acc.pertes + r.pertes,
    }),
    { recoltee: 0, stockee: 0, pertes: 0 }
  );

  return (
    <MainLayout
      title="Récoltes"
      subtitle={`${recoltesList.length} récoltes enregistrées`}
    >
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total récolté
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              {formatQuantity(totaux.recoltee)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total stocké
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-success">
              {formatQuantity(totaux.stockee)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total pertes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-destructive">
              {formatQuantity(totaux.pertes)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-4 flex justify-end">
        <Button
          onClick={() => {
            setSelectedRecolte(undefined);
            setIsFormOpen(true);
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Enregistrer une récolte
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Parcelle</TableHead>
                  <TableHead className="text-right">Récoltée</TableHead>
                  <TableHead className="text-right">Stockée</TableHead>
                  <TableHead className="text-right">Pertes</TableHead>
                  <TableHead>Qualité</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recoltesList.map((recolte) => (
                  <TableRow key={recolte.id}>
                    <TableCell className="font-medium">
                      {formatDate(recolte.date)}
                    </TableCell>
                    <TableCell>{getParcelleName(recolte.parcelleId)}</TableCell>
                    <TableCell className="text-right">
                      {formatQuantity(recolte.quantiteRecoltee)}
                    </TableCell>
                    <TableCell className="text-right text-success">
                      {formatQuantity(recolte.quantiteStockee)}
                    </TableCell>
                    <TableCell className="text-right text-destructive">
                      {formatQuantity(recolte.pertes)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={qualiteBadgeVariant(recolte.qualite) as any}
                        className="capitalize"
                      >
                        {recolte.qualite}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditRecolte(recolte)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteRecolte(recolte.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <RecolteForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        recolte={selectedRecolte}
        onSubmit={handleSubmitRecolte}
      />
    </MainLayout>
  );
};

export default Recoltes;
