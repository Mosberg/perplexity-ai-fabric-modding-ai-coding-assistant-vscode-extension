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
const completionProvider_1 = require("./providers/completionProvider");
const hoverProvider_1 = require("./providers/hoverProvider");
// ... all other generators
const codeInserter_1 = require("./utils/codeInserter");
const error_handler_1 = require("./utils/error-handler");
const fabricConfig_1 = require("./utils/fabricConfig");
const templateManager_1 = require("./utils/templateManager");
const validators_1 = require("./utils/validators");
class FabricAgent {
    constructor(context, outputChannel) {
        this.context = context;
        this.generators = new Map();
        this.config = fabricConfig_1.FabricConfigManager.getConfig();
        this.outputChannel = outputChannel;
        this.initGenerators();
    }
    async setApiKey() {
        const apiKey = await vscode.window.showInputBox({
            prompt: "Enter your Perplexity API key (starts with pplx-)",
            password: true,
        });
        if (!apiKey)
            return;
        const validation = validators_1.Validators.validateApiKey(apiKey);
        if (!validation.valid) {
            vscode.window.showErrorMessage(validation.error || "Invalid API key");
            return;
        }
        await this.context.secrets.store("perplexityApiKey", apiKey);
        vscode.window.showInformationMessage("✅ API key saved.");
    }
    async generateItem() {
        try {
            const name = await vscode.window.showInputBox({
                prompt: "Item name (PascalCase)",
                value: "CustomItem",
            });
            if (!name)
                return;
            const validation = validators_1.Validators.validateClassName(name);
            if (!validation.valid)
                throw new Error(validation.error);
            const code = await this.generators.get("item").generate(name);
            await codeInserter_1.CodeInserter.insertCode(code);
        }
        catch (error) {
            new error_handler_1.ErrorHandler(this.outputChannel).handleError(error);
        }
    }
    async generateCommand() {
        try {
            const name = await vscode.window.showInputBox({
                prompt: "Command name (PascalCase)",
                value: "CustomCommand",
            });
            if (!name)
                return;
            const validation = validators_1.Validators.validateClassName(name);
            if (!validation.valid)
                throw new Error(validation.error);
            const code = await this.generators.get("command").generate(name);
            await codeInserter_1.CodeInserter.insertCode(code);
        }
        catch (error) {
            new error_handler_1.ErrorHandler(this.outputChannel).handleError(error);
        }
    }
    async generateRenderer() {
        try {
            const name = await vscode.window.showInputBox({
                prompt: "Renderer name (PascalCase)",
                value: "CustomRenderer",
            });
            if (!name)
                return;
            const validation = validators_1.Validators.validateClassName(name);
            if (!validation.valid)
                throw new Error(validation.error);
            const code = await this.generators.get("renderer").generate(name);
            await codeInserter_1.CodeInserter.insertCode(code);
        }
        catch (error) {
            new error_handler_1.ErrorHandler(this.outputChannel).handleError(error);
        }
    }
    async generateScreen() {
        try {
            const name = await vscode.window.showInputBox({
                prompt: "Screen name (PascalCase)",
                value: "CustomScreen",
            });
            if (!name)
                return;
            const validation = validators_1.Validators.validateClassName(name);
            if (!validation.valid)
                throw new Error(validation.error);
            const code = await this.generators.get("screen").generate(name);
            await codeInserter_1.CodeInserter.insertCode(code);
        }
        catch (error) {
            new error_handler_1.ErrorHandler(this.outputChannel).handleError(error);
        }
    }
    async generateOverlay() {
        try {
            const name = await vscode.window.showInputBox({
                prompt: "Overlay name (PascalCase)",
                value: "CustomOverlay",
            });
            if (!name)
                return;
            const validation = validators_1.Validators.validateClassName(name);
            if (!validation.valid)
                throw new Error(validation.error);
            const code = await this.generators.get("overlay").generate(name);
            await codeInserter_1.CodeInserter.insertCode(code);
        }
        catch (error) {
            new error_handler_1.ErrorHandler(this.outputChannel).handleError(error);
        }
    }
    async generateConfig() {
        try {
            const name = await vscode.window.showInputBox({
                prompt: "Config name (PascalCase)",
                value: "ModConfig",
            });
            if (!name)
                return;
            const validation = validators_1.Validators.validateClassName(name);
            if (!validation.valid)
                throw new Error(validation.error);
            const code = await this.generators.get("config").generate(name);
            await codeInserter_1.CodeInserter.insertCode(code);
        }
        catch (error) {
            new error_handler_1.ErrorHandler(this.outputChannel).handleError(error);
        }
    }
    async generateMixin() {
        try {
            const name = await vscode.window.showInputBox({
                prompt: "Mixin name (PascalCase)",
                value: "CustomMixin",
            });
            if (!name)
                return;
            const validation = validators_1.Validators.validateClassName(name);
            if (!validation.valid)
                throw new Error(validation.error);
            const code = await this.generators.get("mixin").generate(name);
            await codeInserter_1.CodeInserter.insertCode(code);
        }
        catch (error) {
            new error_handler_1.ErrorHandler(this.outputChannel).handleError(error);
        }
    }
    initGenerators() {
        this.generators.set("base", new (require("./generators/baseGenerator").BaseGenerator)(this.context));
        this.generators.set("entity", new (require("./generators/entityGenerator").EntityGenerator)(this.context));
        this.generators.set("block", new (require("./generators/blockGenerator").BlockGenerator)(this.context));
        this.generators.set("item", new (require("./generators/itemGenerator").ItemGenerator)(this.context));
        this.generators.set("command", new (require("./generators/commandGenerator").CommandGenerator)(this.context));
        this.generators.set("renderer", new (require("./generators/rendererGenerator").RendererGenerator)(this.context));
        this.generators.set("screen", new (require("./generators/screenGenerator").ScreenGenerator)(this.context));
        this.generators.set("overlay", new (require("./generators/overlayGenerator").OverlayGenerator)(this.context));
        this.generators.set("config", new (require("./generators/configGenerator").ConfigGenerator)(this.context));
        this.generators.set("mixin", new (require("./generators/mixinGenerator").MixinGenerator)(this.context));
    }
    // ALL Generator Methods
    async generateEntity() {
        try {
            const name = await vscode.window.showInputBox({
                prompt: "Entity name (PascalCase)",
                value: "CustomEntity",
            });
            if (!name)
                return;
            const validation = validators_1.Validators.validateClassName(name);
            if (!validation.valid)
                throw new Error(validation.error);
            const code = await this.generators.get("entity").generate(name);
            await codeInserter_1.CodeInserter.insertCode(code);
        }
        catch (error) {
            new error_handler_1.ErrorHandler(this.outputChannel).handleError(error);
        }
    }
    async generateBlock() {
        try {
            const name = await vscode.window.showInputBox({
                prompt: "Block name (PascalCase)",
                value: "CustomBlock",
            });
            if (!name)
                return;
            const validation = validators_1.Validators.validateClassName(name);
            if (!validation.valid)
                throw new Error(validation.error);
            const code = await this.generators.get("block").generate(name);
            await codeInserter_1.CodeInserter.insertCode(code);
        }
        catch (error) {
            new error_handler_1.ErrorHandler(this.outputChannel).handleError(error);
        }
    }
    // ... all other generate*() methods
    async generateModProject() {
        try {
            const modId = await vscode.window.showInputBox({
                prompt: "Mod ID (lowercase)",
                value: this.config.modId,
            });
            if (!modId)
                return;
            const modIdValidation = validators_1.Validators.validateModId(modId);
            if (!modIdValidation.valid)
                throw new Error(modIdValidation.error);
            const modName = await vscode.window.showInputBox({
                prompt: "Mod name",
                value: "My Fabric Mod",
            });
            if (!modName)
                return;
            const folder = await vscode.window.showWorkspaceFolderPick();
            if (folder) {
                await templateManager_1.TemplateManager.createModProject(folder.uri, modId, modName);
                vscode.window.showInformationMessage(`✅ Mod project created: ${modId}`);
            }
        }
        catch (error) {
            new error_handler_1.ErrorHandler(this.outputChannel).handleError(error);
        }
    }
    // Provider getters
    getWebviewProvider() {
        const ChatProvider = require("./providers/chatProvider").ChatProvider;
        const WebviewProvider = require("./providers/webviewProvider").WebviewProvider;
        const HttpClient = require("./services/http-client").HttpClient;
        const ErrorHandler = require("./utils/error-handler").ErrorHandler;
        const httpClient = HttpClient.getInstance();
        const errorHandler = new ErrorHandler({
            appendLine: () => { },
            show: () => { },
        }); // Replace with real output channel if available
        const chatProvider = new ChatProvider(this, httpClient, errorHandler);
        return new WebviewProvider(this, chatProvider);
    }
    getCompletionProvider() {
        return new completionProvider_1.CompletionProvider();
    }
    getHoverProvider() {
        return new hoverProvider_1.HoverProvider(this);
    }
    // Copilot features (merged from perplexity-ai-copilot)
    async openCopilotChat() {
        // Open the chat webview (sidebar)
        await vscode.commands.executeCommand("workbench.view.extension.fabric.agent");
    }
    async explainCode() {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage("No active editor");
            return;
        }
        const code = editor.document.getText(editor.selection) || editor.document.getText();
        const chatProvider = require("./providers/chatProvider").ChatProvider;
        const httpClient = require("./services/http-client").HttpClient.getInstance();
        const errorHandler = require("./utils/error-handler").ErrorHandler;
        const chat = new chatProvider(this, httpClient, errorHandler);
        const explanation = await chat.sendMessage(`Explain this code:\n\n\`\`\`\n${code}\n\`\`\``);
        vscode.window.showInformationMessage(explanation);
    }
    async generateCode() {
        const prompt = await vscode.window.showInputBox({
            prompt: "Describe the code you want to generate",
        });
        if (!prompt)
            return;
        const chatProvider = require("./providers/chatProvider").ChatProvider;
        const httpClient = require("./services/http-client").HttpClient.getInstance();
        const errorHandler = require("./utils/error-handler").ErrorHandler;
        const chat = new chatProvider(this, httpClient, errorHandler);
        const code = await chat.sendMessage(`Generate code: ${prompt}`);
        await codeInserter_1.CodeInserter.insertCode(code);
    }
}
exports.FabricAgent = FabricAgent;
//# sourceMappingURL=fabricAgent.js.map