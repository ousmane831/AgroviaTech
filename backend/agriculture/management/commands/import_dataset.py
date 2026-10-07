import csv
import io
import zipfile
from decimal import Decimal

from django.conf import settings
from django.core.management.base import BaseCommand
from django.db import transaction

from agriculture.models import Parcelle
from users.models import User


class Command(BaseCommand):
    help = "Importe les parcelles depuis dataset.zip"

    def handle(self, *args, **options):
        dataset_path = settings.BASE_DIR / "dataset.zip"

        if not dataset_path.exists():
            self.stderr.write(
                self.style.ERROR(
                    f"Dataset introuvable : {dataset_path}"
                )
            )
            return

        try:
            proprietaire = User.objects.get(username="dataset_import")
        except User.DoesNotExist:
            self.stderr.write(
                self.style.ERROR(
                    "L'utilisateur 'dataset_import' n'existe pas."
                )
            )
            return

        with zipfile.ZipFile(dataset_path, "r") as z:
            with z.open("input/parcelles/parcelles.csv") as file:
                text_file = io.TextIOWrapper(file, encoding="utf-8")
                rows = list(csv.DictReader(text_file))

        if not rows:
            self.stderr.write(
                self.style.ERROR("Aucune parcelle trouvée dans le dataset.")
            )
            return

        imported = 0
        updated = 0

        with transaction.atomic():
            for row in rows:
                id_externe = row["id_parcelle"].strip()
                nom = row["nom"].strip()
                culture = row["culture"].strip()
                type_sol = row["type_sol"].strip()
                date_plantation = row["date_plantation"].strip()

                surface_m2 = Decimal(row["surface_m2"])
                surface_hectares = surface_m2 / Decimal("10000")

                culture_lower = culture.lower()

                culture_mapping = {
                    "maïs": "maïs",
                    "mais": "maïs",
                    "riz": "riz",
                    "arachide": "arachide",
                    "mil": "mil",
                    "tomate": "tomate",
                    "oignon": "oignon",
                }

                type_culture = culture_mapping.get(
                    culture_lower,
                    "autre"
                )

                parcelle, created = Parcelle.objects.update_or_create(
                    id_externe=id_externe,
                    defaults={
                        "nom": nom,
                        "type_culture": type_culture,
                        "culture_dataset": culture,
                        "surface": surface_hectares,
                        "localisation": "Dataset",
                        "type_sol": type_sol,
                        "date_plantation": date_plantation or None,
                        "statut": "active",
                        "proprietaire": proprietaire,
                    },
                )

                if created:
                    imported += 1
                else:
                    updated += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Import terminé : {imported} créées, {updated} mises à jour."
            )
        )