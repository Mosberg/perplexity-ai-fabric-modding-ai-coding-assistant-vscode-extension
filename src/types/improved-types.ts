/**
 * Enhanced types with error handling and validation
 */

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Custom error classes
 */
export class ValidationError extends Error {
  constructor(public validation: ValidationResult) {
    super(validation.error || "Validation failed");
    this.name = "ValidationError";
  }
}

export class HttpError extends Error {
  constructor(public status: number, public response?: string) {
    super(`HTTP ${status}: ${response?.slice(0, 100)}`);
    this.name = "HttpError";
  }
}

export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigError";
  }
}

/**
 * API request/response types
 */
export interface PerplexityRequest {
  model: string;
  messages: Array<{ role: string; content: string }>;
  temperature?: number;
  stream?: boolean;
}

export interface PerplexityResponse {
  choices: Array<{
    message: { role: string; content: string };
    finish_reason: string;
  }>;
}

/**
 * Stream chunk
 */
export interface StreamChunk {
  content: string;
  done: boolean;
}
