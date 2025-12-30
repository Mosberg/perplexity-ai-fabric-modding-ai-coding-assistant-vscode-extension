import { FabricAgent } from "../fabricAgent";
import { HttpClient } from "../services/http-client";
import { ErrorHandler } from "../utils/error-handler";

/**
 * Chat provider for conversational AI interactions
 */
export class ChatProvider {
  private readonly httpClient: HttpClient;
  private readonly agent: FabricAgent;
  private readonly errorHandler: ErrorHandler;

  constructor(
    agent: FabricAgent,
    httpClient: HttpClient,
    errorHandler: ErrorHandler
  ) {
    this.agent = agent;
    this.httpClient = httpClient;
    this.errorHandler = errorHandler;
  }

  /**
   * Send message to AI and stream response
   */
  async sendMessage(
    message: string,
    streamCallback?: (chunk: string) => void
  ): Promise<string> {
    try {
      const apiKey = await this.agent.getApiKey();

      const stream = this.httpClient.streamRequest(
        "https://api.perplexity.ai/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.1-sonar-small-128k-online",
            messages: [
              {
                role: "system",
                content: `You are FabricAI - expert Minecraft Fabric modding assistant for MC 1.21.10.
Capabilities: Generate complete working Java code, explain Fabric API, debug mod issues, architecture advice.
Always provide production-ready code with proper imports, Fabric conventions, and comments.`,
              },
              { role: "user", content: message },
            ],
            temperature: 0.1,
            stream: true,
          }),
        }
      );

      let fullResponse = "";
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
      return "Error: Could not get response from AI";
    }
  }

  private parseStreamChunk(chunk: string): string {
    const lines = chunk.split("\n").filter((line) => line.trim());
    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const data = line.slice(6);
        if (data === "[DONE]") {
          return "";
        }

        try {
          const parsed = JSON.parse(data);
          return parsed.choices?.[0]?.delta?.content ?? "";
        } catch {
          // Invalid JSON chunk, skip
        }
      }
    }
    return "";
  }
}
