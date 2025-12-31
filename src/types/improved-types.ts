import * as vscode from 'vscode';

/**
 * Enhanced types with validation and error handling
 * Strict TypeScript for production VSCode extension
 */

/**
 * Generic validation result
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Custom error classes (extendable)
 */
export class ValidationError extends Error {
  public readonly validation: ValidationResult;

  constructor(message: string, validation: ValidationResult) {
    super(message);
    this.name = 'ValidationError';
    this.validation = validation;
  }
}

export class HttpError extends Error {
  public readonly status: number;
  public readonly response?: string;

  constructor(status: number, message: string, response?: string) {
    super(`HTTP ${status}: ${message}`);
    this.name = `HttpError_${status}`;
    this.status = status;
    this.response = response;
  }
}

export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigError';
  }
}

export class ApiError extends Error {
  public readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
  }
}

/**
 * Perplexity API types
 */
export interface PerplexityRequest {
  model: string;
  messages: Array<{ role: string; content: string }>;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface PerplexityChoice {
  message: { role: string; content: string };
  finish_reason: string;
}

export interface PerplexityResponse {
  choices: PerplexityChoice[];
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Stream chunk for real-time chat
 */
export interface StreamChunk {
  content: string;
  done: boolean;
}

/**
 * File operations result
 */
export interface FileResult {
  uri: vscode.Uri;
  success: boolean;
  path: string;
  error?: string;
}

/**
 * Quick action configuration
 */
export interface QuickActionConfig {
  id: string;
  label: string;
  icon: string;
  category: string;
  color: string;
}

/**
 * Utility type helpers
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Constructor<T = {}> = new (...args: any[]) => T;

/**
 * Promise with timeout
 */
export type TimeoutPromise<T> = Promise<T> & { timeout: (ms: number) => Promise<T> };

/**
 * VSCode disposable collection
 */
export type DisposableLike = vscode.Disposable | (() => void) | undefined;

/**
 * Non-null assertion helper
 */
export type NonNullable<T> = T extends null | undefined ? never : T;
