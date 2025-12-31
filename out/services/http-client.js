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
exports.HttpClient = void 0;
const vscode = __importStar(require("vscode"));
class HttpClient {
    constructor() {
        this.defaultTimeout = 30000; // 30s
        this.maxRetries = 3;
    }
    static getInstance() {
        if (!HttpClient.instance) {
            HttpClient.instance = new HttpClient();
        }
        return HttpClient.instance;
    }
    async request(url, options = {}) {
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
            }
            catch (error) {
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
    async *streamRequest(url, options) {
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
                if (done) {
                    break;
                }
                const chunk = decoder.decode(value);
                yield chunk;
            }
        }
        catch (error) {
            controller.abort();
            throw error;
        }
    }
    // Perplexity API helper
    async chatCompletion(messages, model = 'llama-3.1-sonar-small-128k-online') {
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
    async getApiKey() {
        // In real implementation, use context.secrets.get('perplexity-api-key')
        // For now, fallback to config
        const config = vscode.workspace.getConfiguration('fabric');
        const apiKey = config.get('perplexityApiKey');
        if (!apiKey || !apiKey.startsWith('pplx-')) {
            throw new Error('Perplexity API key not configured. Run "Fabric AI: Set API Key"');
        }
        return apiKey;
    }
}
exports.HttpClient = HttpClient;
//# sourceMappingURL=http-client.js.map