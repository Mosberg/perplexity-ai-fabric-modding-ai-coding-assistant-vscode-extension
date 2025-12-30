import * as vscode from "vscode";
import { CompletionProvider } from "./providers/completionProvider";
import { HoverProvider } from "./providers/hoverProvider";
// ... all other generators
import { CodeInserter } from "./utils/codeInserter";
import { ErrorHandler } from "./utils/error-handler";
import { FabricConfigManager } from "./utils/fabricConfig";
import { TemplateManager } from "./utils/templateManager";
import { Validators } from "./utils/validators";

export class FabricAgent {
  private outputChannel: vscode.OutputChannel;

  constructor(
    private context: vscode.ExtensionContext,
    outputChannel: vscode.OutputChannel
  ) {
    this.outputChannel = outputChannel;
    this.initGenerators();
  }

  async setApiKey() {
    const apiKey = await vscode.window.showInputBox({
      prompt: "Enter your Perplexity API key (starts with pplx-)",
      password: true,
    });
    if (!apiKey) return;
    const validation = Validators.validateApiKey(apiKey);
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
      if (!name) return;
      const validation = Validators.validateClassName(name);
      if (!validation.valid) throw new Error(validation.error);
      const code = await this.generators.get("item")!.generate(name);
      await CodeInserter.insertCode(code);
    } catch (error) {
      new ErrorHandler(this.outputChannel).handleError(error);
    }
  }

  async generateCommand() {
    try {
      const name = await vscode.window.showInputBox({
        prompt: "Command name (PascalCase)",
        value: "CustomCommand",
      });
      if (!name) return;
      const validation = Validators.validateClassName(name);
      if (!validation.valid) throw new Error(validation.error);
      const code = await this.generators.get("command")!.generate(name);
      await CodeInserter.insertCode(code);
    } catch (error) {
      new ErrorHandler(this.outputChannel).handleError(error);
    }
  }

  async generateRenderer() {
    try {
      const name = await vscode.window.showInputBox({
        prompt: "Renderer name (PascalCase)",
        value: "CustomRenderer",
      });
      if (!name) return;
      const validation = Validators.validateClassName(name);
      if (!validation.valid) throw new Error(validation.error);
      const code = await this.generators.get("renderer")!.generate(name);
      await CodeInserter.insertCode(code);
    } catch (error) {
      new ErrorHandler(this.outputChannel).handleError(error);
    }
  }

  async generateScreen() {
    try {
      const name = await vscode.window.showInputBox({
        prompt: "Screen name (PascalCase)",
        value: "CustomScreen",
      });
      if (!name) return;
      const validation = Validators.validateClassName(name);
      if (!validation.valid) throw new Error(validation.error);
      const code = await this.generators.get("screen")!.generate(name);
      await CodeInserter.insertCode(code);
    } catch (error) {
      new ErrorHandler(this.outputChannel).handleError(error);
    }
  }

  async generateOverlay() {
    try {
      const name = await vscode.window.showInputBox({
        prompt: "Overlay name (PascalCase)",
        value: "CustomOverlay",
      });
      if (!name) return;
      const validation = Validators.validateClassName(name);
      if (!validation.valid) throw new Error(validation.error);
      const code = await this.generators.get("overlay")!.generate(name);
      await CodeInserter.insertCode(code);
    } catch (error) {
      new ErrorHandler(this.outputChannel).handleError(error);
    }
  }

  async generateConfig() {
    try {
      const name = await vscode.window.showInputBox({
        prompt: "Config name (PascalCase)",
        value: "ModConfig",
      });
      if (!name) return;
      const validation = Validators.validateClassName(name);
      if (!validation.valid) throw new Error(validation.error);
      const code = await this.generators.get("config")!.generate(name);
      await CodeInserter.insertCode(code);
    } catch (error) {
      new ErrorHandler(this.outputChannel).handleError(error);
    }
  }

  async generateMixin() {
    try {
      const name = await vscode.window.showInputBox({
        prompt: "Mixin name (PascalCase)",
        value: "CustomMixin",
      });
      if (!name) return;
      const validation = Validators.validateClassName(name);
      if (!validation.valid) throw new Error(validation.error);
      const code = await this.generators.get("mixin")!.generate(name);
      await CodeInserter.insertCode(code);
    } catch (error) {
      new ErrorHandler(this.outputChannel).handleError(error);
    }
  }
  private generators: Map<string, any> = new Map();
  private config = FabricConfigManager.getConfig();

  private initGenerators() {
    this.generators.set(
      "base",
      new (require("./generators/baseGenerator").BaseGenerator)(this.context)
    );
    this.generators.set(
      "entity",
      new (require("./generators/entityGenerator").EntityGenerator)(
        this.context
      )
    );
    this.generators.set(
      "block",
      new (require("./generators/blockGenerator").BlockGenerator)(this.context)
    );
    this.generators.set(
      "item",
      new (require("./generators/itemGenerator").ItemGenerator)(this.context)
    );
    this.generators.set(
      "command",
      new (require("./generators/commandGenerator").CommandGenerator)(
        this.context
      )
    );
    this.generators.set(
      "renderer",
      new (require("./generators/rendererGenerator").RendererGenerator)(
        this.context
      )
    );
    this.generators.set(
      "screen",
      new (require("./generators/screenGenerator").ScreenGenerator)(
        this.context
      )
    );
    this.generators.set(
      "overlay",
      new (require("./generators/overlayGenerator").OverlayGenerator)(
        this.context
      )
    );
    this.generators.set(
      "config",
      new (require("./generators/configGenerator").ConfigGenerator)(
        this.context
      )
    );
    this.generators.set(
      "mixin",
      new (require("./generators/mixinGenerator").MixinGenerator)(this.context)
    );
  }

  // ALL Generator Methods
  async generateEntity() {
    try {
      const name = await vscode.window.showInputBox({
        prompt: "Entity name (PascalCase)",
        value: "CustomEntity",
      });
      if (!name) return;
      const validation = Validators.validateClassName(name);
      if (!validation.valid) throw new Error(validation.error);
      const code = await this.generators.get("entity")!.generate(name);
      await CodeInserter.insertCode(code);
    } catch (error) {
      new ErrorHandler(this.outputChannel).handleError(error);
    }
  }

  async generateBlock() {
    try {
      const name = await vscode.window.showInputBox({
        prompt: "Block name (PascalCase)",
        value: "CustomBlock",
      });
      if (!name) return;
      const validation = Validators.validateClassName(name);
      if (!validation.valid) throw new Error(validation.error);
      const code = await this.generators.get("block")!.generate(name);
      await CodeInserter.insertCode(code);
    } catch (error) {
      new ErrorHandler(this.outputChannel).handleError(error);
    }
  }

  // ... all other generate*() methods

  async generateModProject() {
    try {
      const modId = await vscode.window.showInputBox({
        prompt: "Mod ID (lowercase)",
        value: this.config.modId,
      });
      if (!modId) return;
      const modIdValidation = Validators.validateModId(modId);
      if (!modIdValidation.valid) throw new Error(modIdValidation.error);
      const modName = await vscode.window.showInputBox({
        prompt: "Mod name",
        value: "My Fabric Mod",
      });
      if (!modName) return;
      const folder = await vscode.window.showWorkspaceFolderPick();
      if (folder) {
        await TemplateManager.createModProject(folder.uri, modId, modName);
        vscode.window.showInformationMessage(
          `✅ Mod project created: ${modId}`
        );
      }
    } catch (error) {
      new ErrorHandler(this.outputChannel).handleError(error);
    }
  }

  // Provider getters
  getWebviewProvider() {
    const ChatProvider = require("./providers/chatProvider").ChatProvider;
    const WebviewProvider =
      require("./providers/webviewProvider").WebviewProvider;
    const HttpClient = require("./services/http-client").HttpClient;
    const ErrorHandler = require("./utils/error-handler").ErrorHandler;
    const httpClient = HttpClient.getInstance();
    const errorHandler = new ErrorHandler({
      appendLine: () => {},
      show: () => {},
    }); // Replace with real output channel if available
    const chatProvider = new ChatProvider(this, httpClient, errorHandler);
    return new WebviewProvider(this, chatProvider);
  }
  getCompletionProvider() {
    return new CompletionProvider();
  }
  getHoverProvider() {
    return new HoverProvider(this);
  }

  // Copilot features (merged from perplexity-ai-copilot)
  async openCopilotChat() {
    // Open the chat webview (sidebar)
    await vscode.commands.executeCommand(
      "workbench.view.extension.fabric.agent"
    );
  }

  async explainCode() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage("No active editor");
      return;
    }
    const code =
      editor.document.getText(editor.selection) || editor.document.getText();
    const chatProvider = require("./providers/chatProvider").ChatProvider;
    const httpClient =
      require("./services/http-client").HttpClient.getInstance();
    const errorHandler = require("./utils/error-handler").ErrorHandler;
    const chat = new chatProvider(this, httpClient, errorHandler);
    const explanation = await chat.sendMessage(
      `Explain this code:\n\n\`\`\`\n${code}\n\`\`\``
    );
    vscode.window.showInformationMessage(explanation);
  }

  async generateCode() {
    const prompt = await vscode.window.showInputBox({
      prompt: "Describe the code you want to generate",
    });
    if (!prompt) return;
    const chatProvider = require("./providers/chatProvider").ChatProvider;
    const httpClient =
      require("./services/http-client").HttpClient.getInstance();
    const errorHandler = require("./utils/error-handler").ErrorHandler;
    const chat = new chatProvider(this, httpClient, errorHandler);
    const code = await chat.sendMessage(`Generate code: ${prompt}`);
    await CodeInserter.insertCode(code);
  }
}
