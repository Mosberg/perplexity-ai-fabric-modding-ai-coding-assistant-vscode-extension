"use strict";
/**
 * Enhanced types with error handling and validation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigError = exports.HttpError = exports.ValidationError = void 0;
/**
 * Custom error classes
 */
class ValidationError extends Error {
    constructor(validation) {
        super(validation.error || "Validation failed");
        this.validation = validation;
        this.name = "ValidationError";
    }
}
exports.ValidationError = ValidationError;
class HttpError extends Error {
    constructor(status, response) {
        super(`HTTP ${status}: ${response?.slice(0, 100)}`);
        this.status = status;
        this.response = response;
        this.name = "HttpError";
    }
}
exports.HttpError = HttpError;
class ConfigError extends Error {
    constructor(message) {
        super(message);
        this.name = "ConfigError";
    }
}
exports.ConfigError = ConfigError;
//# sourceMappingURL=improved-types.js.map