import os
import time

from google.genai import errors
from dotenv import load_dotenv
from google import genai
from pydantic import BaseModel, Field


load_dotenv()


class IntentionAgricole(BaseModel):
    intent: str = Field(
        description=(
            "Intention agricole de l'utilisateur. "
            "Valeurs possibles : "
            "vente, recolte, production, irrigation, "
            "sol, comparaison_ventes, comparaison_recoltes, "
            "culture, inconnue."
        )
    )

    parcelle: str | None = Field(
        default=None,
        description=(
            "Identifiant de parcelle si identifiable, "
            "au format P001, P002, etc."
        )
    )

    metric: str | None = Field(
        default=None,
        description=(
            "Donnée demandée. Exemples : "
            "vendu_total_kg, recolte_total_kg, "
            "invendu_total_kg, humidite_pct, "
            "volume_eau_m3, rendement_moyen."
        )
    )


def obtenir_client_gemini():
    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        raise ValueError(
            "GEMINI_API_KEY est absente du fichier .env"
        )

    return genai.Client(api_key=api_key)



def analyser_intention(question: str) -> IntentionAgricole:
    """Analyse l'intention avec Gemini, puis utilise un fallback local si le quota est atteint."""

    client = obtenir_client_gemini()

    prompt = f"""
Tu es le moteur de compréhension d'un assistant agricole.

Analyse la question et retourne uniquement les informations
correspondant au schéma demandé.

Règles :
- Comprends le français, le wolof, le pulaar et le sérère.
- "parcelle 5", "P5" et "P005" correspondent à P005.
- N'invente jamais un identifiant.
- Pour une comparaison entre parcelles, parcelle doit être null.
- Intentions possibles : vente, recolte, production, irrigation,
  sol, comparaison_ventes, comparaison_recoltes, culture, inconnue.
- Métriques possibles : vendu_total_kg, recolte_total_kg,
  invendu_total_kg, humidite_pct, volume_eau_m3, rendement_moyen.

Question :
{question}
"""

    try:
        response = client.models.generate_content(
            model="gemini-3.5-flash-lite",
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "response_schema": IntentionAgricole,
            },
        )
        return IntentionAgricole.model_validate_json(response.text)

    
    except errors.ClientError as exc:
        code = getattr(exc, "code", None)

        if code in (429, 500, 502, 503, 504):
            print(
                f"⚠️ Gemini indisponible pendant l'analyse "
                f"(code {code}) : utilisation du fallback local."
            )
            return analyser_intention_secours(question)

        raise

    except errors.ServerError as exc:
        code = getattr(exc, "code", None)

        print(
            f"⚠️ Erreur serveur Gemini pendant l'analyse "
            f"(code {code}) : utilisation du fallback local."
        )

        return analyser_intention_secours(question)




def analyser_intention_secours(question: str) -> IntentionAgricole:
    """Analyse locale des intentions agricoles sans appel à Gemini."""

    import re
    import unicodedata

    texte = question.lower().strip()
    texte = "".join(
        caractere
        for caractere in unicodedata.normalize("NFD", texte)
        if unicodedata.category(caractere) != "Mn"
    )

    # Comparaison des ventes : ne pas sélectionner de parcelle.
    mots_comparaison_ventes = (
        "quelle parcelle",
        "quelle est la parcelle",
        "le plus vendu",
        "vendu le plus",
        "vend le plus",
        "plus de ventes",
        "plus vendu",
        "ban parcelle",
        "moo ëpp",
    )

    if any(mot in texte for mot in mots_comparaison_ventes):
        return IntentionAgricole(
            intent="comparaison_ventes",
            parcelle=None,
            metric="vendu_total_kg",
        )

    # Identifier une parcelle : P5, P005, parcelle 5, etc.
    match = re.search(r"\bp\s*[-_]?\s*(\d{1,3})\b", texte)

    if not match:
        match = re.search(
            r"\bparcelle(?:\s+numero)?\s*(\d{1,3})\b",
            texte,
        )

    parcelle = f"P{int(match.group(1)):03d}" if match else None

    # Sol : humidité et état mesuré du sol.
    mots_sol = (
        "humidite",
        "humide",
        "secheresse",
        "etat du sol",
        "mon sol",
        "sol de",
    )

    if any(mot in texte for mot in mots_sol):
        return IntentionAgricole(
            intent="sol",
            parcelle=parcelle,
            metric="humidite_pct",
        )

    # Irrigation et consommation d'eau.
    
    mots_irrigation = (
        "irrigation",
        "irriguer",
        "arrosage",
        "arroser",
        "volume d eau",
        "volume eau",
        "quantite d eau",
        "quantite eau",
        "consommation d eau",
        "consommation eau",
        "besoin en eau",
        "eau utilisee",
        "eau pour",
        "combien d eau",
    )

    if any(mot in texte for mot in mots_irrigation):
        return IntentionAgricole(
            intent="irrigation",
            parcelle=parcelle,
            metric="volume_eau_m3",
        )

    # Production, rendement et coûts.
    mots_production = (
        "production",
        "produit",
        "rendement",
        "cout de production",
        "couts de production",
        "combien j'ai produit",
        "combien ai-je produit",
    )

    if any(mot in texte for mot in mots_production):
        return IntentionAgricole(
            intent="production",
            parcelle=parcelle,
            metric="rendement_moyen",
        )

    # Ventes en français ou en wolof.
    mots_vente = (
        "jaay",
        "vendre",
        "vendu",
        "vente",
        "ventes",
        "vend",
    )

    if any(mot in texte for mot in mots_vente):
        return IntentionAgricole(
            intent="vente",
            parcelle=parcelle,
            metric="vendu_total_kg",
        )

    # Récoltes en français ou en wolof.
    mots_recolte = (
        "recolte",
        "recolte",
        "recolter",
        "recolte",
        "góob",
        "goob",
    )

    if any(mot in texte for mot in mots_recolte):
        return IntentionAgricole(
            intent="recolte",
            parcelle=parcelle,
            metric="recolte_total_kg",
        )

    return IntentionAgricole(
        intent="inconnue",
        parcelle=parcelle,
        metric=None,
    )

def tester_gemini():
    client = obtenir_client_gemini()

    response = client.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents="Réponds simplement : Gemini fonctionne correctement.",
    )

    return response.text



def formuler_reponse(
    question: str,
    langue: str,
    donnees: dict
) -> str:
    """
    Formule une réponse naturelle à partir des données
    récupérées par Django.

    Gemini ne doit utiliser que les données fournies.
    En cas d'indisponibilité, utilise une réponse de secours.
    """

    client = obtenir_client_gemini()

    prompt = f"""
Tu es l'assistant agricole intelligent d'AgroViaTech.

Question du producteur :
{question}

Langue demandée :
{langue}

Données agricoles vérifiées par Django :
{donnees}

Règles STRICTES :
- Utilise uniquement les données fournies.
- N'invente aucune valeur.
- Ne crée jamais une parcelle qui n'existe pas.
- Si une donnée manque, dis-le clairement.
- Réponds directement à la question.
- Sois naturel, simple et compréhensible pour un producteur.
- Si la question est en wolof, réponds en wolof.
- Si elle est en pulaar, réponds en pulaar.
- Si elle est en sérère, réponds en sérère.
- Si elle est en français, réponds en français.

- Préserve exactement les nombres fournis par Django.
- Ne calcule pas, n'arrondis pas et ne modifie pas les valeurs.
- Réponds dans la langue demandée.
- En wolof, privilégie une formulation naturelle à l'oral.
- N'écris pas les nombres en français dans une réponse en wolof.
- Conserve exactement les identifiants de parcelles et les unités.
- Si tu ne connais pas la formulation wolof d'un nombre, conserve les chiffres plutôt que d'inventer une prononciation.
"""

    # Trois tentatives au maximum.
    for tentative in range(3):
        try:
            response = client.models.generate_content(
                model="gemini-3.5-flash-lite",
                contents=prompt,
            )

            texte = (response.text or "").strip()

            if texte:
                return texte

            print("⚠️ Gemini a renvoyé une réponse vide.")

        except errors.ClientError as exc:
            code = getattr(exc, "code", None)

            print(
                f"⚠️ Erreur Gemini pendant la formulation : "
                f"code={code}, tentative={tentative + 1}/3"
            )

            if code not in (429, 500, 502, 503, 504):
                raise

        except errors.ServerError as exc:
            code = getattr(exc, "code", None)

            print(
                f"⚠️ Erreur serveur Gemini : "
                f"code={code}, tentative={tentative + 1}/3"
            )

        # Attendre uniquement si une autre tentative est prévue.
        if tentative < 2:
            time.sleep(2 ** tentative)

    print("⚠️ Gemini indisponible : utilisation du fallback local.")

    return formuler_reponse_secours(
        question,
        langue,
        donnees
    )




def formuler_reponse_secours(question: str, langue: str, donnees: dict) -> str:
    """
    Formule une réponse simple à partir des données déjà vérifiées
    par Django, sans appeler Gemini.
    """

    if not donnees or not donnees.get("success"):
        if langue == "wolof":
            return "Désolé, je n'ai pas pu récupérer les données de la parcelle."
        return "Désolé, je n'ai pas pu récupérer les données demandées."

    intent = donnees.get("intent")

    if intent == "vente":
        parcelle = donnees.get("parcelle")
        value = donnees.get("value")

        if langue == "wolof":
            return (
                f"Ci sa parcelle {parcelle}, "
                f"{value} kilogrammes nga jaay."
            )

        return (
            f"Pour la parcelle {parcelle}, "
            f"{value} kilogrammes ont été vendus."
        )

    if intent == "recolte":
        parcelle = donnees.get("parcelle")
        value = donnees.get("value")

        if langue == "wolof":
            return (
                f"Ci sa parcelle {parcelle}, "
                f"{value} kilogrammes nga récolté."
            )

        return (
            f"Pour la parcelle {parcelle}, "
            f"{value} kilogrammes ont été récoltés."
        )

    
    if intent == "sol":
        parcelle = donnees.get("parcelle")
        humidite = donnees.get("humidite_sol_pct")
        date_mesure = donnees.get("date_mesure")
        message = donnees.get("message")

        if message:
            return message

        if humidite is None:
            return (
                f"Pour la parcelle {parcelle}, "
                "l'humidité du sol n'est pas disponible."
            )

        return (
            f"Pour la parcelle {parcelle}, "
            f"la dernière humidité du sol mesurée est de {humidite} %. "
            f"Date de mesure : {date_mesure}."
        )

    if intent == "irrigation":
        parcelle = donnees.get("parcelle")
        volume = donnees.get("volume_eau_m3")
        date_mesure = donnees.get("date_mesure")
        message = donnees.get("message")

        if message:
            return message

        if volume is None:
            return (
                f"Pour la parcelle {parcelle}, "
                "le volume d'eau mesuré n'est pas disponible."
            )

        return (
            f"Pour la parcelle {parcelle}, "
            f"le dernier volume d'eau enregistré est de {volume} m³. "
            f"Date de mesure : {date_mesure}."
        )

    if intent == "production":
        parcelle = donnees.get("parcelle")
        rendement = donnees.get("rendement_moyen")
        volume = donnees.get("volume_total")
        cout = donnees.get("cout_total")

        if rendement is None and volume is None and cout is None:
            return (
                f"Aucune donnée de production exploitable "
                f"n'est disponible pour la parcelle {parcelle}."
            )

        elements = []

        if rendement is not None:
            elements.append(f"rendement moyen : {rendement}")

        if volume is not None:
            elements.append(f"volume produit enregistré : {volume}")

        if cout is not None:
            elements.append(f"coût de production enregistré : {cout}")

        return (
            f"Pour la parcelle {parcelle}, "
            + "; ".join(elements)
            + "."
        )

    if intent == "comparaison_ventes":
        meilleure = donnees.get("meilleure_parcelle")

        if not meilleure:
            if langue == "wolof":
                return "Amul benn parcelle bu ma man a gis."
            return "Aucune donnée de comparaison n'a été trouvée."

        parcelle = meilleure.get("parcelle")
        culture = meilleure.get("culture")
        value = meilleure.get("vendu_total_kg")

        if langue == "wolof":
            return (
                f"Parcelle {parcelle} moo ëpp ci ventes. "
                f"{value} kilogrammes la jaay, "
                f"te culture bi mooy {culture}."
            )

        return (
            f"La parcelle {parcelle} est celle qui a vendu le plus, "
            f"avec {value} kilogrammes. "
            f"La culture est {culture}."
        )

    if langue == "wolof":
        return "Désolé, je ne peux pas encore répondre à cette question."

    return "Désolé, je ne peux pas encore répondre à cette question."



def repondre_conversation(
    question: str,
    langue: str,
) -> str:
    """
    Répond aux salutations et aux questions générales.
    Ne consulte pas PostgreSQL et n'invente pas de données personnelles.
    """

    texte = question.lower().strip()

    # Réponses locales minimales si Gemini est indisponible.
    salutations = (
        "bonjour",
        "bonsoir",
        "salut",
        "hello",
        "nanga def",
        "salaam",
        "asalaam",
        "assalam",
        "salimalekum",
        "salamalekum",
        "malekum salaam",
        "jërëjëf",
        "merci",
    )



    if any(mot in texte for mot in salutations):
        if langue == "wolof":
            return (
                "Salaam! Maa ngi fi. "
                "Lan nga bëgg xam ci sa tool walla sa production?"
            )
        return (
            "Bonjour ! Je suis l'assistant AgroViaTech. "
            "Je peux vous aider avec vos cultures, vos récoltes "
            "et vos ventes. Que souhaitez-vous savoir ?"
        )

    try:
        client = obtenir_client_gemini()

        prompt = f"""
Tu es l'assistant conversationnel d'AgroViaTech,
une plateforme d'accompagnement agricole.

Question de l'utilisateur :
{question}

Langue de réponse :
{langue}

Consignes :
- Réponds naturellement et avec politesse.
- Comprends les erreurs de formulation si possible.
- Réponds aux salutations et aux remerciements.
- Pour une question ambiguë, demande une précision.
- Pour une question agricole générale, donne des conseils
  prudents et utiles.
- Si une question est hors sujet, réponds brièvement puis
  rappelle avec tact le rôle d'AgroViaVoice.
- N'invente jamais de données personnelles, de ventes,
  de récoltes, de parcelles ou de résultats issus de la base.
- Si une donnée de l'exploitation est demandée, explique
  qu'il faut consulter les données agricoles correspondantes.
- Ne prétends pas avoir consulté PostgreSQL.
- Utilise un langage simple adapté aux producteurs.
- Réponds uniquement dans la langue demandée.
- Pour les questions concernant les insectes, les ravageurs,
  les maladies des plantes ou les problèmes de culture,
  aide l'agriculteur à identifier les informations nécessaires.
- Si l'agriculteur signale des insectes dans son champ sans
  préciser la culture concernée, demande-lui quelle plante
  il cultive.
- Demande également où les insectes sont observés :
  sur les feuilles, les tiges, les racines, les fruits
  ou dans le sol.
- Si nécessaire, demande une description des insectes,
  leur couleur, leur taille et les dégâts observés.
- Donne d'abord des mesures de prévention et des méthodes
  de lutte intégrée adaptées à la culture et au ravageur
  identifiés.
- Ne recommande pas un pesticide précis sans informations
  suffisantes sur le ravageur et la culture. Si un produit
  phytosanitaire est envisagé, rappelle qu'il faut vérifier
  son homologation locale, respecter son étiquette et
  utiliser les équipements de protection appropriés.
- Ne prétends jamais avoir identifié un insecte si les
  informations fournies sont insuffisantes.
- Réponds dans la langue demandée par l'utilisateur.
  Si la question est en wolof, réponds en wolof simple.

"""

        response = client.models.generate_content(
            model="gemini-3.5-flash-lite",
            contents=prompt,
        )

        if response.text and response.text.strip():
            return response.text.strip()

    except errors.ClientError as exc:
        if exc.code != 429:
            print(f"Erreur Gemini conversationnel : {exc}")
        else:
            print(
                "Quota Gemini atteint : "
                "réponse conversationnelle locale."
            )

    except Exception as exc:
        print(f"Erreur conversationnelle : {exc}")

    
    if langue == "wolof":
        return (
            "Laaj bi leerul ba pare. Ndax bëgg nga xam "
            "li nga jaay, li nga góob, walla dara ci sa tool?"
        )

    if langue == "pulaar":
        return (
            "Miɗo faalaa ɓeydude humpito. Aɗa naamnii "
            "ko ɓeñiɗaa, ko njogii e njulaagu, walla ko "
            "humpito dow ngesa maa?"
        )

    if langue == "serere":
        return (
            "Je n'ai pas assez de contexte pour comprendre. "
            "Pouvez-vous préciser si votre question concerne "
            "les ventes, les récoltes ou vos cultures ?"
        )

    return (
        "Je peux vous aider, mais votre question est trop vague. "
        "Parlez-vous de vos ventes, de votre récolte ou d'un "
        "problème concernant vos cultures ?"
    )



