import type { Position, TextDocument } from 'vscode';

/**
 * Core Fabric AI types for the entire extension
 * Fabric 1.21.10 + Java 21 + VSCode Extension
 */

/**
 * Generator types supported by Fabric AI
 */
export type GeneratorType =
  | 'entity' | 'block' | 'item' | 'command'
  | 'renderer' | 'screen' | 'overlay' | 'config' | 'mixin';

/**
 * Fabric mod configuration (1.21.10 exact versions)
 */
export interface FabricConfig {
  minecraftVersion: string;
  yarnMappings: string;
  loaderVersion: string;
  fabricApiVersion: string;
  loomVersion: string;
  javaVersion: number;
  modId: string;
  packageName: string;
}

/**
 * Generation result from all generators
 */
export interface GenerationResult {
  success: boolean;
  content: string;
  filePath?: string;
  error?: string;
}

/**
 * Webview message protocol (fabric-agent.html ↔ extension)
 */
export interface WebviewMessage {
  command: string;
  text?: string;
  data?: any;
  name?: string;
}

/**
 * Chat session data
 */
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  name: string;
  messages: ChatMessage[];
  model: string;
}

/**
 * Completion context for LSP
 */
export interface CompletionContext {
  document: TextDocument;
  position: Position;
  prefix: string;
  triggerCharacter?: string;
}

/**
 * Fabric registry identifiers
 */
export const FABRIC_REGISTRIES = {
  BLOCK: 'block',
  ITEM: 'item',
  ENTITY_TYPE: 'entity_type',
  COMMAND: 'command',
  SCREEN_HANDLER: 'screen_handler'
} as const;

/**
 * Java package structure for Fabric
 */
export const PACKAGE_STRUCTURE = {
  COMMON: 'dk.mosberg',
  CLIENT: 'dk.mosberg.client',
  RENDER: 'dk.mosberg.client.render',
  SCREEN: 'dk.mosberg.client.screen',
  CONFIG: 'dk.mosberg.config',
  MIXIN: 'dk.mosberg.mixin'
} as const;

/**
 * Fabric spawn groups for entities
 */
export const SPAWN_GROUPS = [
  'MONSTER', 'CREATURE', 'AMBIENT', 'AXOLOTLS',
  'UNDERGROUND_WATER_CREATURE', 'WATER_CREATURE',
  'WATER_AMBIENT', 'MISC', 'MICRO_CREATURE'
] as const;

export type SpawnGroup = typeof SPAWN_GROUPS[number];

/**
 * Quick action buttons in webview
 */
export interface QuickAction {
  id: GeneratorType;
  label: string;
  icon: string;
  color: string;
}
