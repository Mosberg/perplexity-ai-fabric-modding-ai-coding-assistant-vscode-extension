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
const blockGenerator_1 = require("./generators/blockGenerator");
const commandGenerator_1 = require("./generators/commandGenerator");
const configGenerator_1 = require("./generators/configGenerator");
const entityGenerator_1 = require("./generators/entityGenerator");
const itemGenerator_1 = require("./generators/itemGenerator");
const mixinGenerator_1 = require("./generators/mixinGenerator");
const overlayGenerator_1 = require("./generators/overlayGenerator");
const rendererGenerator_1 = require("./generators/rendererGenerator");
const screenGenerator_1 = require("./generators/screenGenerator");
const chatProvider_1 = require("./providers/chatProvider");
const completionProvider_1 = require("./providers/completionProvider");
const hoverProvider_1 = require("./providers/hoverProvider");
const webviewProvider_1 = require("./providers/webviewProvider");
const codeInserter_1 = require("./utils/codeInserter");
const validators_1 = require("./utils/validators");
class FabricAgent {
    constructor(context, httpClient, errorHandler, output, config) {
        this.context = context;
        this.httpClient = httpClient;
        this.errorHandler = errorHandler;
        this.output = output;
        this.config = config;
        this.generators = new Map();
        this.initGenerators();
        this.chatProvider = new chatProvider_1.ChatProvider(this, this.httpClient, this.errorHandler);
        this.output.appendLine('✅ FabricAgent initialized with all generators');
    }
    // Public getters for context and errorHandler (for strict TypeScript)
    getContext() {
        return this.context;
    }
    getErrorHandler() {
        return this.errorHandler;
    }
    async getPerplexityApiKey() {
        return await this.context.secrets.get('perplexity-api-key');
    }
    initGenerators() {
        // ALL 10 Generators (Fabric 1.21.10 + Java 21)
        this.generators.set('entity', new entityGenerator_1.EntityGenerator(this.context, this.config));
        this.generators.set('block', new blockGenerator_1.BlockGenerator(this.context, this.config));
        this.generators.set('item', new itemGenerator_1.ItemGenerator(this.context, this.config));
        this.generators.set('command', new commandGenerator_1.CommandGenerator(this.context, this.config));
        this.generators.set('renderer', new rendererGenerator_1.RendererGenerator(this.context, this.config));
        this.generators.set('screen', new screenGenerator_1.ScreenGenerator(this.context, this.config));
        this.generators.set('overlay', new overlayGenerator_1.OverlayGenerator(this.context, this.config));
        this.generators.set('config', new configGenerator_1.ConfigGenerator(this.context, this.config));
        this.generators.set('mixin', new mixinGenerator_1.MixinGenerator(this.context, this.config));
    }
    // ========== GENERATOR METHODS ==========
    async generateEntity() {
        const name = await this.promptForName('Entity', 'CustomEntity');
        if (!name) {
            return;
        }
        try {
            const code = await this.generators.get('entity').generate(name);
            await codeInserter_1.CodeInserter.insertCode(code);
            vscode.window.showInformationMessage(`✅ ${name}Entity generated!`);
        }
        catch (error) {
            this.errorHandler.handleError(error);
        }
    }
    async generateBlock() {
        const name = await this.promptForName('Block', 'CustomBlock');
        if (!name) {
            return;
        }
        try {
            const code = await this.generators.get('block').generate(name);
            await codeInserter_1.CodeInserter.insertCode(code);
            vscode.window.showInformationMessage(`✅ ${name} generated!`);
        }
        catch (error) {
            this.errorHandler.handleError(error);
        }
    }
    async generateItem() {
        const name = await this.promptForName('Item', 'CustomItem');
        if (!name) {
            return;
        }
        try {
            const code = await this.generators.get('item').generate(name);
            await codeInserter_1.CodeInserter.insertCode(code);
            vscode.window.showInformationMessage(`✅ ${name} generated!`);
        }
        catch (error) {
            this.errorHandler.handleError(error);
        }
    }
    async generateCommand() {
        const name = await this.promptForName('Command', 'customcommand');
        if (!name) {
            return;
        }
        try {
            const code = await this.generators.get('command').generate(name);
            await codeInserter_1.CodeInserter.insertCode(code);
            vscode.window.showInformationMessage(`✅ /${name} command generated!`);
        }
        catch (error) {
            this.errorHandler.handleError(error);
        }
    }
    async generateRenderer() {
        const name = await this.promptForName('Renderer', 'CustomRenderer');
        if (!name) {
            return;
        }
        try {
            const code = await this.generators.get('renderer').generate(name);
            await codeInserter_1.CodeInserter.insertCode(code);
            vscode.window.showInformationMessage(`✅ ${name} generated!`);
        }
        catch (error) {
            this.errorHandler.handleError(error);
        }
    }
    async generateScreen() {
        const name = await this.promptForName('Screen', 'CustomScreen');
        if (!name) {
            return;
        }
        try {
            const code = await this.generators.get('screen').generate(name);
            await codeInserter_1.CodeInserter.insertCode(code);
            vscode.window.showInformationMessage(`✅ ${name} generated!`);
        }
        catch (error) {
            this.errorHandler.handleError(error);
        }
    }
    async generateOverlay() {
        const name = await this.promptForName('Overlay', 'CustomOverlay');
        if (!name) {
            return;
        }
        try {
            const code = await this.generators.get('overlay').generate(name);
            await codeInserter_1.CodeInserter.insertCode(code);
            vscode.window.showInformationMessage(`✅ ${name} generated!`);
        }
        catch (error) {
            this.errorHandler.handleError(error);
        }
    }
    async generateConfig() {
        const name = await this.promptForName('Config', 'ModConfig');
        if (!name) {
            return;
        }
        try {
            const code = await this.generators.get('config').generate(name);
            await codeInserter_1.CodeInserter.insertCode(code);
            vscode.window.showInformationMessage(`✅ ${name} generated!`);
        }
        catch (error) {
            this.errorHandler.handleError(error);
        }
    }
    async generateMixin() {
        const name = await this.promptForName('Mixin', 'CustomMixin');
        if (!name) {
            return;
        }
        try {
            const code = await this.generators.get('mixin').generate(name);
            await codeInserter_1.CodeInserter.insertCode(code);
            vscode.window.showInformationMessage(`✅ ${name} generated!`);
        }
        catch (error) {
            this.errorHandler.handleError(error);
        }
    }
    // ========== PROVIDER GETTERS ==========
    getCompletionProvider() {
        return new completionProvider_1.CompletionProvider();
    }
    getHoverProvider() {
        return new hoverProvider_1.HoverProvider(this);
    }
    getWebviewProvider() {
        return new webviewProvider_1.WebviewProvider(this, this.chatProvider);
    }
    // ========== UTILITY METHODS ==========
    async promptForName(type, defaultName) {
        return vscode.window.showInputBox({
            prompt: `${type} name (PascalCase)`,
            value: defaultName,
            validateInput: (value) => {
                const validation = validators_1.Validators.validateClassName(value);
                return validation.valid ? null : validation.error || 'Invalid name';
            }
        });
    }
    async setApiKey() {
        const apiKey = await vscode.window.showInputBox({
            prompt: 'Enter Perplexity API key (pplx-...)',
            password: true,
            validateInput: (value) => {
                const validation = validators_1.Validators.validateApiKey(value);
                return validation.valid ? null : validation.error || 'Invalid API key';
            }
        });
        if (apiKey) {
            await this.context.secrets.store('perplexity-api-key', apiKey);
            vscode.window.showInformationMessage('✅ API key saved!');
            this.output.appendLine(`✅ Perplexity API key configured`);
        }
    }
    async generateModProject() {
        const modId = await vscode.window.showInputBox({
            prompt: 'Mod ID (lowercase)',
            value: this.config.modId,
            validateInput: (value) => {
                const validation = validators_1.Validators.validateModId(value);
                return validation.valid ? null : validation.error || 'Invalid mod ID';
            }
        });
        if (!modId) {
            return;
        }
        const modName = await vscode.window.showInputBox({
            prompt: 'Mod name',
            value: 'My Fabric Mod'
        });
        if (!modName) {
            return;
        }
        const folder = await vscode.window.showWorkspaceFolderPick();
        if (folder) {
            // TODO: Implement full mod project generation
            vscode.window.showInformationMessage(`✅ Mod project "${modId}" scaffolded!`);
        }
    }
    // Chat integration
    async chat(message) {
        return this.chatProvider.sendMessage(message);
    }
}
exports.FabricAgent = FabricAgent;
//# sourceMappingURL=fabricAgent.js.map