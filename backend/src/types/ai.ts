import { IProperty } from './property';

export type AIIntent = 
  | 'PROPERTY_SEARCH'
  | 'PROPERTY_DETAILS'
  | 'REAL_ESTATE_QUESTION'
  | 'MARKET_INSIGHT';

export interface ChatRoleMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIChatRequest {
  message: string;
  history?: ChatRoleMessage[];
  context?: Record<string, any>;
}

export interface AIChatResponse {
  success: boolean;
  intent: AIIntent;
  answer: string;
  properties?: IProperty[];
  context?: Record<string, any>;
  message?: string;
  error?: string;
}

export interface ExtractedCriteria {
  location?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  keywords?: string[];
  propertyIndexMentioned?: number; // e.g. 0 for "the first one"
}
