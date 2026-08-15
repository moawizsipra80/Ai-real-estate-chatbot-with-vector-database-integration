import { AIChatRequest } from '../types/ai';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedMessage?: string;
}

export function sanitizeInput(text: string): string {
  if (typeof text !== 'string') return '';
  // Basic HTML tag strip & trim
  return text
    .replace(/<[^>]*>?/gm, '')
    .trim();
}

export function validateAIChatRequest(body: any): ValidationResult {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Request body must be a valid JSON object.' };
  }

  const { message, history, context } = body;

  // 1. Message check
  if (message === undefined || message === null) {
    return { isValid: false, error: 'Message is required.' };
  }

  if (typeof message !== 'string') {
    return { isValid: false, error: 'Message must be a string.' };
  }

  const sanitizedMessage = sanitizeInput(message);

  if (sanitizedMessage.length === 0) {
    return { isValid: false, error: 'Message cannot be empty.' };
  }

  if (sanitizedMessage.length > 1000) {
    return { isValid: false, error: 'Message exceeds maximum length of 1000 characters.' };
  }

  // 2. History check (optional)
  if (history !== undefined && history !== null) {
    if (!Array.isArray(history)) {
      return { isValid: false, error: 'History must be an array of messages.' };
    }

    for (let i = 0; i < history.length; i++) {
      const item = history[i];
      if (typeof item !== 'object' || item === null) {
        return { isValid: false, error: `Invalid history item at index ${i}.` };
      }
      if (!['user', 'assistant', 'system'].includes(item.role)) {
        return { isValid: false, error: `Invalid role "${item.role}" in history at index ${i}.` };
      }
      if (typeof item.content !== 'string') {
        return { isValid: false, error: `Invalid content in history item at index ${i}.` };
      }
    }
  }

  // 3. Context check (optional)
  if (context !== undefined && context !== null) {
    if (typeof context !== 'object' || Array.isArray(context)) {
      return { isValid: false, error: 'Context must be a valid key-value object.' };
    }
  }

  return {
    isValid: true,
    sanitizedMessage
  };
}
