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
exports.ErrorHandler = void 0;
const vscode = __importStar(require("vscode"));
/**
 * Unified error handling with user-friendly dialogs and logging
 */
class ErrorHandler {
    constructor(output) {
        this.output = output;
    }
    /**
     * Handle any error with categorization and user feedback
     */
    handleError(error) {
        const err = error instanceof Error ? error : new Error(String(error));
        this.logError(err);
        const category = this.getErrorCategory(err);
        const userMessage = this.getUserMessage(err, category);
        const actions = this.getErrorActions(category);
        vscode.window
            .showErrorMessage(userMessage, ...actions)
            .then((selection) => {
            this.handleAction(selection, err);
        });
    }
    logError(error) {
        const timestamp = new Date().toLocaleTimeString();
        this.output.appendLine(`[${timestamp}] ❌ ${error.name}: ${error.message}`);
        if (error.stack) {
            this.output.appendLine(`  Stack: ${error.stack.slice(0, 500)}`);
        }
        this.output.show(true);
    }
    getErrorCategory(error) {
        if (error.message.includes("HTTP 4")) {
            return "ClientError";
        }
        if (error.message.includes("HTTP 5")) {
            return "ServerError";
        }
        if (error.name === "ValidationError") {
            return "ValidationError";
        }
        if (error.message.includes("API key")) {
            return "AuthError";
        }
        if (error.message.includes("timeout")) {
            return "TimeoutError";
        }
        return "UnknownError";
    }
    getUserMessage(error, category) {
        const messages = {
            ClientError: "Invalid request - check your input",
            ServerError: "AI service temporarily unavailable",
            ValidationError: "Invalid input - please check format",
            AuthError: "API key issue - please reconfigure",
            TimeoutError: "Request timed out - try again",
            UnknownError: "Something went wrong",
        };
        return `${messages[category] || "An error occurred"}: ${error.message.slice(0, 100)}`;
    }
    getErrorActions(category) {
        const actions = {
            AuthError: ["Set API Key", "View Logs"],
            ValidationError: ["Retry", "View Logs"],
            ClientError: ["Retry", "View Logs"],
            TimeoutError: ["Retry", "View Logs"],
        };
        return actions[category] || ["View Logs"];
    }
    handleAction(selection, _error) {
        switch (selection) {
            case "Set API Key":
                vscode.commands.executeCommand("fabric.setApiKey");
                break;
            case "Retry":
                // Trigger retry logic in calling context
                break;
            case "View Logs":
                this.output.show();
                break;
        }
    }
}
exports.ErrorHandler = ErrorHandler;
//# sourceMappingURL=error-handler.js.map