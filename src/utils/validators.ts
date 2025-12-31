import type { ValidationResult } from '../types/improved-types';

export class Validators {
  /**
   * Validate Perplexity API key format
   */
  static validateApiKey(key: string): ValidationResult {
    if (!key?.trim()) {
      return { valid: false, error: 'API key is required' };
    }

    const trimmed = key.trim();
    if (!trimmed.startsWith('pplx-')) {
      return { valid: false, error: 'API key must start with "pplx-"' };
    }

    if (trimmed.length < 20) {
      return { valid: false, error: 'API key too short (minimum 20 characters)' };
    }

    return { valid: true };
  }

  /**
   * Validate Fabric mod ID (snake_case)
   */
  static validateModId(modId: string): ValidationResult {
    if (!modId?.trim()) {
      return { valid: false, error: 'Mod ID is required' };
    }

    const trimmed = modId.trim().toLowerCase();
    if (!/^[a-z][a-z0-9_]*[a-z0-9]$/.test(trimmed)) {
      return {
        valid: false,
        error: 'Mod ID must: start/end with letter, lowercase letters/numbers/underscores only'
      };
    }

    if (trimmed.length < 3 || trimmed.length > 64) {
      return { valid: false, error: 'Mod ID must be 3-64 characters' };
    }

    return { valid: true };
  }

  /**
   * Validate Java class name (PascalCase)
   */
  static validateClassName(className: string): ValidationResult {
    if (!className?.trim()) {
      return { valid: false, error: 'Class name is required' };
    }

    const trimmed = className.trim();
    if (!/^[A-Z][a-zA-Z0-9]*$/.test(trimmed)) {
      return {
        valid: false,
        error: 'Class name must: start with uppercase, letters/numbers only (PascalCase)'
      };
    }

    if (trimmed.length < 2 || trimmed.length > 64) {
      return { valid: false, error: 'Class name must be 2-64 characters' };
    }

    // Common Java keywords
    const keywords = ['class', 'interface', 'enum', 'abstract', 'final', 'static'];
    if (keywords.includes(trimmed.toLowerCase())) {
      return { valid: false, error: 'Class name cannot be a Java keyword' };
    }

    return { valid: true };
  }

  /**
   * Validate Java package name (reverse domain)
   */
  static validatePackageName(pkg: string): ValidationResult {
    if (!pkg?.trim()) {
      return { valid: false, error: 'Package name is required' };
    }

    const trimmed = pkg.trim();
    if (!/^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)*$/.test(trimmed)) {
      return {
        valid: false,
        error: 'Package must be lowercase reverse domain (com.example.mod)'
      };
    }

    const parts = trimmed.split('.');
    if (parts.length < 2) {
      return { valid: false, error: 'Package must have at least 2 segments (com.example)' };
    }

    return { valid: true };
  }

  /**
   * Validate chat prompt
   */
  static validatePrompt(prompt: string): ValidationResult {
    if (!prompt?.trim()) {
      return { valid: false, error: 'Prompt cannot be empty' };
    }

    const trimmed = prompt.trim();
    if (trimmed.length > 4000) {
      return { valid: false, error: 'Prompt too long (max 4000 characters)' };
    }

    // Detect multiple code blocks (``` ... ```) in the prompt
    const codeBlockMatches = trimmed.match(/```[\s\S]*?```/g);
    if (codeBlockMatches && codeBlockMatches.length > 1) {
      return { valid: false, error: 'Multiple code blocks detected - use plain text' };
    }

    return { valid: true };
  }

  /**
   * Sanitize user input for safe usage
   */
  static sanitizeInput(input: string): string {
    if (!input) {return '';}

    return input
      .trim()
      .replace(/[<>"'&]/g, '')           // Remove dangerous chars
      .replace(/\s+/g, ' ')              // Normalize whitespace
      .substring(0, 1000);               // Limit length
  }

  /**
   * Validate complete Fabric config
   */
  static validateFabricConfig(config: any): ValidationResult {
    const errors = [];

    if (!Validators.validateModId(config.modId).valid) {
      errors.push('Invalid modId');
    }

    if (!Validators.validatePackageName(config.packageName).valid) {
      errors.push('Invalid packageName');
    }

    if (!/^\d+\.\d+\.\d+$/.test(config.minecraftVersion)) {
      errors.push('Invalid Minecraft version');
    }

    return {
      valid: errors.length === 0,
      error: errors.length ? errors.join(', ') : undefined
    };
  }
}
