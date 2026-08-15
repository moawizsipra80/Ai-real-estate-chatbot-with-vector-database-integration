import { AIChatRequest, AIChatResponse } from '../types/ai';

const API_BASE = '/api';

export async function sendAIChatMessage(req: AIChatRequest): Promise<AIChatResponse> {
  try {
    const response = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Server returned status ${response.status}`);
    }

    return data;
  } catch (error: any) {
    console.error('Error sending AI chat message:', error);
    return {
      success: false,
      intent: 'REAL_ESTATE_QUESTION',
      answer: `⚠️ **Unable to connect to AI Assistant.**\n\n${error.message || 'Please check your internet connection or backend server status.'}`
    };
  }
}

export async function streamAIChatMessage(
  req: AIChatRequest,
  onChunk: (chunk: string) => void,
  onComplete: (res: { intent: string; properties?: any[]; context?: any }) => void,
  onError: (err: string) => void
): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/ai/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req)
    });

    if (!response.ok || !response.body) {
      // Fallback to standard HTTP fetch if streaming fails or unsupported
      const fallbackData = await sendAIChatMessage(req);
      onChunk(fallbackData.answer);
      onComplete({ intent: fallbackData.intent, properties: fallbackData.properties, context: fallbackData.context });
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const jsonStr = line.replace('data: ', '').trim();
          if (!jsonStr) continue;

          try {
            const data = JSON.parse(jsonStr);
            if (data.type === 'text') {
              onChunk(data.chunk);
            } else if (data.type === 'done') {
              onComplete({ intent: data.intent, properties: data.properties, context: data.context });
            } else if (data.type === 'error') {
              onError(data.message);
            }
          } catch (e) {
            console.warn('Malformed SSE event data:', jsonStr);
          }
        }
      }
    }
  } catch (err: any) {
    console.error('Stream error:', err);
    onError(err.message || 'Stream processing error');
  }
}
