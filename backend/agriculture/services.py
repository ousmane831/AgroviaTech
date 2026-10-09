import re

from django.db.models import Avg, Q, Sum

from .models import Parcelle

def resolve_parcelle_from_question(question, user):
    """
    Identifie une parcelle à partir d'une question transcrite.

    Retourne :
    - une Parcelle si une correspondance unique et autorisée est trouvée ;
    - None si aucune correspondance fiable n'est trouvée.

    Ne choisit jamais arbitrairement entre plusieurs parcelles.
    """

    if not question:
        return None

    question_normalisee = question.strip().lower()

    parcelles = Parcelle.objects.filter(
        Q(proprietaire=user) | Q(est_demo=True)
    )

    # 1. Identifiant externe exact : P020
    match_id = re.search(
        r"\bp\s*[-_]?\s*(\d{1,3})\b",
        question_normalisee
    )

    if match_id:
        numero = match_id.group(1).zfill(3)
        parcelles_id = parcelles.filter(
            id_externe__iexact=f"P{numero}"
        )

        if parcelles_id.count() == 1:
            return parcelles_id.first()

    # 2. "parcelle 20", "parcelle numéro 20", etc.
    match_parcelle = re.search(
        r"\bparcelle(?:\s+num(?:e|é)ro)?\s*(\d{1,3})\b",
        question_normalisee
    )

    if match_parcelle:
        numero = match_parcelle.group(1).zfill(3)

        parcelles_id = parcelles.filter(
            id_externe__iexact=f"P{numero}"
        )

        if parcelles_id.count() == 1:
            return parcelles_id.first()

    # 3. Recherche par nom exact
    parcelles_nom = parcelles.filter(
        nom__iexact=question.strip()
    )

    if parcelles_nom.count() == 1:
        return parcelles_nom.first()

    return None


def get_parcelle_context(parcelle):
    """
    Construit un contexte agricole compact pour une parcelle.
    La parcelle doit déjà avoir été autorisée par la vue appelante.
    """

    derniere_mesure = parcelle.mesures_sol.order_by("-timestamp").first()

    production_stats = parcelle.productions_dataset.aggregate(
        rendement_moyen=Avg("rendement_estime"),
        volume_total=Sum("volume_recolte"),
        cout_total=Sum("couts_production"),
    )

    vente_stats = parcelle.ventes_historiques.aggregate(
        recolte_total=Sum("recolte_kg"),
        vendu_total=Sum("vendu_kg"),
        invendu_total=Sum("invendu_kg"),
    )

    return {
        "parcelle": {
            "id": parcelle.id_externe,
            "nom": parcelle.nom,
            "culture": parcelle.culture_dataset,
            "type_sol": parcelle.type_sol,
            "surface_ha": float(parcelle.surface),
            "date_plantation": (
                parcelle.date_plantation.isoformat()
                if parcelle.date_plantation
                else None
            ),
        },

        "sol": {
            "derniere_mesure": (
                derniere_mesure.timestamp.isoformat()
                if derniere_mesure
                else None
            ),
            "humidite_pct": (
                float(derniere_mesure.humidite_sol_pct)
                if derniere_mesure
                else None
            ),
            "volume_eau_m3": (
                float(derniere_mesure.volume_eau_m3)
                if derniere_mesure
                else None
            ),
            "capteur_id": (
                derniere_mesure.capteur_id
                if derniere_mesure
                else None
            ),
        },

        "production": {
            "nombre_enregistrements": (
                parcelle.productions_dataset.count()
            ),
            "rendement_moyen": (
                float(production_stats["rendement_moyen"])
                if production_stats["rendement_moyen"] is not None
                else None
            ),
            "volume_total": (
                float(production_stats["volume_total"])
                if production_stats["volume_total"] is not None
                else None
            ),
            "cout_total": (
                float(production_stats["cout_total"])
                if production_stats["cout_total"] is not None
                else None
            ),
        },

        "ventes": {
            "nombre_enregistrements": (
                parcelle.ventes_historiques.count()
            ),
            "recolte_total_kg": (
                float(vente_stats["recolte_total"])
                if vente_stats["recolte_total"] is not None
                else None
            ),
            "vendu_total_kg": (
                float(vente_stats["vendu_total"])
                if vente_stats["vendu_total"] is not None
                else None
            ),
            "invendu_total_kg": (
                float(vente_stats["invendu_total"])
                if vente_stats["invendu_total"] is not None
                else None
            ),
        },
    }


def executer_intention_agricole(intention, user):
    """
    Exécute une intention comprise par Gemini
    et récupère les vraies données depuis PostgreSQL.
    """

    from .models import Parcelle
    from django.db.models import Sum, Avg

    intent = intention.intent
    parcelle_id = intention.parcelle
    metric = intention.metric

    parcelles = Parcelle.objects.filter(
        Q(proprietaire=user) | Q(est_demo=True)
    )

    # -------------------------------------------------
    # Une parcelle précise
    # -------------------------------------------------
    if parcelle_id:
        parcelle = parcelles.filter(
            id_externe__iexact=parcelle_id
        ).first()

        if not parcelle:
            return {
                "success": False,
                "error": "Parcelle introuvable."
            }

        if intent == "vente":
            stats = parcelle.ventes_historiques.aggregate(
                vendu_total_kg=Sum("vendu_kg")
            )

            return {
                "success": True,
                "intent": intent,
                "parcelle": parcelle.id_externe,
                "metric": metric,
                "value": (
                    float(stats["vendu_total_kg"])
                    if stats["vendu_total_kg"] is not None
                    else 0
                ),
            }

        if intent == "recolte":
            stats = parcelle.ventes_historiques.aggregate(
                recolte_total_kg=Sum("recolte_kg")
            )

            return {
                "success": True,
                "intent": intent,
                "parcelle": parcelle.id_externe,
                "metric": metric,
                "value": (
                    float(stats["recolte_total_kg"])
                    if stats["recolte_total_kg"] is not None
                    else 0
                ),
            }

            
        if intent == "sol":
            mesure = parcelle.mesures_sol.order_by("-timestamp").first()

            if not mesure:
                return {
                    "success": True,
                    "intent": intent,
                    "parcelle": parcelle.id_externe,
                    "message": "Aucune mesure du sol disponible pour cette parcelle.",
                }

            return {
                "success": True,
                "intent": intent,
                "parcelle": parcelle.id_externe,
                "metric": metric,
                "humidite_sol_pct": (
                    float(mesure.humidite_sol_pct)
                    if mesure.humidite_sol_pct is not None else None
                ),
                "volume_eau_m3": (
                    float(mesure.volume_eau_m3)
                    if mesure.volume_eau_m3 is not None else None
                ),
                "date_mesure": mesure.timestamp.isoformat(),
            }

        if intent == "irrigation":
            mesure = parcelle.mesures_sol.order_by("-timestamp").first()

            if not mesure:
                return {
                    "success": True,
                    "intent": intent,
                    "parcelle": parcelle.id_externe,
                    "message": "Aucune mesure d'irrigation disponible pour cette parcelle.",
                }

            return {
                "success": True,
                "intent": intent,
                "parcelle": parcelle.id_externe,
                "metric": metric,
                "volume_eau_m3": (
                    float(mesure.volume_eau_m3)
                    if mesure.volume_eau_m3 is not None else None
                ),
                "humidite_sol_pct": (
                    float(mesure.humidite_sol_pct)
                    if mesure.humidite_sol_pct is not None else None
                ),
                "date_mesure": mesure.timestamp.isoformat(),
            }

        if intent == "production":
            stats = parcelle.productions_dataset.aggregate(
                rendement_moyen=Avg("rendement_estime"),
                volume_total=Sum("volume_recolte"),
                cout_total=Sum("couts_production"),
            )

            return {
                "success": True,
                "intent": intent,
                "parcelle": parcelle.id_externe,
                "metric": metric,
                "rendement_moyen": (
                    float(stats["rendement_moyen"])
                    if stats["rendement_moyen"] is not None else None
                ),
                "volume_total": (
                    float(stats["volume_total"])
                    if stats["volume_total"] is not None else None
                ),
                "cout_total": (
                    float(stats["cout_total"])
                    if stats["cout_total"] is not None else None
                ),
            }

    # -------------------------------------------------
    # Comparaison des ventes
    # -------------------------------------------------
    if intent == "comparaison_ventes":
        resultats = []

        for parcelle in parcelles:
            stats = parcelle.ventes_historiques.aggregate(
                vendu_total_kg=Sum("vendu_kg")
            )

            vendu = stats["vendu_total_kg"]

            if vendu is not None:
                resultats.append({
                    "parcelle": parcelle.id_externe,
                    "nom": parcelle.nom,
                    "culture": parcelle.culture_dataset,
                    "vendu_total_kg": float(vendu),
                })

        resultats.sort(
            key=lambda x: x["vendu_total_kg"],
            reverse=True
        )

        return {
            "success": True,
            "intent": intent,
            "metric": metric,
            "resultats": resultats,
            "meilleure_parcelle": (
                resultats[0] if resultats else None
            ),
        }

    return {
        "success": False,
        "error": f"Intention non encore supportée : {intent}"
    }