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
exports.FabricAgent = void 0;
const vscode = __importStar(require("vscode"));
const chatProvider_1 = require("./providers/chatProvider");
const completionProvider_1 = require("./providers/completionProvider");
const hoverProvider_1 = require("./providers/hoverProvider");
const webviewProvider_1 = require("./providers/webviewProvider");
const validators_1 = require("./utils/validators");
/**
 * Central Fabric AI Agent orchestrating all generators, chat, and API calls
 */
class FabricAgent {
    generateItem() {
        throw new Error("Method not implemented.");
    }
    generateCommand() {
        throw new Error("Method not implemented.");
    }
    generateRenderer() {
        throw new Error("Method not implemented.");
    }
    generateScreen() {
        throw new Error("Method not implemented.");
    }
    generateOverlay() {
        throw new Error("Method not implemented.");
    }
    generateConfig() {
        throw new Error("Method not implemented.");
    }
    generateMixin() {
        throw new Error("Method not implemented.");
    }
    constructor(context, httpClient, errorHandler, outputChannel) {
        this.context = context;
        this.generators = new Map();
        this.httpClient = httpClient;
        this.outputChannel = outputChannel;
        this.chatProvider = new chatProvider_1.ChatProvider(this, httpClient, errorHandler);
        this.initGenerators();
    }
    /**
     * Initialize all code generators
     */
    initGenerators() {
        // Only register actual generator implementations here.
        // Example: this.generators.set('entity', new EntityGenerator(this.context));
        // For now, leave empty or throw for unimplemented types.
        this.outputChannel.appendLine(`[Fabric AI] Initialized ${this.generators.size} generators`);
    }
    /**
     * Generate code for specific type
     */
    async generateCode(type, name) {
        const generator = this.generators.get(type);
        if (!generator) {
            throw new Error(`No generator found for type: ${type}`);
        }
        if (!validators_1.Validators.validateClassName(name).valid) {
            throw new Error(`Invalid class name: ${name}`);
        }
        return await generator.generate(name);
    }
    /**
     * AI chat completion
     */
    async chatCompletion(prompt) {
        const apiKey = await this.getApiKey();
        if (!validators_1.Validators.validateApiKey(apiKey).valid) {
            throw new Error("Invalid Perplexity API key");
        }
        const response = await this.httpClient.request("https://api.perplexity.ai/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "llama-3.1-sonar-small-128k-online",
                messages: [
                    {
                        role: "system",
                        content: "You are an expert Minecraft Fabric modding assistant. Generate clean Java code.",
                    },
                    { role: "user", content: prompt },
                ],
                temperature: 0.1,
                stream: false,
            }),
        });
        return response.choices[0]?.message.content ?? "";
    }
    /**
     * Get API key from secrets or config
     */
    async getApiKey() {
        // Check workspace config first
        const config = vscode.workspace.getConfiguration("fabric");
        const configKey = config.get("perplexityApiKey");
        if (configKey) {
            return configKey;
        }
        // Check secrets storage
        const secretKey = await this.context.secrets.get("perplexityApiKey");
        return secretKey ?? "";
    }
    /**
     * Set API keys securely
     */
    async setApiKeys() {
        const apiKey = await vscode.window.showInputBox({
            prompt: "Enter Perplexity API Key (pplx-...)",
            password: true,
            validateInput: (value) => {
                return validators_1.Validators.validateApiKey(value).valid
                    ? null
                    : "API key must start with pplx-";
            },
        });
        if (apiKey) {
            await this.context.secrets.store("perplexityApiKey", apiKey);
            vscode.window.showInformationMessage("✅ Perplexity API key saved securely!");
            this.outputChannel.appendLine("[Fabric AI] API key configured");
        }
    }
    /**
     * Generate complete mod structure
     */
    async generateModStructure() {
        const modId = await vscode.window.showInputBox({
            prompt: "Mod ID (lowercase, no spaces)",
            value: "mymod",
            validateInput: (value) => validators_1.Validators.validateModId(value).valid ? null : "Invalid mod ID",
        });
        if (!modId) {
            return;
        }
        // Implementation would use template manager + code inserter
        vscode.window.showInformationMessage(`🚀 Fabric mod "${modId}" structure generated!`);
    }
    // Generator shortcut methods
    async generateEntity() {
        const name = await this.promptForName("Entity name (e.g. CustomZombie)");
        if (name) {
            const code = await this.generateCode("entity", name);
            this.insertCode(code);
        }
    }
    async generateBlock() {
        const name = await this.promptForName("Block name (e.g. CustomOre)");
        if (name) {
            const code = await this.generateCode("block", name);
            this.insertCode(code);
        }
    }
    // ... other generator methods follow same pattern
    /**
     * Insert generated code
     */
    async insertCode(code) {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            await editor.edit((builder) => {
                builder.insert(editor.selection.active, code);
            });
            await vscode.commands.executeCommand("editor.action.formatDocument");
        }
        else {
            const doc = await vscode.workspace.openTextDocument({
                content: code,
                language: "java",
            });
            await vscode.window.showTextDocument(doc);
        }
    }
    /**
     * Prompt for class/item name with validation
     */
    async promptForName(placeHolder) {
        return await vscode.window.showInputBox({
            placeHolder,
            validateInput: (value) => validators_1.Validators.validateClassName(value).valid ? null : "Invalid name",
        });
    }
    /**
     * Open chat webview
     */
    async openChat() {
        await vscode.commands.executeCommand("workbench.view.extension.fabric-ai");
    }
    /**
     * Get completion provider (for language server)
     */
    getCompletionProvider() {
        return new completionProvider_1.CompletionProvider();
    }
    getHoverProvider() {
        return new hoverProvider_1.HoverProvider(this);
    }
    getWebviewProvider() {
        return new webviewProvider_1.WebviewProvider(this, this.chatProvider);
    }
    /**
     * Cleanup resources
     */
    dispose() {
        this.httpClient.dispose();
        this.generators.clear();
    }
}
exports.FabricAgent = FabricAgent;
//# sourceMappingURL=fabricAgent.js.map