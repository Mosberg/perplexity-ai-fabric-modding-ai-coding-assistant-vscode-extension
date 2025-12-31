"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatProvider = void 0;
const vscode = __importStar(require("vscode"));
class ChatProvider {
    constructor(agent, httpClient, errorHandler) {
        this.agent = agent;
        this.httpClient = httpClient;
        this.errorHandler = errorHandler;
    }
    /**
     * Send message to Perplexity AI with streaming
     */
    async sendMessage(message, streamCallback) {
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
        }
        catch (error) {
            this.errorHandler.handleError(error);
            return '❌ Error: Could not get response from AI. Check API key and network.';
        }
    }
    parseStreamChunk(chunk) {
        const lines = chunk.split('\n').filter(line => line.trim());
        for (const line of lines) {
            if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') {
                    return '';
                }
                try {
                    const parsed = JSON.parse(data);
                    return parsed.choices?.[0]?.delta?.content ?? '';
                }
                catch {
                    // Skip invalid JSON
                }
            }
        }
        return '';
    }
    async getApiKey() {
        // Use FabricAgent's public method
        const apiKey = await this.agent.getPerplexityApiKey();
        if (apiKey) {
            return apiKey;
        }
        // Fallback to workspace config
        const config = vscode.workspace.getConfiguration('fabric');
        const keyFromConfig = config.get('perplexityApiKey');
        if (keyFromConfig?.startsWith('pplx-')) {
            return keyFromConfig;
        }
        throw new Error('No valid Perplexity API key found. Run "Fabric AI: Set API Key"');
    }
}
exports.ChatProvider = ChatProvider;
//# sourceMappingURL=chatProvider.js.map