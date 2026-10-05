import api from './api';

export interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  content: string;
  language: string;
  created_at: string;
}

export interface Conversation {
  id: number;
  user: number;
  language: string;
  created_at: string;
  updated_at: string;
  messages: ChatMessage[];
}

export interface ChatRequest {
  message: string;
  language: string;
  conversation_id?: number;
}

export interface ChatResponse {
  message: string;
  conversation_id: number;
  user_message_id: number;
  bot_message_id: number;
}

export interface TTSRequest {
  text: string;
  language: string;
}

export interface TTSResponse {
  success: boolean;
  message: string;
  language: string;
}

export interface STTRequest {
  audio: File;
  language: string;
}

export interface STTResponse {
  text: string;
  language: string;
}

export interface VoiceChatRequest {
  audio: File;
  language: string;
  conversation_id?: number;
}

export interface VoiceChatResponse {
  question: string;
  message: string;
  audio_url: string | null;
  conversation_id: number;
  user_message_id: number;
  bot_message_id: number;
}

export const chatbotApi = {
  // Envoyer un message et obtenir une réponse
  async chat(request: ChatRequest): Promise<ChatResponse> {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/ai-assistant/conversations/chat/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de la communication avec le chatbot');
    }
    
    return response.json();
  },

  // Synthèse vocale (Text-to-Speech)
  async textToSpeech(request: TTSRequest): Promise<TTSResponse> {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/ai-assistant/tts/synthesize/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de la synthèse vocale');
    }
    
    return response.json();
  },

  // Reconnaissance vocale (Speech-to-Text)
  async speechToText(request: STTRequest): Promise<STTResponse> {
    const formData = new FormData();
    formData.append('audio', request.audio);
    formData.append('language', request.language);
    
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/ai-assistant/stt/transcribe/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de la reconnaissance vocale');
    }
    
    return response.json();
  },

  async voiceChat(request: VoiceChatRequest): Promise<VoiceChatResponse> {
  const formData = new FormData();

  formData.append('audio', request.audio);
  formData.append('language', request.language);

  if (request.conversation_id) {
    formData.append(
      'conversation_id',
      request.conversation_id.toString()
    );
  }

  const response = await fetch(
    `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/ai-assistant/conversations/voice-chat/`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));

    throw new Error(
      error.detail ||
      error.error ||
      'Erreur lors du traitement de la question vocale'
    );
  }

  return response.json();
},

  // Récupérer toutes les conversations de l'utilisateur
  async getConversations(): Promise<Conversation[]> {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/ai-assistant/conversations/`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des conversations');
    }
    
    return response.json();
  },

  // Récupérer une conversation spécifique
  async getConversation(id: number): Promise<Conversation> {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/ai-assistant/conversations/${id}/`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération de la conversation');
    }
    
    return response.json();
  },

  // Créer une nouvelle conversation
  async createConversation(language: string): Promise<Conversation> {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/ai-assistant/conversations/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
      body: JSON.stringify({ language }),
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de la création de la conversation');
    }
    
    return response.json();
  },
};
