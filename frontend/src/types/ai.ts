import { Property } from './property';

export type AIIntent = 
  | 'PROPERTY_SEARCH'
  | 'PROPERTY_DETAILS'
  | 'REAL_ESTATE_QUESTION'
  | 'MARKET_INSIGHT';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  intent?: AIIntent;
  properties?: Property[];
  isStreaming?: boolean;
}

export interface AIChatRequest {
  message: string;
  history?: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
  context?: Record<string, any>;
}

export interface AIChatResponse {
  success: boolean;
  intent: AIIntent;
  answer: string;
  properties?: Property[];
  context?: Record<string, any>;
  message?: string;
}
