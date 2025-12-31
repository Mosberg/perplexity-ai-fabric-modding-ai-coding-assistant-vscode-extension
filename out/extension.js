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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const fabricAgent_1 = require("./fabricAgent");
const http_client_1 = require("./services/http-client");
const error_handler_1 = require("./utils/error-handler");
const fabricConfig_1 = require("./utils/fabricConfig");
function activate(context) {
    console.log('🎮 Perplexity Fabric AI v2.0 ACTIVATED!');
    // Initialize core services
    const output = vscode.window.createOutputChannel('Fabric AI', { log: true });
    // const httpClient = new HttpClient();
    const httpClient = http_client_1.HttpClient.getInstance();
    const errorHandler = new error_handler_1.ErrorHandler(output);
    // Master agent with ALL dependencies
    const agent = new fabricAgent_1.FabricAgent(context, httpClient, errorHandler, output, fabricConfig_1.FabricConfigManager.getConfig());
    // Register LSP Providers
    const providers = [
        // Code Completions (Java/JSON/Gradle)
        vscode.languages.registerCompletionItemProvider(['java', 'json', 'gradle', 'properties'], agent.getCompletionProvider(), '.', '(', ','),
        // Hover Documentation
        vscode.languages.registerHoverProvider(['java', 'json', 'gradle', 'properties'], agent.getHoverProvider()),
        // Webview Sidebar
        vscode.window.registerWebviewViewProvider('fabric.agent', agent.getWebviewProvider())
    ];
    // Register ALL Commands
    const commands = [
        vscode.commands.registerCommand('fabric.setApiKey', () => agent.setApiKey()),
        vscode.commands.registerCommand('fabric.newMod', () => agent.generateModProject()),
        vscode.commands.registerCommand('fabric.generateEntity', () => agent.generateEntity()),
        vscode.commands.registerCommand('fabric.generateBlock', () => agent.generateBlock()),
        vscode.commands.registerCommand('fabric.generateItem', () => agent.generateItem()),
        vscode.commands.registerCommand('fabric.generateCommand', () => agent.generateCommand()),
        vscode.commands.registerCommand('fabric.generateRenderer', () => agent.generateRenderer()),
        vscode.commands.registerCommand('fabric.generateScreen', () => agent.generateScreen()),
        vscode.commands.registerCommand('fabric.generateOverlay', () => agent.generateOverlay()),
        vscode.commands.registerCommand('fabric.generateConfig', () => agent.generateConfig()),
        vscode.commands.registerCommand('fabric.generateMixin', () => agent.generateMixin()),
        vscode.commands.registerCommand('fabric.showLogs', () => output.show())
    ];
    // Add to context
    context.subscriptions.push(...providers, ...commands);
    // Welcome message
    vscode.window.showInformationMessage('🤖 Fabric AI Ready! Open sidebar or Ctrl+Shift+P → "Fabric AI: Generate Entity"');
    output.appendLine('✅ All providers registered');
    output.appendLine('✅ 12 commands registered');
    output.appendLine('✅ Ready for Fabric modding!');
}
function deactivate() {
    console.log('🛑 Fabric AI deactivated');
}
//# sourceMappingURL=extension.js.map