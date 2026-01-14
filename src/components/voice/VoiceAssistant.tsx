import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { alertes, predictions } from '@/data/mockData';

interface VoiceResponse {
  text: string;
  type: 'alertes' | 'recommandations' | 'infos' | 'erreur';
}

export function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [response, setResponse] = useState<VoiceResponse | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showRecordedMessage, setShowRecordedMessage] = useState(false);
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    console.log('VoiceAssistant monté');
    
    // Vérifier la prise en charge de l'API Web Speech
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.log('API Web Speech non supportée');
      setIsSupported(false);
      return;
    }
    
    console.log('API Web Speech supportée');

    // Initialiser la reconnaissance vocale
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'fr-FR';

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setTranscript('');
    };

    recognitionRef.current.onresult = (event: any) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      
      console.log('Résultat reconnaissance:', transcript);
      console.log('Is final:', event.results[current].isFinal);
      
      if (event.results[current].isFinal) {
        setTranscript(transcript);
        console.log('Transcription définie:', transcript);
        setShowRecordedMessage(true);
        console.log('Panneau message activé');
      }
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Erreur de reconnaissance vocale:', event.error);
      setIsListening(false);
      if (event.error === 'no-speech') {
        setResponse({
          text: "Je n'ai rien entendu. Veuillez réessayer.",
          type: 'erreur'
        });
      }
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const processVoiceCommand = (command: string) => {
    let responseText = '';
    let responseType: VoiceResponse['type'] = 'infos';

    // Commandes pour les alertes
    if (command.includes('alerte') || command.includes('alert')) {
      const alertesActives = alertes.filter(a => a.statut === 'active');
      if (alertesActives.length > 0) {
        responseText = `Vous avez ${alertesActives.length} alerte${alertesActives.length > 1 ? 's' : ''} active${alertesActives.length > 1 ? 's' : ''}. `;
        responseText += alertesActives.slice(0, 3).map((alerte, index) => {
          const priority = alerte.priorite === 'haute' ? 'urgente' : alerte.priorite === 'moyenne' ? 'importante' : 'à surveiller';
          return `Alerte ${index + 1}: ${priority}. ${alerte.message}`;
        }).join(' ');
        responseType = 'alertes';
      } else {
        responseText = "Vous n'avez aucune alerte active. Tout va bien !";
        responseType = 'alertes';
      }
    }
    // Commandes pour les recommandations
    else if (command.includes('recommandation') || command.includes('conseil') || command.includes('idée')) {
      if (predictions.length > 0) {
        responseText = "Voici les recommandations principales: ";
        responseText += predictions.slice(0, 2).map((pred, index) => {
          return `Pour la parcelle ${index + 1}: ${pred.recommandations.slice(0, 2).join('. ')}`;
        }).join(' ');
        responseType = 'recommandations';
      } else {
        responseText = "Aucune recommandation disponible pour le moment.";
        responseType = 'recommandations';
      }
    }
    // Commandes pour les informations importantes
    else if (command.includes('information') || command.includes('info') || command.includes('nouveau') || command.includes('actualité')) {
      responseText = "Informations importantes de votre exploitation: ";
      responseText += `Vous gérez ${alertes.filter(a => a.statut === 'active').length} alertes actives. `;
      responseText += `${predictions.length} parcelles ont des prédictions IA. `;
      responseText += "Le système surveille en permanence vos cultures.";
      responseType = 'infos';
    }
    // Commande d'aide
    else if (command.includes('aide') || command.includes('help') || command.includes('comment')) {
      responseText = "Je peux vous aider avec: Dites 'alertes' pour connaître les alertes, 'recommandations' pour les conseils, ou 'informations' pour les nouveautés. Essayez maintenant!";
      responseType = 'infos';
    }
    // Commande non reconnue
    else {
      responseText = "Je n'ai pas compris. Dites 'alertes', 'recommandations', 'informations' ou 'aide' pour obtenir de l'aide.";
      responseType = 'erreur';
    }

    setResponse({ text: responseText, type: responseType });
    speak(responseText);
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      // Arrêter toute parole en cours
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9; // Légèrement plus lent
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (!isSupported || !recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      // Arrêter toute parole en cours avant d'écouter
      if (isSpeaking) {
        window.speechSynthesis.cancel();
      }
      recognitionRef.current.start();
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudio(audioUrl);
        setIsRecording(false);
        
        // Arrêter tous les pistes audio
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      // Démarrer aussi la reconnaissance vocale
      if (recognitionRef.current && !isListening) {
        recognitionRef.current.start();
      }
    } catch (error) {
      console.error('Erreur d\'accès au micro:', error);
      setResponse({
        text: "Impossible d'accéder au microphone. Vérifiez les permissions.",
        type: 'erreur'
      });
    }
  };

  const stopRecording = () => {
    console.log('Arrêt enregistrement');
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
    
    // Fallback: si la reconnaissance ne marche pas, afficher le panneau après 2 secondes
    setTimeout(() => {
      if (!showRecordedMessage && !transcript) {
        console.log('Fallback: affichage panneau manuel');
        setTranscript("Message enregistré (test)");
        setShowRecordedMessage(true);
      }
    }, 2000);
  };

  const playRecording = () => {
    if (recordedAudio) {
      const audio = new Audio(recordedAudio);
      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
      audio.play();
    }
  };

  const pauseRecording = () => {
    if (recordedAudio) {
      const audio = new Audio(recordedAudio);
      audio.pause();
      setIsPlaying(false);
    }
  };

  const sendRecording = () => {
    if (transcript) {
      processVoiceCommand(transcript.toLowerCase());
      setShowRecordedMessage(false);
      setRecordedAudio(null);
    }
  };

  const cancelRecording = () => {
    setTranscript('');
    setRecordedAudio(null);
    setShowRecordedMessage(false);
    setResponse(null);
  };

  if (!isSupported) return null;

return (
  <div className="fixed bottom-8 right-8 z-[9999]">
    <div className="relative group">
      {/* Onde d'animation au survol */}
      <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Tooltip élégant */}
      {showTooltip && (
        <div className="absolute bottom-full right-0 mb-3 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <div className="font-medium">Assistant Vocal</div>
          <div className="text-xs opacity-80">Cliquez pour enregistrer</div>
          <div className="absolute top-full right-4 -mt-1 w-2 h-2 bg-gray-900 rotate-45"></div>
        </div>
      )}

      {/* Bouton micro principal avec design moderne */}
      <button
        onClick={isRecording ? stopRecording : startRecording}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`relative w-16 h-16 rounded-full shadow-2xl transition-all duration-500 transform hover:scale-110 active:scale-95 ${
          isRecording 
            ? 'bg-gradient-to-r from-red-500 to-red-600 animate-pulse shadow-red-500/50' 
            : 'bg-gradient-to-r from-primary to-primary/90 hover:shadow-primary/50'
        }`}
      >
        {/* Effet de brillance */}
        <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Icône micro */}
        <Mic className={`h-8 w-8 text-white relative z-10 transition-transform duration-300 ${
          isRecording ? 'scale-90' : 'scale-100'
        }`} />
        
        {/* Indicateur d'enregistrement */}
        {isRecording && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
        )}
        
        {/* Indicateur de traitement */}
        {(isListening || isSpeaking) && !isRecording && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
        )}
      </button>

      {/* Panneau de message enregistré (design moderne) */}
      {showRecordedMessage && (
        <div className="absolute bottom-full right-0 mb-4 bg-white/95 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-2xl p-6 w-96 transform transition-all duration-300 scale-95 opacity-0 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Message enregistré</h4>
            <button
              onClick={cancelRecording}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <p className="text-gray-700 italic">"{transcript}"</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={isPlaying ? pauseRecording : playRecording}
              disabled={!recordedAudio}
              className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isPlaying ? (
                <>
                  ⏸️ Pause
                </>
              ) : (
                <>
                  🔊 Écouter
                </>
              )}
            </button>
            <button
              onClick={sendRecording}
              className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              ✅ Envoyer
            </button>
            <button
              onClick={cancelRecording}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              ❌ Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
);
}
