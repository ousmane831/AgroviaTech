import requests
import os
from django.conf import settings
import json
class GalsenAIModel:
    """Service pour utiliser les modèles GalsenAI via Hugging Face Inference API"""
    
    def __init__(self):
        # Configuration des modèles sur Hugging Face Inference
        self.tts_model_id = "galsenai/xTTS-v2-wolof"
        self.stt_model_id = "galsenai/whisper-large-v3-wo"
        self.llm_model_id = "galsenai/FineLlama-3.1-8B"
        
        # API Token (à configurer dans .env)
        self.api_token = os.getenv('HUGGINGFACE_API_TOKEN', '')
        self.api_url = "https://api-inference.huggingface.co/models"
    
    def text_to_speech(self, text, language='wo'):
        """
        Convertir du texte en audio via Hugging Face Inference API
        Args:
            text: Le texte à convertir
            language: La langue (wo pour Wolof, fr pour Français)
        Returns:
            audio_bytes: Bytes de l'audio généré
        """
        try:
            model_id = self.tts_model_id if language == 'wo' else "facebook/mms-tts-fr"
            
            headers = {
                "Authorization": f"Bearer {self.api_token}"
            }
            
            payload = {
                "inputs": text,
                "parameters": {
                    "language": language
                }
            }
            
            response = requests.post(
                f"{self.api_url}/{model_id}",
                headers=headers,
                json=payload
            )
            
            if response.status_code == 200:
                return response.content
            else:
                print(f"Erreur TTS API: {response.status_code} - {response.text}")
                return None
        except Exception as e:
            print(f"Erreur TTS: {e}")
            return None
    
    def speech_to_text(self, audio_file, language='wo'):
        """
        Convertir de l'audio en texte via Hugging Face Inference API
        Args:
            audio_file: Fichier audio
            language: La langue (wo pour Wolof, fr pour Français)
        Returns:
            text: Le texte transcrit
        """
        try:
            model_id = self.stt_model_id
            
            headers = {
                "Authorization": f"Bearer {self.api_token}"
            }
            
            # Lire le fichier audio
            audio_data = audio_file.read()
            
            response = requests.post(
                f"{self.api_url}/{model_id}",
                headers=headers,
                data=audio_data
            )
            
            if response.status_code == 200:
                result = response.json()
                return result.get('text', '')
            else:
                print(f"Erreur STT API: {response.status_code} - {response.text}")
                return None
        except Exception as e:
            print(f"Erreur STT: {e}")
            return None


    
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
            
    def generate_response(self, prompt, context="", max_length=200):
        """
        Générer une réponse avec le LLM via Hugging Face Inference API
        Args:
            prompt: Le prompt de l'utilisateur
            context: Le contexte de la conversation
            max_length: Longueur maximale de la réponse
        Returns:
            response: La réponse générée
        """
        try:
            model_id = self.llm_model_id
            
            headers = {
                "Authorization": f"Bearer {self.api_token}"
            }
            
            full_prompt = f"{context}\nUser: {prompt}\nAssistant:"
            
            payload = {
                "inputs": full_prompt,
                "parameters": {
                    "max_new_tokens": max_length,
                    "temperature": 0.7,
                    "return_full_text": False
                }
            }
            
            response = requests.post(
                f"{self.api_url}/{model_id}",
                headers=headers,
                json=payload
            )
            
            if response.status_code == 200:
                result = response.json()
                if isinstance(result, list) and len(result) > 0:
                    return result[0].get('generated_text', '')
                elif isinstance(result, dict):
                    return result.get('generated_text', '')
                return str(result)
            else:
                print(f"Erreur LLM API: {response.status_code} - {response.text}")
                return None
        except Exception as e:
            print(f"Erreur LLM: {e}")
            return None

# Instance globale du service
galsen_ai = GalsenAIModel()
