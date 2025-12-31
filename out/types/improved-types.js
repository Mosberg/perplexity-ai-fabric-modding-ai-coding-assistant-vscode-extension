"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = exports.ConfigError = exports.HttpError = exports.ValidationError = void 0;
/**
 * Custom error classes (extendable)
 */
class ValidationError extends Error {
    constructor(message, validation) {
        super(message);
        this.name = 'ValidationError';
        this.validation = validation;
    }
}
exports.ValidationError = ValidationError;
class HttpError extends Error {
    constructor(status, message, response) {
        super(`HTTP ${status}: ${message}`);
        this.name = `HttpError_${status}`;
        this.status = status;
        this.response = response;
    }
}
exports.HttpError = HttpError;
class ConfigError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ConfigError';
    }
}
exports.ConfigError = ConfigError;
class ApiError extends Error {
    constructor(code, message) {
        super(message);
        this.name = 'ApiError';
        this.code = code;
    }
}
exports.ApiError = ApiError;
//# sourceMappingURL=improved-types.js.map