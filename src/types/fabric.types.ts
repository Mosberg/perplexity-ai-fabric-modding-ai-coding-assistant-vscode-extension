/**
 * Core Fabric AI types for the entire extension
 */

/**
 * Generator types supported by Fabric AI
 */
export type GeneratorType =
  | "entity"
  | "block"
  | "item"
  | "command"
  | "renderer"
  | "screen"
  | "overlay"
  | "config"
  | "mixin";

/**
 * Fabric mod configuration
 */
export interface FabricConfig {
  minecraftVersion: string;
  yarnMappings: string;
  loaderVersion: string;
  fabricVersion: string;
  loomVersion: string;
  javaVersion: number;
  modId: string;
  packageName: string;
}

/**
 * Generation result from generators
 */
export interface GenerationResult {
  success: boolean;
  content: string;
  error?: string;
}

/**
 * Chat session data
 */
export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  name: string;
  messages: ChatMessage[];
  provider: ApiProvider;
  model: string;
}

/**
 * API providers
 */
export type ApiProvider = "perplexity" | "deepseek";

/**
 * Webview message protocol
 */
export interface WebviewMessage {
  command: string;
  text?: string;
  data?: any;
}

/**
 * Completion context
 */
export interface CompletionContext {
  document: string;
  position: number;
  prefix: string;
  suffix: string;
}
