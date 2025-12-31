import * as vscode from 'vscode';

export class HttpClient {
  private static instance: HttpClient;
  private readonly defaultTimeout = 30000; // 30s
  private readonly maxRetries = 3;

  private constructor() {}

  static getInstance(): HttpClient {
    if (!HttpClient.instance) {
      HttpClient.instance = new HttpClient();
    }
    return HttpClient.instance;
  }

  async request(url: string, options: RequestInit & { retries?: number } = {}): Promise<any> {
    const { retries = this.maxRetries, ...fetchOptions } = options;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.defaultTimeout);

        const response = await fetch(url, {
          ...fetchOptions,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return response.json();
      } catch (error: any) {
        if (attempt === retries || error.name === 'AbortError') {
          throw error;
        }

        // Exponential backoff
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw new Error('Max retries exceeded');
  }

  // Streaming for chat completions
  async *streamRequest(url: string, options: RequestInit): AsyncGenerator<string> {
    const controller = new AbortController();

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Accept': 'text/event-stream',
          'Cache-Control': 'no-cache'
        },
        signal: controller.signal
      });

      if (!response.ok || !response.body) {
        throw new Error(`Stream failed: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) {break;}

        const chunk = decoder.decode(value);
        yield chunk;
      }
    } catch (error) {
      controller.abort();
      throw error;
    }
  }

  // Perplexity API helper
  async chatCompletion(messages: Array<{role: string, content: string}>, model = 'llama-3.1-sonar-small-128k-online'): Promise<string> {
    const apiKey = await this.getApiKey();

    const response = await this.request('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.1,
        stream: false
      })
    });

    return response.choices[0].message.content;
  }

  // Secure API key retrieval
  private async getApiKey(): Promise<string> {
    // In real implementation, use context.secrets.get('perplexity-api-key')
    // For now, fallback to config
    const config = vscode.workspace.getConfiguration('fabric');
    const apiKey = config.get('perplexityApiKey') as string;

    if (!apiKey || !apiKey.startsWith('pplx-')) {
      throw new Error('Perplexity API key not configured. Run "Fabric AI: Set API Key"');
    }

    return apiKey;
  }
}
