"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validators = void 0;
/**
 * Comprehensive input validation system
 */
class Validators {
    /**
     * Validate Perplexity API key format
     */
    static validateApiKey(key) {
        if (!key)
            return { valid: false, error: "API key is required" };
        if (!key.startsWith("pplx-")) {
            return { valid: false, error: 'API key must start with "pplx-"' };
        }
        if (key.length < 20) {
            return { valid: false, error: "API key too short" };
        }
        return { valid: true };
    }
    /**
     * Validate Fabric mod ID
     */
    static validateModId(modId) {
        if (!modId)
            return { valid: false, error: "Mod ID is required" };
        if (!/^[a-z0-9_]+$/.test(modId)) {
            return {
                valid: false,
                error: "Mod ID must contain only lowercase letters, numbers, underscores",
            };
        }
        if (modId.length < 3 || modId.length > 64) {
            return { valid: false, error: "Mod ID must be 3-64 characters" };
        }
        return { valid: true };
    }
    /**
     * Validate Java class name (PascalCase)
     */
    static validateClassName(className) {
        if (!className)
            return { valid: false, error: "Class name is required" };
        if (!/^[A-Z][a-zA-Z0-9]*$/.test(className)) {
            return {
                valid: false,
                error: "Class name must start with uppercase letter, contain only letters/numbers",
            };
        }
        if (className.length < 2 || className.length > 64) {
            return { valid: false, error: "Class name must be 2-64 characters" };
        }
        return { valid: true };
    }
    /**
     * Validate Java package name
     */
    static validatePackageName(pkg) {
        if (!pkg)
            return { valid: false, error: "Package name is required" };
        if (!/^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)*$/.test(pkg)) {
            return {
                valid: false,
                error: "Invalid package format (must be lowercase.domain.name)",
            };
        }
        return { valid: true };
    }
    /**
     * Validate prompt length/content
     */
    static validatePrompt(prompt) {
        if (!prompt)
            return { valid: false, error: "Prompt is required" };
        if (prompt.length > 4000) {
            return { valid: false, error: "Prompt too long (max 4000 chars)" };
        }
        if (prompt.includes("```")) {
            return {
                valid: false,
                error: "Prompt contains markdown code blocks - use plain text",
            };
        }
        return { valid: true };
    }
    /**
     * Sanitize user input
     */
    static sanitizeInput(input) {
        return input
            .replace(/[<>\"'&]/g, "") // Remove dangerous chars
            .trim()
            .substring(0, 1000); // Limit length
    }
}
exports.Validators = Validators;
//# sourceMappingURL=validators.js.map