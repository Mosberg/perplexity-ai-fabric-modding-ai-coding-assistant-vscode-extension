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
const validators_1 = require("./utils/validators");
/**
 * Main extension activation function
 * Initializes all services, providers, and commands
 */
async function activate(context) {
    const outputChannel = vscode.window.createOutputChannel("Fabric AI");
    const errorHandler = new error_handler_1.ErrorHandler(outputChannel);
    const httpClient = http_client_1.HttpClient.getInstance();
    // Global error handler
    process.on("uncaughtException", (error) => errorHandler.handleError(error));
    process.on("unhandledRejection", (reason) => errorHandler.handleError(reason));
    outputChannel.appendLine("[Fabric AI] Initializing...");
    try {
        // Validate API key on startup
        const apiKey = await context.secrets.get("perplexityApiKey");
        if (!apiKey || !validators_1.Validators.validateApiKey(apiKey).valid) {
            vscode.window.showWarningMessage("Fabric AI: Set your Perplexity API key (Ctrl+Shift+P → Fabric AI: Set API Keys)");
        }
        // Initialize core agent
        const agent = new fabricAgent_1.FabricAgent(context, httpClient, errorHandler, outputChannel);
        // Register all providers
        registerProviders(context, agent, outputChannel);
        // Register all commands
        registerCommands(context, agent, errorHandler, outputChannel);
        // Register status bar
        registerStatusBar(context);
        // Show welcome message
        await showWelcomeMessage(context);
        outputChannel.appendLine("[Fabric AI] ✅ Activated successfully!");
        // Store references for deactivation
        context.subscriptions.push({
            dispose: () => {
                httpClient.dispose();
                outputChannel.appendLine("[Fabric AI] Disposed");
            },
        });
    }
    catch (error) {
        errorHandler.handleError(error);
        outputChannel.appendLine(`[Fabric AI] ❌ Activation failed: ${error}`);
    }
}
/**
 * Register language providers (completions, hovers, code actions)
 */
function registerProviders(context, agent, outputChannel) {
    outputChannel.appendLine("[Fabric AI] Registering providers...");
    // Code completions for Java, JSON, Gradle
    const completionLanguages = ["java", "json", "gradle", "groovy"];
    for (const lang of completionLanguages) {
        context.subscriptions.push(vscode.languages.registerCompletionItemProvider({ language: lang, scheme: "file" }, agent.getCompletionProvider(), ".", ",", "("));
    }
    // Hovers for Java
    context.subscriptions.push(vscode.languages.registerHoverProvider({ language: "java", scheme: "file" }, agent.getHoverProvider()));
    // Webview sidebar
    context.subscriptions.push(vscode.window.registerWebviewViewProvider("fabric.agent", agent.getWebviewProvider()));
    outputChannel.appendLine("[Fabric AI] ✅ Providers registered");
}
/**
 * Register all Fabric AI commands
 */
function registerCommands(context, agent, errorHandler, outputChannel) {
    outputChannel.appendLine("[Fabric AI] Registering commands...");
    const commands = [
        { id: "fabric.setApiKey", handler: () => agent.setApiKeys() },
        { id: "fabric.newMod", handler: () => agent.generateModStructure() },
        { id: "fabric.generateEntity", handler: () => agent.generateEntity() },
        { id: "fabric.generateBlock", handler: () => agent.generateBlock() },
        { id: "fabric.generateItem", handler: () => agent.generateItem() },
        { id: "fabric.generateCommand", handler: () => agent.generateCommand() },
        { id: "fabric.generateRenderer", handler: () => agent.generateRenderer() },
        { id: "fabric.generateScreen", handler: () => agent.generateScreen() },
        { id: "fabric.generateOverlay", handler: () => agent.generateOverlay() },
        { id: "fabric.generateConfig", handler: () => agent.generateConfig() },
        { id: "fabric.generateMixin", handler: () => agent.generateMixin() },
        { id: "fabric.chatWithAI", handler: () => agent.openChat() },
        { id: "fabric.showLogs", handler: () => outputChannel.show() },
    ];
    for (const cmd of commands) {
        context.subscriptions.push(vscode.commands.registerCommand(cmd.id, async () => {
            try {
                await cmd.handler();
            }
            catch (error) {
                errorHandler.handleError(error);
            }
        }));
    }
    outputChannel.appendLine(`[Fabric AI] ✅ ${commands.length} commands registered`);
}
/**
 * Register status bar item
 */
function registerStatusBar(context) {
    const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBar.command = "fabric.chatWithAI";
    statusBar.text = "🤖 Fabric AI";
    statusBar.tooltip = "Fabric Modding AI Assistant";
    statusBar.show();
    context.subscriptions.push(statusBar);
}
/**
 * Show welcome message on first activation
 */
async function showWelcomeMessage(context) {
    const hasShown = context.globalState.get("fabricAI.welcomeShown", false);
    if (hasShown) {
        return;
    }
    const selection = await vscode.window.showInformationMessage("🎉 Welcome to Fabric Modding AI!", "Set API Key", "Don't Show Again");
    if (selection === "Set API Key") {
        vscode.commands.executeCommand("fabric.setApiKey");
    }
    else if (selection === "Don't Show Again") {
        await context.globalState.update("fabricAI.welcomeShown", true);
    }
}
/**
 * Extension deactivation - cleanup resources
 */
function deactivate() {
    // Global cleanup will be handled by FabricAgent dispose
    console.log("[Fabric AI] Extension deactivated");
}
//# sourceMappingURL=extension.js.map