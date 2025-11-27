import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Parcelle, CultureType } from '@/data/mockData';
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
const parcelleSchema = z.object({
  nom: z.string().min(3, 'Le nom doit contenir au moins 3 caractères'),
  surface: z.number().min(0.1, 'La surface doit être supérieure à 0.1 ha'),
  typeCulture: z.enum(['maïs', 'blé', 'tomates', 'pommes de terre', 'riz'] as const),
  localisation: z.string().min(3, 'La localisation doit contenir au moins 3 caractères'),
  statut: z.enum(['active', 'en repos', 'en préparation'] as const),
});

type ParcelleFormData = z.infer<typeof parcelleSchema>;

interface ParcelleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parcelle?: Parcelle;
  onSubmit: (data: Partial<Parcelle>) => void;
}

const cultureTypes: CultureType[] = ['maïs', 'blé', 'tomates', 'pommes de terre', 'riz'];
const statutOptions = ['active', 'en repos', 'en préparation'] as const;

export function ParcelleForm({
  open,
  onOpenChange,
  parcelle,
  onSubmit,
}: ParcelleFormProps) {
  const isEditing = !!parcelle;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ParcelleFormData>({
    resolver: zodResolver(parcelleSchema),
    defaultValues: parcelle
      ? {
          nom: parcelle.nom,
          surface: parcelle.surface,
          typeCulture: parcelle.typeCulture,
          localisation: parcelle.localisation,
          statut: parcelle.statut,
        }
      : {
          nom: '',
          surface: 1,
          typeCulture: 'maïs',
          localisation: '',
          statut: 'active',
        },
  });

  const typeCulture = watch('typeCulture');
  const statut = watch('statut');

  const handleFormSubmit = (data: ParcelleFormData) => {
    onSubmit({
      ...data,
      id: parcelle?.id || `p${Date.now()}`,
      dateCreation: parcelle?.dateCreation || new Date().toISOString().split('T')[0],
    });
    toast.success(
      isEditing ? 'Parcelle modifiée avec succès' : 'Parcelle ajoutée avec succès'
    );
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Modifier la parcelle' : 'Ajouter une parcelle'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Modifiez les informations de la parcelle.'
              : 'Remplissez les informations pour créer une nouvelle parcelle.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Nom */}
          <div className="space-y-2">
            <Label htmlFor="nom">Nom de la parcelle</Label>
            <Input
              id="nom"
              placeholder="Ex: Parcelle Nord - Champ Principal"
              {...register('nom')}
            />
            {errors.nom && (
              <p className="text-xs text-destructive">{errors.nom.message}</p>
            )}
          </div>

          {/* Surface */}
          <div className="space-y-2">
            <Label htmlFor="surface">Surface (hectares)</Label>
            <Input
              id="surface"
              type="number"
              step="0.1"
              placeholder="Ex: 12.5"
              {...register('surface', { valueAsNumber: true })}
            />
            {errors.surface && (
              <p className="text-xs text-destructive">{errors.surface.message}</p>
            )}
          </div>

          {/* Type de culture */}
          <div className="space-y-2">
            <Label>Type de culture</Label>
            <Select
              value={typeCulture}
              onValueChange={(value) => setValue('typeCulture', value as CultureType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une culture" />
              </SelectTrigger>
              <SelectContent>
                {cultureTypes.map((type) => (
                  <SelectItem key={type} value={type} className="capitalize">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.typeCulture && (
              <p className="text-xs text-destructive">{errors.typeCulture.message}</p>
            )}
          </div>

          {/* Localisation */}
          <div className="space-y-2">
            <Label htmlFor="localisation">Localisation</Label>
            <Input
              id="localisation"
              placeholder="Ex: Secteur A - Nord"
              {...register('localisation')}
            />
            {errors.localisation && (
              <p className="text-xs text-destructive">{errors.localisation.message}</p>
            )}
          </div>

          {/* Statut */}
          <div className="space-y-2">
            <Label>Statut</Label>
            <Select
              value={statut}
              onValueChange={(value) =>
                setValue('statut', value as 'active' | 'en repos' | 'en préparation')
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un statut" />
              </SelectTrigger>
              <SelectContent>
                {statutOptions.map((s) => (
                  <SelectItem key={s} value={s} className="capitalize">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.statut && (
              <p className="text-xs text-destructive">{errors.statut.message}</p>
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
