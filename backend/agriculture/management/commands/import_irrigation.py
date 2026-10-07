import csv
import io
import json
import zipfile
from datetime import datetime
from decimal import Decimal

from django.conf import settings
from django.core.management.base import BaseCommand
from django.db import transaction

from agriculture.models import MesureSol, Parcelle


class Command(BaseCommand):
    help = "Importe les mesures d'irrigation depuis dataset.zip"

    def handle(self, *args, **options):
        dataset_path = settings.BASE_DIR / "dataset.zip"

        if not dataset_path.exists():
            self.stderr.write(
                self.style.ERROR(
                    f"Dataset introuvable : {dataset_path}"
                )
            )
            return

        # Index des parcelles par identifiant externe.
        parcelles = {
            parcelle.id_externe: parcelle
            for parcelle in Parcelle.objects.all()
            if parcelle.id_externe
        }

        if not parcelles:
            self.stderr.write(
                self.style.ERROR(
                    "Aucune parcelle avec id_externe trouvée. "
                    "Importe d'abord les parcelles."
                )
            )
            return

        fichiers = []

        with zipfile.ZipFile(dataset_path, "r") as z:
            fichiers = sorted(
                name
                for name in z.namelist()
                if name.startswith("input/irrigation/")
                and name.endswith(".json")
            )

            if not fichiers:
                self.stderr.write(
                    self.style.ERROR(
                        "Aucun fichier JSON d'irrigation trouvé."
                    )
                )
                return

            total_created = 0
            total_updated = 0
            total_skipped = 0

            with transaction.atomic():
                for filename in fichiers:
                    self.stdout.write(
                        f"Traitement : {filename}"
                    )

                    raw_data = z.read(filename)
                    measurements = json.loads(
                        raw_data.decode("utf-8")
                    )

                    for item in measurements:
                        id_parcelle = item["id_parcelle"].strip()

                        parcelle = parcelles.get(id_parcelle)

                        if parcelle is None:
                            total_skipped += 1
                            self.stderr.write(
                                self.style.WARNING(
                                    f"Parcelle inconnue : {id_parcelle}"
                                )
                            )
                            continue

                        timestamp = datetime.fromisoformat(
                            item["timestamp"]
                        )

                        volume_eau = Decimal(
                            str(item["volume_eau_m3"])
                        )

                        humidite_sol = Decimal(
                            str(item["humidite_sol_pct"])
                        )

                        capteur_id = item["capteur_id"].strip()

                        mesure, created = MesureSol.objects.update_or_create(
                            parcelle=parcelle,
                            timestamp=timestamp,
                            defaults={
                                "volume_eau_m3": volume_eau,
                                "humidite_sol_pct": humidite_sol,
                                "capteur_id": capteur_id,
                            },
                        )

                        if created:
                            total_created += 1
                        else:
                            total_updated += 1

        self.stdout.write("")
        self.stdout.write(
            self.style.SUCCESS(
                "Import irrigation terminé."
            )
        )
        self.stdout.write(
            f"Fichiers traités : {len(fichiers)}"
        )
        self.stdout.write(
            f"Mesures créées : {total_created}"
        )
        self.stdout.write(
            f"Mesures mises à jour : {total_updated}"
        )
        self.stdout.write(
            f"Mesures ignorées : {total_skipped}"
        )