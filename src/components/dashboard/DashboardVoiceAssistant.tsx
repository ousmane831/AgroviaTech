import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Play, Pause, Send, X, Volume2, Bot, User, Sparkles } from 'lucide-react';
import { alertes, predictions, parcelles } from '@/data/mockData';

interface VoiceMessage {
  transcript: string;
  audioUrl: string | null;
  timestamp: Date;
  type: 'user' | 'assistant';
}

interface ChatMessage {
  id: string;
  text: string;
  type: 'user' | 'assistant';
  timestamp: Date;
}

export function DashboardVoiceAssistant() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<VoiceMessage | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isSupported, setIsSupported] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    // Vérifier la prise en charge des APIs
    const hasSpeechRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    const hasMediaRecorder = 'MediaRecorder' in window;
    
    if (!hasSpeechRecognition || !hasMediaRecorder) {
      setIsSupported(false);
      return;
    }

    // Initialiser la reconnaissance vocale
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'fr-FR';

    recognitionRef.current.onresult = (event: any) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      
      if (event.results[current].isFinal && currentMessage) {
        setCurrentMessage(prev => prev ? { ...prev, transcript } : null);
      }
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Erreur de reconnaissance:', event.error);
      if (event.error === 'no-speech') {
        setCurrentMessage(prev => prev ? { ...prev, transcript: "Aucun son détecté" } : null);
      }
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [currentMessage]);

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
        
        setCurrentMessage({
          transcript: "",
          audioUrl,
          timestamp: new Date(),
          type: 'user'
        });
        
        // Arrêter les pistes audio
        stream.getTracks().forEach(track => track.stop());
        
        setIsRecording(false);
        setShowPanel(true);
        
        // Démarrer la reconnaissance vocale
        if (recognitionRef.current) {
          recognitionRef.current.start();
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      
    } catch (error) {
      console.error('Erreur d\'accès au micro:', error);
      setIsSupported(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const playRecording = () => {
    if (currentMessage?.audioUrl && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const sendMessage = () => {
    if (currentMessage) {
      // Utiliser le transcript s'il existe, sinon un message par défaut
      const messageToSend = currentMessage.transcript?.trim() || "Message vocal enregistré";
      processVoiceCommand(messageToSend);
      resetPanel();
      setShowChat(true);
    }
  };

  const cancelMessage = () => {
    resetPanel();
  };

  const resetPanel = () => {
    setCurrentMessage(null);
    setShowPanel(false);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.src = '';
    }
  };

  const processVoiceCommand = async (command: string) => {
    setIsProcessing(true);
    
    // Ajouter le message utilisateur au chat
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: command,
      type: 'user',
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    
    // Simuler un traitement et générer une réponse
    setTimeout(() => {
      const response = generateResponse(command);
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        type: 'assistant',
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, assistantMessage]);
      setIsProcessing(false);
      
      // Lire la réponse à voix haute
      speak(response);
    }, 1500);
  };

  const generateResponse = (command: string): string => {
    const lowerCommand = command.toLowerCase();
    
    // Commandes pour les alertes
    if (lowerCommand.includes('alerte') || lowerCommand.includes('alert')) {
      const alertesActives = alertes.filter(a => a.statut === 'active');
      if (alertesActives.length > 0) {
        return `Vous avez ${alertesActives.length} alerte${alertesActives.length > 1 ? 's' : ''} active${alertesActives.length > 1 ? 's' : ''}. La plus urgente concerne : ${alertesActives[0].message}`;
      } else {
        return "Aucune alerte active. Tout va bien dans votre exploitation !";
      }
    }
    
    // Commandes pour les parcelles
    if (lowerCommand.includes('parcelle') || lowerCommand.includes('champ')) {
      return `Vous gérez actuellement ${parcelles.length} parcelles pour une surface totale de ${parcelles.reduce((acc, p) => acc + p.surface, 0).toFixed(1)} hectares.`;
    }
    
    // Commandes pour les prédictions
    if (lowerCommand.includes('prédiction') || lowerCommand.includes('prévision')) {
      if (predictions.length > 0) {
        return `J'ai analysé ${predictions.length} parcelles. La prochaine récolte est estimée à ${predictions[0].rendementPrevu} kg/ha pour la parcelle ${predictions[0].parcelleId}.`;
      } else {
        return "Aucune prédiction disponible actuellement.";
      }
    }
    
    // Commandes pour la météo
    if (lowerCommand.includes('météo') || lowerCommand.includes('temps')) {
      return "Le temps est favorable pour vos cultures cette semaine. Température idéale et légères pluies attendues.";
    }
    
    // Commande d'aide
    if (lowerCommand.includes('aide') || lowerCommand.includes('help')) {
      return "Je peux vous aider avec : alertes, parcelles, prédictions, météo. Essayez de me demander quelque chose !";
    }
    
    // Salutations
    if (lowerCommand.includes('bonjour') || lowerCommand.includes('salut')) {
      return "Bonjour ! Comment puis-je vous aider avec votre exploitation agricole aujourd'hui ?";
    }
    
    // Réponse par défaut
    return "Je n'ai pas parfaitement compris. Vous pouvez me demander des informations sur vos alertes, parcelles, prédictions ou la météo.";
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleChat = () => {
    setShowChat(!showChat);
    if (!showChat && chatMessages.length === 0) {
      // Message de bienvenue
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        text: "Bonjour ! Je suis votre assistant agricole. Comment puis-je vous aider aujourd'hui ?",
        type: 'assistant',
        timestamp: new Date()
      };
      setChatMessages([welcomeMessage]);
    }
  };

  if (!isSupported) {
    return (
      <div className="relative">
        <button className="p-3 bg-gray-100 rounded-lg text-gray-400 cursor-not-allowed">
          <MicOff className="h-5 w-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Bouton principal avec design amélioré */}
      <button
        onClick={isRecording ? stopRecording : toggleChat}
        className={`relative group p-3 md:p-4 rounded-2xl shadow-xl transition-all duration-500 transform hover:scale-110 active:scale-95 ${
          isRecording 
            ? 'bg-gradient-to-r from-red-500 to-pink-500 animate-pulse shadow-red-500/40' 
            : showChat
            ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-blue-500/40'
            : 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-green-500/40 hover:shadow-green-500/60'
        }`}
      >
        {/* Effet de brillance */}
        <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Icône animée */}
        <div className="relative">
          {isRecording ? (
            <MicOff className="h-5 w-5 md:h-6 md:w-6 text-white animate-bounce" />
          ) : showChat ? (
            <Bot className="h-5 w-5 md:h-6 md:w-6 text-white" />
          ) : (
            <Mic className="h-5 w-5 md:h-6 md:w-6 text-white" />
          )}
          
          {/* Indicateurs */}
          {isRecording && (
            <div className="absolute -top-2 -right-2 w-3 h-3 md:w-4 md:h-4 bg-red-600 rounded-full border-2 border-white animate-ping"></div>
          )}
          {isSpeaking && !isRecording && (
            <div className="absolute -top-2 -right-2 w-3 h-3 md:w-4 md:h-4 bg-blue-600 rounded-full border-2 border-white animate-pulse"></div>
          )}
        </div>
        
        {/* Sparkles effect */}
        <div className="absolute -top-1 -left-1">
          <Sparkles className="h-2 w-2 md:h-3 md:w-3 text-yellow-300 animate-pulse" />
        </div>
        <div className="absolute -bottom-1 -right-1">
          <Sparkles className="h-2 w-2 md:h-3 md:w-3 text-yellow-300 animate-pulse delay-75" />
        </div>
      </button>

      {/* Panneau de discussion - toujours visible */}
      <div className={`absolute bottom-full right-0 mb-4 w-80 md:w-96 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300 ${
        showChat ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
      }`}>
        {/* En-tête du chat */}
        <div className="bg-gradient-to-r from-green-700 to-green-700 p-3 md:p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 bg-white/20 rounded-full">
                <Bot className="h-4 w-4 md:h-5 md:w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm md:text-base">Assistant Agricole</h3>
                <p className="text-xs opacity-90">
                  {isSpeaking ? "En train de parler..." : isProcessing ? "En réflexion..." : "En ligne"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowChat(false)}
              className="p-1.5 md:p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="h-4 w-4 md:h-5 md:w-5" />
            </button>
          </div>
        </div>

        {/* Messages du chat */}
        <div className="h-64 md:h-64 overflow-y-auto p-3 md:p-4 space-y-3">
          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-2 md:p-3 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <div className="flex items-start gap-2">
                  {message.type === 'assistant' && (
                    <Bot className="h-3 w-3 md:h-4 md:w-4 mt-1 text-gray-600" />
                  )}
                  {message.type === 'user' && (
                    <User className="h-3 w-3 md:h-4 md:w-4 mt-1 text-blue-100" />
                  )}
                  <div>
                    <p className="text-xs md:text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Indicateur de traitement */}
          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-2 md:p-3 rounded-2xl">
                <div className="flex items-center gap-2">
                  <Bot className="h-3 w-3 md:h-4 md:w-4 text-gray-600" />
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>

        {/* Zone d'entrée avec bouton micro */}
        <div className="p-3 md:p-4 border-t border-gray-200">
          {showPanel && currentMessage ? (
            /* Panneau d'enregistrement intégré */
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-100 mb-3">
              {/* Audio caché */}
              {currentMessage.audioUrl && (
                <audio
                  ref={audioRef}
                  src={currentMessage.audioUrl}
                  onEnded={() => setIsPlaying(false)}
                  className="hidden"
                />
              )}

              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-blue-100 rounded-full">
                    <Mic className="h-3 w-3 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm">Message enregistré</h4>
                </div>
                <button
                  onClick={cancelMessage}
                  className="text-gray-400 hover:text-gray-600 transition p-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>

              {/* Transcript */}
              <div className="bg-white rounded-md p-2 border border-blue-200 mb-2 min-h-[30px]">
                <p className="text-gray-700 text-xs italic">
                  {currentMessage.transcript || "Transcription..."}
                </p>
              </div>

              {/* Controls */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={isPlaying ? pauseRecording : playRecording}
                  disabled={!currentMessage.audioUrl}
                  className="flex flex-col items-center p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs disabled:opacity-50"
                >
                  {isPlaying ? <Pause className="h-3 w-3 mb-1" /> : <Volume2 className="h-3 w-3 mb-1" />}
                  {isPlaying ? "Pause" : "Écouter"}
                </button>

                <button
                  onClick={sendMessage}
                  disabled={!currentMessage.transcript?.trim() && !currentMessage.audioUrl}
                  className="flex flex-col items-center p-2 bg-green-500 hover:bg-green-600 text-white rounded text-xs disabled:opacity-50"
                >
                  <Send className="h-3 w-3 mb-1" />
                  Envoyer
                </button>

                <button
                  onClick={cancelMessage}
                  className="flex flex-col items-center p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded text-xs"
                >
                  <X className="h-3 w-3 mb-1" />
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            /* Zone de micro normale */
            <div className="flex items-center gap-2">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`p-2 md:p-3 rounded-full transition-all duration-300 ${
                  isRecording
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {isRecording ? (
                  <MicOff className="h-4 w-4 md:h-5 md:w-5" />
                ) : (
                  <Mic className="h-4 w-4 md:h-5 md:w-5" />
                )}
              </button>
              <div className="flex-1 text-center text-xs md:text-sm text-gray-500">
                {isRecording ? "Enregistrement en cours..." : "Cliquez sur le micro pour parler"}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
