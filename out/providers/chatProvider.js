"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatProvider = void 0;
/**
 * Chat provider for conversational AI interactions
 */
class ChatProvider {
    constructor(agent, httpClient, errorHandler) {
        this.agent = agent;
        this.httpClient = httpClient;
        this.errorHandler = errorHandler;
    }
    /**
     * Send message to AI and stream response
     */
    async sendMessage(message, streamCallback) {
        try {
            const apiKey = await this.agent.getApiKey();
            const stream = this.httpClient.streamRequest("https://api.perplexity.ai/chat/completions", {
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
            });
            let fullResponse = "";
            for await (const chunk of stream) {
                const content = this.parseStreamChunk(chunk);
                if (content) {
                    fullResponse += content;
                    streamCallback?.(content);
                }
            }
            return fullResponse;
        }
        catch (error) {
            this.errorHandler.handleError(error);
            return "Error: Could not get response from AI";
        }
    }
    parseStreamChunk(chunk) {
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
                }
                catch {
                    // Invalid JSON chunk, skip
                }
            }
        }
        return "";
    }
}
exports.ChatProvider = ChatProvider;
//# sourceMappingURL=chatProvider.js.map