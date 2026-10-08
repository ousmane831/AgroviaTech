import requests
import os
import json

class GalsenAIModel:
    """Service pour utiliser Sama Agri Voice"""

    def agriculture_voice(
    self,
    audio_file,
    language,
    parcelle_id=None,
    context=None
):
        """
        Envoie un fichier audio à Sama Agri Voice
        et récupère la transcription, la réponse agricole
        et l'audio généré.
        """
        agrivoice_url = os.getenv(
            "AGRIVOICE_API_URL",
            "http://127.0.0.1:8001"
        ).rstrip("/")

        url = f"{agrivoice_url}/api/v1/agriculture/ask"

        language_mapping = {
            "wo": "wolof",
            "ff": "pulaar",
            "sr": "serere",
        }

        agrivoice_language = language_mapping.get(language)

        if not agrivoice_language:
            raise ValueError(
                f"Langue vocale non supportée par Sama Agri Voice : {language}"
            )

        audio_file.seek(0)
        contenu_audio = audio_file.read()

        test_audio_path = "debug_voice.webm"

        with open(test_audio_path, "wb") as f:
            f.write(contenu_audio)

        print("\n=== AUDIO DEBUG ===")
        print("Nom :", audio_file.name)
        print("Content-Type :", audio_file.content_type)
        print("Taille :", len(contenu_audio))
        print("Fichier sauvegardé :", test_audio_path)
        print("===================\n")

        files = {
            "audio": (
                audio_file.name,
                contenu_audio,
                audio_file.content_type or "audio/webm",
            )
        }

        data = {
            "language": agrivoice_language,
        }

        if parcelle_id:
            data["parcelle_id"] = parcelle_id

        if context:
            data["agricultural_context"] = json.dumps(
                context,
                ensure_ascii=False
            )

        try:
            response = requests.post(
                url,
                files=files,
                data=data,
                timeout=120,
            )

            if not response.ok:
                print(
                    f"\n=== SAMA AGRI VOICE ERROR ===\n"
                    f"URL: {url}\n"
                    f"Language: {agrivoice_language}\n"
                    f"Status: {response.status_code}\n"
                    f"Response: {response.text}\n"
                    f"==============================\n"
                )

                raise Exception(
                    f"Sama Agri Voice HTTP {response.status_code}: "
                    f"{response.text}"
                )

            return response.json()

        except requests.RequestException as exc:
            print(
                f"\n=== SAMA AGRI VOICE CONNECTION ERROR ===\n"
                f"URL: {url}\n"
                f"Error: {exc}\n"
                f"==========================================\n"
            )

            raise Exception(
                f"Impossible de contacter Sama Agri Voice : {exc}"
            )
            
    def transcribe_audio(self, audio_file, language):
        """Envoie l'audio à Sama Agri Voice pour transcription uniquement."""

        agrivoice_url = os.getenv(
            "AGRIVOICE_API_URL",
            "http://127.0.0.1:8002"
        ).rstrip("/")

        url = f"{agrivoice_url}/api/v1/agriculture/transcribe"

        language_mapping = {
            "wo": "wolof",
            "ff": "pulaar",
            "sr": "serere",
        }

        agrivoice_language = language_mapping.get(language)

        if not agrivoice_language:
            raise ValueError(
                f"Langue vocale non supportée par Sama Agri Voice : {language}"
            )

        audio_file.seek(0)
        contenu_audio = audio_file.read()

        files = {
            "audio": (
                audio_file.name,
                contenu_audio,
                getattr(audio_file, "content_type", None) or "audio/webm",
            )
        }

        data = {
            "language": agrivoice_language,
        }

        try:
            response = requests.post(
                url,
                files=files,
                data=data,
                timeout=120,
            )

            if not response.ok:
                raise Exception(
                    f"Sama Agri Voice transcription HTTP "
                    f"{response.status_code}: {response.text}"
                )

            result = response.json()

            return result.get("question", "")

        except requests.RequestException as exc:
            raise Exception(
                f"Impossible de contacter Sama Agri Voice pour la "
                f"transcription : {exc}"
            )

    def respond_text(self, question, language, context=None):
        """Envoie une question texte + contexte agricole à Sama Agri Voice."""

        agrivoice_url = os.getenv(
            "AGRIVOICE_API_URL",
            "http://127.0.0.1:8002"
        ).rstrip("/")

        url = f"{agrivoice_url}/api/v1/agriculture/respond"

        language_mapping = {
            "wo": "wolof",
            "ff": "pulaar",
            "sr": "serere",
        }

        agrivoice_language = language_mapping.get(language)

        if not agrivoice_language:
            raise ValueError(
                f"Langue vocale non supportée par Sama Agri Voice : {language}"
            )

        data = {
            "question": question,
            "language": agrivoice_language,
        }

        if context:
            data["agricultural_context"] = json.dumps(
                context,
                ensure_ascii=False
            )

        try:
            response = requests.post(
                url,
                data=data,
                timeout=120,
            )

            if not response.ok:
                raise Exception(
                    f"Sama Agri Voice réponse HTTP "
                    f"{response.status_code}: {response.text}"
                )

            return response.json()

        except requests.RequestException as exc:
            raise Exception(
                f"Impossible de contacter Sama Agri Voice pour la "
                f"réponse : {exc}"
            )
# Instance globale du service
galsen_ai = GalsenAIModel()
