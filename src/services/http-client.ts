import("node-fetch");
// Use the built-in AbortController from Node.js or the global scope

/**
 * HTTP Client Configuration
 */
export interface HttpClientConfig {
  timeout: number;
  maxRetries: number;
  retryDelay: number;
  backoffMultiplier: number;
}

/**
 * Extended request options
 */
export interface HttpRequestOptions extends RequestInit {
  timeout?: number;
  retries?: number;
}

/**
 * Production-grade HTTP client singleton with retry logic and streaming
 * Features: retry with exponential backoff, timeouts, streaming, cleanup
 */
export class HttpClient {
  private static instance: HttpClient;
  private readonly config: HttpClientConfig;
  private activeControllers: Map<string, AbortController> = new Map();

  private constructor(config?: Partial<HttpClientConfig>) {
    this.config = {
      timeout: config?.timeout ?? 30000,
      maxRetries: config?.maxRetries ?? 3,
      retryDelay: config?.retryDelay ?? 1000,
      backoffMultiplier: config?.backoffMultiplier ?? 2,
    };
  }

  static getInstance(config?: Partial<HttpClientConfig>): HttpClient {
    if (!HttpClient.instance) {
      HttpClient.instance = new HttpClient(config);
    }
    return HttpClient.instance;
  }

  /**
   * Make HTTP request with automatic retry logic
   */
  async request<T = any>(
    url: string,
    options: HttpRequestOptions = {}
  ): Promise<T> {
    const requestId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const timeout = options.timeout ?? this.config.timeout;
    const maxRetries = options.retries ?? this.config.maxRetries;

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await this.executeRequest<T>(url, options, timeout, requestId);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (this.isClientError(lastError) || attempt === maxRetries) {
          throw lastError;
        }

        const delay =
          this.config.retryDelay *
          Math.pow(this.config.backoffMultiplier, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw lastError ?? new Error("Unknown error after all retries");
  }

  /**
   * Streaming request using AsyncGenerator
   */
  async *streamRequest(
    url: string,
    options: HttpRequestOptions = {}
  ): AsyncGenerator<string, void, unknown> {
    const requestId = `stream-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}`;
    const controller = new AbortController();
    this.activeControllers.set(requestId, controller);

    const timeoutId = setTimeout(
      () => controller.abort(),
      options.timeout ?? this.config.timeout
    );

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
      } finally {
        reader.releaseLock();
      }
    } finally {
      clearTimeout(timeoutId);
      this.activeControllers.delete(requestId);
    }
  }

  /**
   * Abort all active requests
   */
  abortAll(): void {
    this.activeControllers.forEach((controller) => controller.abort());
    this.activeControllers.clear();
  }

  /**
   * Cleanup resources
   */
  dispose(): void {
    this.abortAll();
  }

  private async executeRequest<T>(
    url: string,
    options: HttpRequestOptions,
    timeout: number,
    requestId: string
  ): Promise<T> {
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

      return (await response.json()) as T;
    } finally {
      clearTimeout(timeoutId);
      this.activeControllers.delete(requestId);
    }
  }

  private isClientError(error: Error): boolean {
    return /^HTTP 4\d{2}/.test(error.message);
  }
}
