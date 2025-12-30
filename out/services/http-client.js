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
Promise.resolve().then(() => __importStar(require("node-fetch")));
/**
 * Production-grade HTTP client singleton with retry logic and streaming
 * Features: retry with exponential backoff, timeouts, streaming, cleanup
 */
class HttpClient {
    constructor(config) {
        this.activeControllers = new Map();
        this.config = {
            timeout: config?.timeout ?? 30000,
            maxRetries: config?.maxRetries ?? 3,
            retryDelay: config?.retryDelay ?? 1000,
            backoffMultiplier: config?.backoffMultiplier ?? 2,
        };
    }
    static getInstance(config) {
        if (!HttpClient.instance) {
            HttpClient.instance = new HttpClient(config);
        }
        return HttpClient.instance;
    }
    /**
     * Make HTTP request with automatic retry logic
     */
    async request(url, options = {}) {
        const requestId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const timeout = options.timeout ?? this.config.timeout;
        const maxRetries = options.retries ?? this.config.maxRetries;
        let lastError = null;
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                return await this.executeRequest(url, options, timeout, requestId);
            }
            catch (error) {
                lastError = error instanceof Error ? error : new Error(String(error));
                if (this.isClientError(lastError) || attempt === maxRetries) {
                    throw lastError;
                }
                const delay = this.config.retryDelay *
                    Math.pow(this.config.backoffMultiplier, attempt);
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }
        throw lastError ?? new Error("Unknown error after all retries");
    }
    /**
     * Streaming request using AsyncGenerator
     */
    async *streamRequest(url, options = {}) {
        const requestId = `stream-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}`;
        const controller = new AbortController();
        this.activeControllers.set(requestId, controller);
        const timeoutId = setTimeout(() => controller.abort(), options.timeout ?? this.config.timeout);
        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            if (!response.body) {
                throw new Error("No response body");
            }
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) {
                        break;
                    }
                    const chunk = decoder.decode(value, { stream: true });
                    yield chunk;
                }
            }
            finally {
                reader.releaseLock();
            }
        }
        finally {
            clearTimeout(timeoutId);
            this.activeControllers.delete(requestId);
        }
    }
    /**
     * Abort all active requests
     */
    abortAll() {
        this.activeControllers.forEach((controller) => controller.abort());
        this.activeControllers.clear();
    }
    /**
     * Cleanup resources
     */
    dispose() {
        this.abortAll();
    }
    async executeRequest(url, options, timeout, requestId) {
        const controller = new AbortController();
        this.activeControllers.set(requestId, controller);
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                const errorText = await response.text().catch(() => "Unknown error");
                throw new Error(`HTTP ${response.status}: ${errorText.slice(0, 200)}`);
            }
            return (await response.json());
        }
        finally {
            clearTimeout(timeoutId);
            this.activeControllers.delete(requestId);
        }
    }
    isClientError(error) {
        return /^HTTP 4\d{2}/.test(error.message);
    }
}
exports.HttpClient = HttpClient;
//# sourceMappingURL=http-client.js.map