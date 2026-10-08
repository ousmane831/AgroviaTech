import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Mic, Volume2, Send, Square } from 'lucide-react';
import { chatbotApi } from '@/lib/chatbotApi';
import { useAuthComplete } from '@/hooks/useAuthComplete';
import { fetchParcelles } from '@/lib/agricultureApi';
type Language = 'wo' | 'ff' | 'sr';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  language: Language;
  timestamp: Date;
  audioUrl?: string;
}

const languageNames: Record<Language, string> = {
  wo: 'Wolof',
  ff: 'Poular',
  sr: 'Sérère',
};

/*
 * APPARENCE : icône d'un épi de mil (chandelle), SVG personnalisé
 */
function MilIcon({ className = '' }: { className?: string }) {
  const rows: Array<[number, number[]]> = [
    [6, [24]],
    [10, [21.5, 26.5]],
    [14, [19, 24, 29]],
    [18, [16.5, 21.5, 26.5, 31.5]],
    [22, [14, 19, 24, 29, 34]],
    [26, [16.5, 21.5, 26.5, 31.5]],
    [30, [19, 24, 29]],
    [34, [21.5, 26.5]],
  ];

  return (
    <svg
      viewBox="0 0 48 64"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      {/* Feuilles */}
      <path d="M24 52 Q9 50 5 38 Q18 40 24 52 Z" fill="#7cb342" />
      <path d="M24 58 Q39 56 43 47 Q30 47 24 58 Z" fill="#4e7d4c" />

      {/* Tige */}
      <line
        x1="24"
        y1="36"
        x2="24"
        y2="62"
        stroke="#2d562b"
        strokeWidth="2.6"
        strokeLinecap="round"
      />

      {/* Épi : grains de mil */}
      {rows.map(([y, xs]) =>
        xs.map((x) => (
          <circle
            key={`${x}-${y}`}
            cx={x}
            cy={y}
            r="2.5"
            fill="#d9a441"
            stroke="#b8923a"
            strokeWidth="0.8"
          />
        ))
      )}
    </svg>
  );
}

/*
 * APPARENCE : panneau affiché pendant l'enregistrement
 * (chronomètre + ondes animées + bouton d'arrêt)
 */
function RecordingPanel({ onStop }: { onStop: () => void }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  return (
    <div>
      <style>{`
        @keyframes mil-wave {
          0%, 100% { transform: scaleY(0.2); }
          50% { transform: scaleY(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .mil-wave-bar { animation: none !important; transform: scaleY(0.6); }
        }
      `}</style>

      <p className="mb-2 text-center text-xs font-medium text-red-600">
        Enregistrement en cours… parlez maintenant
      </p>

      <div className="flex items-center gap-3 rounded-full border border-red-200 bg-red-50 py-2 pl-4 pr-2">
        <span className="relative flex h-3 w-3 flex-shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
        </span>

        <div className="flex h-8 flex-1 items-center justify-center gap-[3px] overflow-hidden">
          {Array.from({ length: 28 }).map((_, i) => (
            <span
              key={i}
              className="mil-wave-bar h-full w-[3px] origin-center rounded-full bg-red-400"
              style={{
                animation: `mil-wave ${0.6 + (i % 5) * 0.15}s ease-in-out ${
                  i * 0.04
                }s infinite`,
              }}
            />
          ))}
        </div>

        <span className="flex-shrink-0 font-mono text-sm tabular-nums text-red-600">
          {mm}:{ss}
        </span>

        <button
          type="button"
          onClick={onStop}
          aria-label="Arrêter et envoyer"
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-500 text-white shadow transition-colors hover:bg-red-600"
        >
          <Square className="h-4 w-4 fill-current" />
        </button>
      </div>

      <p className="mt-2 text-center text-[11px] text-[#a39467]">
        Appuyez sur ■ pour envoyer votre question
      </p>
    </div>
  );
}

export function ChatbotWidget() {
  const { user } = useAuthComplete();

  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<Language>('wo');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [parcelleId, setParcelleId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!user) return;
  
    const loadParcelle = async () => {
      try {
        const parcelles = await fetchParcelles();
  
        if (parcelles.length > 0) {
          const id = parcelles[0].idExterne || parcelles[0].id;
  
          setParcelleId(id);
  
          console.log('🌱 Parcelle utilisée par le chatbot :', parcelles[0]);
          console.log('🌱 parcelleId utilisé :', id);
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la parcelle :', error);
      }
    };
  
    void loadParcelle();
  }, [user]);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  /*
   * Les réponses textuelles utilisent toujours la synthèse
   * vocale du navigateur.
   *
   * Les réponses vocales de Sama Agri Voice possèdent
   * leur propre audioUrl et ne passent donc pas ici.
   */
  useEffect(() => {
    if (messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];

    if (
      lastMessage.sender === 'bot' &&
      !lastMessage.audioUrl &&
      !isSpeaking
    ) {
      handleVoiceOutput(lastMessage.text);
    }
  }, [messages]);

  /*
   * CHAT TEXTE
   */
  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const text = inputText.trim();

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      language,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await chatbotApi.chat({
        message: text,
        language,
        conversation_id: conversationId || undefined,
      });

      setConversationId(response.conversation_id);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.message,
        sender: 'bot',
        language,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Erreur chatbot:', error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Désolé, je n\'ai pas pu répondre. Veuillez réessayer.',
        sender: 'bot',
        language,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  /*
   * DÉMARRER / ARRÊTER L'ENREGISTREMENT
   */
  const handleVoiceInput = async () => {
    if (isRecording) {
      stopRecording();
      return;
    }

    if (isLoading) return;

    if (!navigator.mediaDevices?.getUserMedia) {
      alert('L\'accès au microphone n\'est pas supporté par ce navigateur.');
      return;
    }

    if (!window.MediaRecorder) {
      alert('L\'enregistrement audio n\'est pas supporté par ce navigateur.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      mediaStreamRef.current = stream;

      /*
       * Chrome / Edge utilisent généralement WebM + Opus.
       * Sama Agri Voice accepte précisément le .webm.
       */
      let mimeType = '';

      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/webm')) {
        mimeType = 'audio/webm';
      }

      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      const audioChunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const blobType = mimeType || 'audio/webm';

        const audioBlob = new Blob(audioChunks, {
          type: blobType,
        });

        /*
         * Le backend Sama Agri Voice accepte .webm.
         */
        const audioFile = new File(
          [audioBlob],
          `question-${Date.now()}.webm`,
          {
            type: blobType,
          }
        );

        /*
         * Libérer le microphone.
         */
        mediaStreamRef.current?.getTracks().forEach((track) => {
          track.stop();
        });

        mediaStreamRef.current = null;
        mediaRecorderRef.current = null;
        setIsRecording(false);

        if (audioBlob.size === 0) {
          alert('Aucun audio n\'a été enregistré.');
          return;
        }

        await sendVoiceMessage(audioFile);
      };

      recorder.onerror = (event) => {
        console.error('Erreur MediaRecorder:', event);

        mediaStreamRef.current?.getTracks().forEach((track) => {
          track.stop();
        });

        mediaStreamRef.current = null;
        mediaRecorderRef.current = null;
        setIsRecording(false);

        alert('Une erreur est survenue pendant l\'enregistrement.');
      };

      mediaRecorderRef.current = recorder;
      setIsRecording(true);

      recorder.start();
    } catch (error) {
      console.error('Erreur microphone:', error);

      mediaStreamRef.current?.getTracks().forEach((track) => {
        track.stop();
      });

      mediaStreamRef.current = null;
      setIsRecording(false);

      alert(
        'Impossible d\'accéder au microphone. Vérifiez l\'autorisation du navigateur.'
      );
    }
  };

  /*
   * ARRÊTER L'ENREGISTREMENT
   */
  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;

    if (recorder && recorder.state !== 'inactive') {
      recorder.stop();
    }
  };

  /*
   * ENVOYER L'AUDIO À DJANGO → SAMA AGRI VOICE
   */
  const sendVoiceMessage = async (audioFile: File) => {
    setIsLoading(true);
  
    try {
      const currentParcelleId = parcelleId || undefined;

      console.log(
        '🌱 parcelleId envoyé au chatbot :',
        currentParcelleId || 'aucune'
      );
  
      
      const response = await chatbotApi.voiceChat({
        
        audio: audioFile,
        language,
        conversation_id: conversationId || undefined,
        parcelle_id: currentParcelleId,
      });
      console.log('🎤 Réponse chatbot vocal :', response);
      setConversationId(response.conversation_id);
  
      const userMessage: Message = {
        id: `voice-user-${Date.now()}`,
        text: response.question || 'Question vocale',
        sender: 'user',
        language,
        timestamp: new Date(),
      };
  
      const botMessage: Message = {
        id: `voice-bot-${Date.now()}`,
        text: response.message,
        sender: 'bot',
        language,
        timestamp: new Date(),
        audioUrl: response.audio_url || undefined,
      };
  
      setMessages((prev) => [...prev, userMessage, botMessage]);
  
      if (response.audio_url) {
        await playAudio(response.audio_url);
      }
    } catch (error) {
      console.error('Erreur chatbot vocal:', error);
  
      const errorMessage: Message = {
        id: `voice-error-${Date.now()}`,
        text: 'Désolé, je n\'ai pas pu traiter votre question vocale. Veuillez réessayer.',
        sender: 'bot',
        language,
        timestamp: new Date(),
      };
  
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  /*
   * LECTURE AUDIO SAMA AGRI VOICE
   */
  const playAudio = async (url: string) => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      const audio = new Audio(url);

      audioRef.current = audio;
      setIsSpeaking(true);

      audio.onended = () => {
        setIsSpeaking(false);
        audioRef.current = null;
      };

      audio.onerror = () => {
        console.error('Impossible de lire l\'audio:', url);
        setIsSpeaking(false);
        audioRef.current = null;
      };

      await audio.play();
    } catch (error) {
      console.error('Erreur lecture audio:', error);
      setIsSpeaking(false);
    }
  };

  /*
   * SYNTHÈSE VOCALE DU NAVIGATEUR
   *
   * Utilisée uniquement pour les réponses textuelles.
   */
  const handleVoiceOutput = (text: string) => {
    if (!('speechSynthesis' in window)) {
      return;
    }

    speechSynthesis.cancel();

    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang =
      language === 'wo'
        ? 'wo-SN'
        : language === 'ff'
          ? 'ff-SN'
          : language === 'sr'
            ? 'sr-SN'
            : 'fr-FR';

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesis.speak(utterance);
  };

  /*
   * OUVRIR LE CHAT
   */
  const handleOpen = () => {
    setIsOpen(true);
  };

  /*
   * NETTOYAGE
   */
  useEffect(() => {
    return () => {
      mediaStreamRef.current?.getTracks().forEach((track) => {
        track.stop();
      });

      if (audioRef.current) {
        audioRef.current.pause();
      }

      speechSynthesis.cancel();
    };
  }, []);

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={handleOpen}
          aria-label="Ouvrir l'assistant"
          className="fixed bottom-4 right-4 z-50 border-0 bg-transparent p-0 outline-none transition-transform hover:scale-110 focus-visible:scale-110 drop-shadow-[0_4px_6px_rgba(45,86,43,0.35)]"
        >
          <MilIcon className="!h-48 !w-36 overflow-visible" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-6 right-6 z-50 flex w-[calc(100vw-3rem)] max-w-md flex-col overflow-hidden rounded-3xl border border-[#e8d9ae] bg-[#fdf8ec] shadow-2xl"
          style={{ height: '540px', maxHeight: '85vh' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-[#2d562b] px-4 py-3">
            <div className="flex items-center gap-3">
              <MilIcon className="h-9 w-7 flex-shrink-0" />

              <div>
                <h3 className="text-sm font-semibold text-white">
                  Assistant AgroviaTech
                </h3>
                <p className="text-xs text-[#f6d98a]">
                  Posez votre question
                </p>
              </div>
            </div>

            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/15 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Language Selector */}
          <div className="flex gap-1.5 overflow-x-auto px-4 py-2.5">
            {(Object.keys(languageNames) as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  language === lang
                    ? 'bg-[#d9a441] text-[#2d562b]'
                    : 'text-[#6b7a5c] hover:bg-[#f3ead0]'
                }`}
              >
                {languageNames[lang]}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto px-4 pb-4">
            {messages.length === 0 && !isLoading && (
              <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                <MilIcon className="mb-3 h-20 w-16 opacity-90" />
                <p className="text-sm font-medium text-[#2d562b]">
                  Bonjour, comment puis-je vous aider ?
                </p>
                <p className="mt-1 text-xs text-[#8a7d52]">
                  Appuyez sur le micro pour parler, ou écrivez votre question.
                </p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === 'user'
                    ? 'justify-end'
                    : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[82%] px-4 py-2.5 ${
                    message.sender === 'user'
                      ? 'rounded-2xl rounded-br-md bg-[#2d562b] text-white'
                      : 'rounded-2xl rounded-bl-md border border-[#e8d9ae] bg-white text-[#2d3a24]'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>

                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-[11px] opacity-60">
                      {new Date(
                        message.timestamp
                      ).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>

                    {message.sender === 'bot' && (
                      <Button
                        onClick={() => {
                          if (message.audioUrl) {
                            playAudio(message.audioUrl);
                          } else {
                            handleVoiceOutput(message.text);
                          }
                        }}
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 p-0 text-[#b8923a] opacity-70 hover:bg-transparent hover:opacity-100"
                      >
                        <Volume2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-[#e8d9ae] bg-white px-4 py-2.5">
                  <span className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#d9a441]" />
                    <span
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#d9a441]"
                      style={{ animationDelay: '0.15s' }}
                    />
                    <span
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#d9a441]"
                      style={{ animationDelay: '0.3s' }}
                    />
                  </span>
                  <p className="text-sm text-[#7a6a3a]">
                    Analyse de votre question...
                  </p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-[#e8d9ae] bg-[#fbf3dc] p-3">
            {isRecording ? (
              <RecordingPanel onStop={handleVoiceInput} />
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleVoiceInput}
                  size="icon"
                  aria-label="Enregistrer ma question"
                  className="h-11 w-11 flex-shrink-0 rounded-full bg-[#2d562b] text-[#f6d98a] shadow hover:bg-[#3a6b37]"
                  disabled={isLoading}
                >
                  <Mic className="h-5 w-5" />
                </Button>

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === 'Enter' && handleSendMessage()
                  }
                  placeholder="Écrivez votre message..."
                  className="h-11 flex-1 rounded-full border border-[#e8d9ae] bg-white px-4 text-sm text-[#2d3a24] placeholder:text-[#a39467] focus:outline-none focus:ring-2 focus:ring-[#d9a441]"
                  disabled={isLoading}
                />

                <Button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isLoading}
                  className="h-11 w-11 flex-shrink-0 rounded-full bg-[#d9a441] text-[#2d562b] hover:bg-[#e6b556] disabled:bg-[#e8d9ae] disabled:text-[#a39467]"
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
