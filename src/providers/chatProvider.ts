import * as vscode from 'vscode';
import { FabricAgent } from '../fabricAgent';
import { HttpClient } from '../services/http-client';
import { ErrorHandler } from '../utils/error-handler';

export class ChatProvider {
  constructor(
    private readonly agent: FabricAgent,
    private readonly httpClient: HttpClient,
    private readonly errorHandler: ErrorHandler
  ) {}

  /**
   * Send message to Perplexity AI with streaming
   */
  async sendMessage(
    message: string,
    streamCallback?: (chunk: string) => void
  ): Promise<string> {
    try {
      const apiKey = await this.getApiKey();

      const stream = this.httpClient.streamRequest('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: `You are FabricAI - expert Minecraft Fabric modding assistant (1.21.10, Java 21).
Capabilities: Generate complete working Java code with dk.mosberg package, explain Fabric API, debug issues, architecture advice.
ALWAYS provide production-ready code with:
- package dk.mosberg.*
- Identifier.of("mana", "name")
- Registry.register(Registries.XXX, id, value)
- Java 21 features (records, pattern matching)
- Proper imports and error handling`
            },
            { role: 'user', content: message }
          ],
          temperature: 0.1,
          stream: true,
        }),
      });

      let fullResponse = '';
      for await (const chunk of stream) {
        const content = this.parseStreamChunk(chunk);
        if (content) {
          fullResponse += content;
          streamCallback?.(content);
        }
      }

      return fullResponse;
    } catch (error) {
      this.errorHandler.handleError(error);
      return '❌ Error: Could not get response from AI. Check API key and network.';
    }
  }

  private parseStreamChunk(chunk: string): string {
    const lines = chunk.split('\n').filter(line => line.trim());

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);

        if (data === '[DONE]') {return '';}

        try {
          const parsed = JSON.parse(data);
          return parsed.choices?.[0]?.delta?.content ?? '';
        } catch {
          // Skip invalid JSON
        }
      }
    }

    return '';
  }

  private async getApiKey(): Promise<string> {
    // Use FabricAgent's public method
    const apiKey = await this.agent.getPerplexityApiKey();

    if (apiKey) {return apiKey;}

    // Fallback to workspace config
    const config = vscode.workspace.getConfiguration('fabric');
    const keyFromConfig = config.get('perplexityApiKey') as string;

    if (keyFromConfig?.startsWith('pplx-')) {
      return keyFromConfig;
    }

    throw new Error('No valid Perplexity API key found. Run "Fabric AI: Set API Key"');
  }
}
