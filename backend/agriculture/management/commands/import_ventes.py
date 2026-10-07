import csv
import io
import zipfile
from datetime import datetime
from decimal import Decimal

from django.conf import settings
from django.core.management.base import BaseCommand
from django.db import transaction

from agriculture.models import Parcelle, VenteHistorique


class Command(BaseCommand):
    help = "Importe les ventes historiques depuis dataset.zip"

    def handle(self, *args, **options):
        dataset_path = settings.BASE_DIR / "dataset.zip"

        if not dataset_path.exists():
            self.stderr.write(
                self.style.ERROR(
                    f"Dataset introuvable : {dataset_path}"
                )
            )
            return

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

        filename = "input/ventes/ventes.csv"

        with zipfile.ZipFile(dataset_path, "r") as z:
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
                    "Aucune vente trouvée."
                )
            )
            return

        created = 0
        updated = 0
        skipped = 0

        with transaction.atomic():
            for row in rows:
                id_vente = row["id_vente"].strip()
                id_parcelle = row["id_parcelle"].strip()

                parcelle = parcelles.get(id_parcelle)

                if parcelle is None:
                    skipped += 1
                    self.stderr.write(
                        self.style.WARNING(
                            f"Parcelle inconnue : {id_parcelle} "
                            f"(vente {id_vente})"
                        )
                    )
                    continue

                date_vente = datetime.strptime(
                    row["date_vente"].strip(),
                    "%Y-%m-%d"
                ).date()

                recolte_kg = Decimal(
                    row["recolte_kg"]
                )

                vendu_kg = Decimal(
                    row["vendu_kg"]
                )

                invendu_kg = Decimal(
                    row["invendu_kg"]
                )

                prix_unitaire_eur = Decimal(
                    row["prix_unitaire_eur"]
                )

                vente, was_created = (
                    VenteHistorique.objects.update_or_create(
                        id_vente=id_vente,
                        defaults={
                            "parcelle": parcelle,
                            "date_vente": date_vente,
                            "recolte_kg": recolte_kg,
                            "vendu_kg": vendu_kg,
                            "invendu_kg": invendu_kg,
                            "prix_unitaire_eur": prix_unitaire_eur,
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
                "Import ventes terminé."
            )
        )
        self.stdout.write(
            f"Lignes traitées : {len(rows)}"
        )
        self.stdout.write(
            f"Ventes créées : {created}"
        )
        self.stdout.write(
            f"Ventes mises à jour : {updated}"
        )
        self.stdout.write(
            f"Ventes ignorées : {skipped}"
        )