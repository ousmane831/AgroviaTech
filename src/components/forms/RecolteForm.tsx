import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Recolte, parcelles } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

// Schéma de validation avec Zod
const recolteSchema = z.object({
  parcelleId: z.string().min(1, 'Sélectionnez une parcelle'),
  date: z.string().min(1, 'La date est requise'),
  quantiteRecoltee: z.number().min(1, 'La quantité doit être supérieure à 0'),
  quantiteStockee: z.number().min(0, 'La quantité stockée ne peut pas être négative'),
  pertes: z.number().min(0, 'Les pertes ne peuvent pas être négatives'),
  qualite: z.enum(['excellente', 'bonne', 'moyenne', 'faible'] as const),
});

type RecolteFormData = z.infer<typeof recolteSchema>;

interface RecolteFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recolte?: Recolte;
  onSubmit: (data: Partial<Recolte>) => void;
}

const qualiteOptions = ['excellente', 'bonne', 'moyenne', 'faible'] as const;

export function RecolteForm({
  open,
  onOpenChange,
  recolte,
  onSubmit,
}: RecolteFormProps) {
  const isEditing = !!recolte;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RecolteFormData>({
    resolver: zodResolver(recolteSchema),
    defaultValues: recolte
      ? {
          parcelleId: recolte.parcelleId,
          date: recolte.date,
          quantiteRecoltee: recolte.quantiteRecoltee,
          quantiteStockee: recolte.quantiteStockee,
          pertes: recolte.pertes,
          qualite: recolte.qualite,
        }
      : {
          parcelleId: '',
          date: new Date().toISOString().split('T')[0],
          quantiteRecoltee: 0,
          quantiteStockee: 0,
          pertes: 0,
          qualite: 'bonne',
        },
  });

  const parcelleId = watch('parcelleId');
  const qualite = watch('qualite');
  const quantiteRecoltee = watch('quantiteRecoltee');

  // Calculer automatiquement les pertes
  const handleQuantiteStockeeChange = (value: number) => {
    setValue('quantiteStockee', value);
    const pertes = Math.max(0, quantiteRecoltee - value);
    setValue('pertes', pertes);
  };

  const handleFormSubmit = (data: RecolteFormData) => {
    onSubmit({
      ...data,
      id: recolte?.id || `r${Date.now()}`,
      cultureId: `c${data.parcelleId.slice(1)}`,
    });
    toast.success(
      isEditing ? 'Récolte modifiée avec succès' : 'Récolte enregistrée avec succès'
    );
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Modifier la récolte' : 'Enregistrer une récolte'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Modifiez les informations de la récolte.'
              : 'Saisissez les données de la récolte.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Parcelle */}
          <div className="space-y-2">
            <Label>Parcelle</Label>
            <Select
              value={parcelleId}
              onValueChange={(value) => setValue('parcelleId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une parcelle" />
              </SelectTrigger>
              <SelectContent>
                {parcelles.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.parcelleId && (
              <p className="text-xs text-destructive">{errors.parcelleId.message}</p>
            )}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Date de récolte</Label>
            <Input id="date" type="date" {...register('date')} />
            {errors.date && (
              <p className="text-xs text-destructive">{errors.date.message}</p>
            )}
          </div>

          {/* Quantité récoltée */}
          <div className="space-y-2">
            <Label htmlFor="quantiteRecoltee">Quantité récoltée (kg)</Label>
            <Input
              id="quantiteRecoltee"
              type="number"
              placeholder="Ex: 10000"
              {...register('quantiteRecoltee', { valueAsNumber: true })}
            />
            {errors.quantiteRecoltee && (
              <p className="text-xs text-destructive">
                {errors.quantiteRecoltee.message}
              </p>
            )}
          </div>

          {/* Quantité stockée */}
          <div className="space-y-2">
            <Label htmlFor="quantiteStockee">Quantité stockée (kg)</Label>
            <Input
              id="quantiteStockee"
              type="number"
              placeholder="Ex: 9500"
              {...register('quantiteStockee', { valueAsNumber: true })}
              onChange={(e) => handleQuantiteStockeeChange(Number(e.target.value))}
            />
            {errors.quantiteStockee && (
              <p className="text-xs text-destructive">
                {errors.quantiteStockee.message}
              </p>
            )}
          </div>

          {/* Pertes (calculées automatiquement) */}
          <div className="space-y-2">
            <Label htmlFor="pertes">Pertes (kg)</Label>
            <Input
              id="pertes"
              type="number"
              {...register('pertes', { valueAsNumber: true })}
              className="bg-muted"
              readOnly
            />
            <p className="text-xs text-muted-foreground">
              Calculées automatiquement
            </p>
          </div>

          {/* Qualité */}
          <div className="space-y-2">
            <Label>Qualité</Label>
            <Select
              value={qualite}
              onValueChange={(value) =>
                setValue(
                  'qualite',
                  value as 'excellente' | 'bonne' | 'moyenne' | 'faible'
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Évaluez la qualité" />
              </SelectTrigger>
              <SelectContent>
                {qualiteOptions.map((q) => (
                  <SelectItem key={q} value={q} className="capitalize">
                    {q}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.qualite && (
              <p className="text-xs text-destructive">{errors.qualite.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isEditing ? 'Enregistrer' : 'Ajouter'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
