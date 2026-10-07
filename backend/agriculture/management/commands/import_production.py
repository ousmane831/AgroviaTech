import csv
import io
import zipfile
from datetime import datetime
from decimal import Decimal

from django.conf import settings
from django.core.management.base import BaseCommand
from django.db import transaction

from agriculture.models import DonneeProduction, Parcelle


class Command(BaseCommand):
    help = "Importe les données de production depuis dataset.zip"

    def handle(self, *args, **options):
        dataset_path = settings.BASE_DIR / "dataset.zip"

        if not dataset_path.exists():
            self.stderr.write(
                self.style.ERROR(
                    f"Dataset introuvable : {dataset_path}"
                )
            )
            return

        # Index des parcelles par identifiant du dataset.
        parcelles = {
            parcelle.id_externe: parcelle
            for parcelle in Parcelle.objects.all()
            if parcelle.id_externe
        }

        if not parcelles:
            self.stderr.write(
                self.style.ERROR(
                    "Aucune parcelle importée."
                )
            )
            return

        with zipfile.ZipFile(dataset_path, "r") as z:
            filename = "input/production/production.csv"

            if filename not in z.namelist():
                self.stderr.write(
                    self.style.ERROR(
                        f"Fichier introuvable dans le ZIP : {filename}"
                    )
                )
                return

            with z.open(filename) as file:
                text_file = io.TextIOWrapper(
                    file,
                    encoding="utf-8"
                )
                rows = list(csv.DictReader(text_file))

        if not rows:
            self.stderr.write(
                self.style.ERROR(
                    "Aucune donnée de production trouvée."
                )
            )
            return

        created = 0
        updated = 0
        skipped = 0

        with transaction.atomic():
            for row in rows:
                id_production = row["id_production"].strip()
                id_parcelle = row["id_parcelle"].strip()

                parcelle = parcelles.get(id_parcelle)

                if parcelle is None:
                    skipped += 1
                    self.stderr.write(
                        self.style.WARNING(
                            f"Parcelle inconnue : {id_parcelle} "
                            f"(production {id_production})"
                        )
                    )
                    continue

                date_production = datetime.strptime(
                    row["date_production"].strip(),
                    "%Y-%m-%d"
                ).date()

                rendement_estime = Decimal(
                    row["rendement_estime"]
                )

                volume_recolte = Decimal(
                    row["volume_recolte"]
                )

                couts_production = Decimal(
                    row["couts_production"]
                )

                production, was_created = (
                    DonneeProduction.objects.update_or_create(
                        id_production=id_production,
                        defaults={
                            "parcelle": parcelle,
                            "date_production": date_production,
                            "rendement_estime": rendement_estime,
                            "volume_recolte": volume_recolte,
                            "couts_production": couts_production,
                        },
                    )
                )

                if was_created:
                    created += 1
                else:
                    updated += 1

        self.stdout.write("")
        self.stdout.write(
            self.style.SUCCESS(
                "Import production terminé."
            )
        )
        self.stdout.write(
            f"Lignes traitées : {len(rows)}"
        )
        self.stdout.write(
            f"Productions créées : {created}"
        )
        self.stdout.write(
            f"Productions mises à jour : {updated}"
        )
        self.stdout.write(
            f"Productions ignorées : {skipped}"
        )