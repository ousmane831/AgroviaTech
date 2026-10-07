import csv
import io
import zipfile

from django.core.management.base import BaseCommand

from agriculture.models import CultureDataset


class Command(BaseCommand):
    help = "Importe les données de culture depuis dataset.zip"

    def handle(self, *args, **options):
        zip_path = "dataset.zip"

        with zipfile.ZipFile(zip_path) as z:
            raw = z.read(
                "input/culture/culture.csv"
            ).decode("cp1252")

        # Chaque ligne du fichier est entourée de guillemets.
        # On retire uniquement ces guillemets extérieurs avant
        # de laisser csv.reader interpréter les virgules.
        lines = raw.splitlines()

        rows = [
            next(
                csv.reader(
                    [line.strip().strip('"')],
                    delimiter=","
                )
            )
            for line in lines
            if line.strip()
        ]

        if not rows:
            self.stdout.write(
                self.style.WARNING("Aucune donnée trouvée.")
            )
            return

        headers = rows[0]
        expected_headers = [
            "id_culture",
            "nom_culture",
            "type",
            "saison",
            "duree_cycle_jours",
            "rendement_moyen_t_ha",
            "besoin_eau_mm_cycle",
            "id_parcelle",
            "id_producteur",
        ]

        if headers != expected_headers:
            raise ValueError(
                f"Colonnes inattendues : {headers}"
            )

        created = 0
        updated = 0

        for row in rows[1:]:
            if len(row) != len(headers):
                self.stdout.write(
                    self.style.WARNING(
                        f"Ligne ignorée : {row}"
                    )
                )
                continue

            (
                id_culture,
                nom_culture,
                type_culture,
                saison,
                duree_cycle_jours,
                rendement_moyen_t_ha,
                besoin_eau_mm_cycle,
                id_parcelle,
                id_producteur,
            ) = row

            _, was_created = CultureDataset.objects.update_or_create(
                id_culture=id_culture,
                defaults={
                    "nom_culture": nom_culture,
                    "type": type_culture,
                    "saison": saison,
                    "duree_cycle_jours": int(duree_cycle_jours),
                    "rendement_moyen_t_ha": rendement_moyen_t_ha,
                    "besoin_eau_mm_cycle": besoin_eau_mm_cycle,
                    "id_parcelle_dataset": id_parcelle,
                    "id_producteur_dataset": id_producteur,
                },
            )

            if was_created:
                created += 1
            else:
                updated += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Import terminé : {created} créées, "
                f"{updated} mises à jour."
            )
        )