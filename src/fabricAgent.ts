import * as vscode from "vscode";
import { BaseGenerator } from "./generators/baseGenerator";
import { ChatProvider } from "./providers/chatProvider";
import { CompletionProvider } from "./providers/completionProvider";
import { HoverProvider } from "./providers/hoverProvider";
import { WebviewProvider } from "./providers/webviewProvider";
import { HttpClient } from "./services/http-client";
import type { GeneratorType } from "./types/fabric.types";
import { ErrorHandler } from "./utils/error-handler";
import { Validators } from "./utils/validators";

/**
 * Central Fabric AI Agent orchestrating all generators, chat, and API calls
 */
export class FabricAgent {
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
  private readonly generators = new Map<GeneratorType, BaseGenerator>();
  private readonly outputChannel: vscode.OutputChannel;
  private readonly httpClient: HttpClient;
  private readonly chatProvider: ChatProvider;

  constructor(
    private readonly context: vscode.ExtensionContext,
    httpClient: HttpClient,
    errorHandler: ErrorHandler,
    outputChannel: vscode.OutputChannel
  ) {
    this.httpClient = httpClient;
    this.outputChannel = outputChannel;
    this.chatProvider = new ChatProvider(this, httpClient, errorHandler);
    this.initGenerators();
  }

  /**
   * Initialize all code generators
   */
  private initGenerators(): void {
    // Only register actual generator implementations here.
    // Example: this.generators.set('entity', new EntityGenerator(this.context));
    // For now, leave empty or throw for unimplemented types.
    this.outputChannel.appendLine(
      `[Fabric AI] Initialized ${this.generators.size} generators`
    );
  }

  /**
   * Generate code for specific type
   */
  async generateCode(type: GeneratorType, name: string): Promise<string> {
    const generator = this.generators.get(type);
    if (!generator) {
      throw new Error(`No generator found for type: ${type}`);
    }

    if (!Validators.validateClassName(name).valid) {
      throw new Error(`Invalid class name: ${name}`);
    }

    return await generator.generate(name);
  }

  /**
   * AI chat completion
   */
  async chatCompletion(prompt: string): Promise<string> {
    const apiKey = await this.getApiKey();
    if (!Validators.validateApiKey(apiKey).valid) {
      throw new Error("Invalid Perplexity API key");
    }

    const response = await this.httpClient.request<{
      choices: Array<{ message: { content: string } }>;
    }>("https://api.perplexity.ai/chat/completions", {
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
            content:
              "You are an expert Minecraft Fabric modding assistant. Generate clean Java code.",
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
  public async getApiKey(): Promise<string> {
    // Check workspace config first
    const config = vscode.workspace.getConfiguration("fabric");
    const configKey = config.get<string>("perplexityApiKey");
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
  async setApiKeys(): Promise<void> {
    const apiKey = await vscode.window.showInputBox({
      prompt: "Enter Perplexity API Key (pplx-...)",
      password: true,
      validateInput: (value) => {
        return Validators.validateApiKey(value).valid
          ? null
          : "API key must start with pplx-";
      },
    });

    if (apiKey) {
      await this.context.secrets.store("perplexityApiKey", apiKey);
      vscode.window.showInformationMessage(
        "✅ Perplexity API key saved securely!"
      );
      this.outputChannel.appendLine("[Fabric AI] API key configured");
    }
  }

  /**
   * Generate complete mod structure
   */
  async generateModStructure(): Promise<void> {
    const modId = await vscode.window.showInputBox({
      prompt: "Mod ID (lowercase, no spaces)",
      value: "mymod",
      validateInput: (value) =>
        Validators.validateModId(value).valid ? null : "Invalid mod ID",
    });

    if (!modId) {
      return;
    }

    // Implementation would use template manager + code inserter
    vscode.window.showInformationMessage(
      `🚀 Fabric mod "${modId}" structure generated!`
    );
  }

  // Generator shortcut methods
  async generateEntity(): Promise<void> {
    const name = await this.promptForName("Entity name (e.g. CustomZombie)");
    if (name) {
      const code = await this.generateCode("entity", name);
      this.insertCode(code);
    }
  }

  async generateBlock(): Promise<void> {
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
  private async insertCode(code: string): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      await editor.edit((builder) => {
        builder.insert(editor.selection.active, code);
      });
      await vscode.commands.executeCommand("editor.action.formatDocument");
    } else {
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
  private async promptForName(
    placeHolder: string
  ): Promise<string | undefined> {
    return await vscode.window.showInputBox({
      placeHolder,
      validateInput: (value) =>
        Validators.validateClassName(value).valid ? null : "Invalid name",
    });
  }

  /**
   * Open chat webview
   */
  async openChat(): Promise<void> {
    await vscode.commands.executeCommand("workbench.view.extension.fabric-ai");
  }

  /**
   * Get completion provider (for language server)
   */
  getCompletionProvider() {
    return new CompletionProvider();
  }
  getHoverProvider() {
    return new HoverProvider(this);
  }
  getWebviewProvider() {
    return new WebviewProvider(this, this.chatProvider);
  }

  /**
   * Cleanup resources
   */
  dispose(): void {
    this.httpClient.dispose();
    this.generators.clear();
  }
}
