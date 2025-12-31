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
class ErrorHandler {
    constructor(output) {
        this.output = output;
    }
    handleError(error) {
        const err = error instanceof Error ? error : new Error(String(error));
        // Log to output channel
        this.logError(err);
        // Categorize and show user-friendly message
        const category = this.categorizeError(err);
        const userMessage = this.getUserMessage(err, category);
        const actions = this.getQuickFixActions(category);
        vscode.window.showErrorMessage(userMessage, ...actions).then(action => {
            this.handleQuickFix(action, err);
        });
    }
    logError(error) {
        const timestamp = new Date().toISOString();
        this.output.appendLine(`[${timestamp}] ❌ ${error.name}: ${error.message}`);
        if (error.stack) {
            this.output.appendLine(`   Stack: ${error.stack.slice(0, 500)}...`);
        }
        this.output.show(true);
    }
    categorizeError(error) {
        const msg = error.message.toLowerCase();
        if (msg.includes('http 4')) {
            return 'ClientError';
        }
        if (msg.includes('http 5')) {
            return 'ServerError';
        }
        if (msg.includes('api key') || msg.includes('pplx-')) {
            return 'AuthError';
        }
        if (msg.includes('timeout') || msg.includes('abort')) {
            return 'TimeoutError';
        }
        if (msg.includes('validation')) {
            return 'ValidationError';
        }
        return 'UnknownError';
    }
    getUserMessage(error, category) {
        const messages = {
            'ClientError': 'Invalid request - check your input and try again',
            'ServerError': 'AI service temporarily unavailable - retrying...',
            'AuthError': 'API key issue - configure Perplexity API key',
            'TimeoutError': 'Request timed out - network slow, try again',
            'ValidationError': 'Invalid input format - check naming conventions',
            'UnknownError': 'Unexpected error occurred'
        };
        const baseMsg = messages[category] || 'Something went wrong';
        return `${baseMsg}: ${error.message.slice(0, 100)}${error.message.length > 100 ? '...' : ''}`;
    }
    getQuickFixActions(category) {
        const actions = {
            'AuthError': ['🔑 Set API Key', '📋 View Logs'],
            'ValidationError': ['🔄 Retry', '📋 View Logs'],
            'ClientError': ['🔄 Retry', '📋 View Logs'],
            'TimeoutError': ['🔄 Retry', '📋 View Logs'],
            'ServerError': ['⏳ Retry Later', '📋 View Logs']
        };
        return actions[category] || ['📋 View Logs'];
    }
    async handleQuickFix(action, _error) {
        switch (action) {
            case '🔑 Set API Key':
                await vscode.commands.executeCommand('fabric.setApiKey');
                break;
            case '🔄 Retry':
                // Caller handles retry logic
                vscode.window.showInformationMessage('Please try the command again');
                break;
            case '📋 View Logs':
                this.output.show();
                break;
            case '⏳ Retry Later':
                vscode.window.showInformationMessage('Try again in a few minutes');
                break;
        }
    }
    // Type-safe error creation
    static validationError(message) {
        const error = new Error(message);
        error.name = 'ValidationError';
        return error;
    }
    static httpError(status, message) {
        const error = new Error(message);
        error.name = `HttpError_${status}`;
        return error;
    }
}
exports.ErrorHandler = ErrorHandler;
//# sourceMappingURL=error-handler.js.map