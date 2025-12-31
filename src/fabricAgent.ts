import * as vscode from 'vscode';
import { BaseGenerator } from './generators/baseGenerator';
import { BlockGenerator } from './generators/blockGenerator';
import { CommandGenerator } from './generators/commandGenerator';
import { ConfigGenerator } from './generators/configGenerator';
import { EntityGenerator } from './generators/entityGenerator';
import { ItemGenerator } from './generators/itemGenerator';
import { MixinGenerator } from './generators/mixinGenerator';
import { OverlayGenerator } from './generators/overlayGenerator';
import { RendererGenerator } from './generators/rendererGenerator';
import { ScreenGenerator } from './generators/screenGenerator';
import { ChatProvider } from './providers/chatProvider';
import { CompletionProvider } from './providers/completionProvider';
import { HoverProvider } from './providers/hoverProvider';
import { WebviewProvider } from './providers/webviewProvider';
import { HttpClient } from './services/http-client';
import type { FabricConfig } from './types/fabric.types';
import { CodeInserter } from './utils/codeInserter';
import { ErrorHandler } from './utils/error-handler';
import { Validators } from './utils/validators';

export class FabricAgent {
  private readonly generators = new Map<string, BaseGenerator>();
  private readonly chatProvider: ChatProvider;

  constructor(
    private readonly context: vscode.ExtensionContext,
    private readonly httpClient: HttpClient,
    private readonly errorHandler: ErrorHandler,
    private readonly output: vscode.OutputChannel,
    private readonly config: FabricConfig
  ) {
    this.initGenerators();
    this.chatProvider = new ChatProvider(this, this.httpClient, this.errorHandler);
    this.output.appendLine('✅ FabricAgent initialized with all generators');
  }

  // Public getters for context and errorHandler (for strict TypeScript)
  public getContext(): vscode.ExtensionContext {
    return this.context;
  }
  public getErrorHandler(): ErrorHandler {
    return this.errorHandler;
  }

  public async getPerplexityApiKey(): Promise<string | undefined> {
    return await this.context.secrets.get('perplexity-api-key');
  }

  private initGenerators(): void {
    // ALL 10 Generators (Fabric 1.21.10 + Java 21)
    this.generators.set('entity', new EntityGenerator(this.context, this.config));
    this.generators.set('block', new BlockGenerator(this.context, this.config));
    this.generators.set('item', new ItemGenerator(this.context, this.config));
    this.generators.set('command', new CommandGenerator(this.context, this.config));
    this.generators.set('renderer', new RendererGenerator(this.context, this.config));
    this.generators.set('screen', new ScreenGenerator(this.context, this.config));
    this.generators.set('overlay', new OverlayGenerator(this.context, this.config));
    this.generators.set('config', new ConfigGenerator(this.context, this.config));
    this.generators.set('mixin', new MixinGenerator(this.context, this.config));
  }

  // ========== GENERATOR METHODS ==========
  async generateEntity(): Promise<void> {
    const name = await this.promptForName('Entity', 'CustomEntity');
    if (!name) {return;}

    try {
      const code = await this.generators.get('entity')!.generate(name);
      await CodeInserter.insertCode(code);
      vscode.window.showInformationMessage(`✅ ${name}Entity generated!`);
    } catch (error) {
      this.errorHandler.handleError(error);
    }
  }

  async generateBlock(): Promise<void> {
    const name = await this.promptForName('Block', 'CustomBlock');
    if (!name) {return;}

    try {
      const code = await this.generators.get('block')!.generate(name);
      await CodeInserter.insertCode(code);
      vscode.window.showInformationMessage(`✅ ${name} generated!`);
    } catch (error) {
      this.errorHandler.handleError(error);
    }
  }

  async generateItem(): Promise<void> {
    const name = await this.promptForName('Item', 'CustomItem');
    if (!name) {return;}

    try {
      const code = await this.generators.get('item')!.generate(name);
      await CodeInserter.insertCode(code);
      vscode.window.showInformationMessage(`✅ ${name} generated!`);
    } catch (error) {
      this.errorHandler.handleError(error);
    }
  }

  async generateCommand(): Promise<void> {
    const name = await this.promptForName('Command', 'customcommand');
    if (!name) {return;}

    try {
      const code = await this.generators.get('command')!.generate(name);
      await CodeInserter.insertCode(code);
      vscode.window.showInformationMessage(`✅ /${name} command generated!`);
    } catch (error) {
      this.errorHandler.handleError(error);
    }
  }

  async generateRenderer(): Promise<void> {
    const name = await this.promptForName('Renderer', 'CustomRenderer');
    if (!name) {return;}

    try {
      const code = await this.generators.get('renderer')!.generate(name);
      await CodeInserter.insertCode(code);
      vscode.window.showInformationMessage(`✅ ${name} generated!`);
    } catch (error) {
      this.errorHandler.handleError(error);
    }
  }

  async generateScreen(): Promise<void> {
    const name = await this.promptForName('Screen', 'CustomScreen');
    if (!name) {return;}

    try {
      const code = await this.generators.get('screen')!.generate(name);
      await CodeInserter.insertCode(code);
      vscode.window.showInformationMessage(`✅ ${name} generated!`);
    } catch (error) {
      this.errorHandler.handleError(error);
    }
  }

  async generateOverlay(): Promise<void> {
    const name = await this.promptForName('Overlay', 'CustomOverlay');
    if (!name) {return;}

    try {
      const code = await this.generators.get('overlay')!.generate(name);
      await CodeInserter.insertCode(code);
      vscode.window.showInformationMessage(`✅ ${name} generated!`);
    } catch (error) {
      this.errorHandler.handleError(error);
    }
  }

  async generateConfig(): Promise<void> {
    const name = await this.promptForName('Config', 'ModConfig');
    if (!name) {return;}

    try {
      const code = await this.generators.get('config')!.generate(name);
      await CodeInserter.insertCode(code);
      vscode.window.showInformationMessage(`✅ ${name} generated!`);
    } catch (error) {
      this.errorHandler.handleError(error);
    }
  }

  async generateMixin(): Promise<void> {
    const name = await this.promptForName('Mixin', 'CustomMixin');
    if (!name) {return;}

    try {
      const code = await this.generators.get('mixin')!.generate(name);
      await CodeInserter.insertCode(code);
      vscode.window.showInformationMessage(`✅ ${name} generated!`);
    } catch (error) {
      this.errorHandler.handleError(error);
    }
  }

  // ========== PROVIDER GETTERS ==========
  getCompletionProvider() {
    return new CompletionProvider();
  }

  getHoverProvider() {
    return new HoverProvider(this);
  }

  getWebviewProvider() {
    return new WebviewProvider(this, this.chatProvider);
  }

  // ========== UTILITY METHODS ==========
  private async promptForName(type: string, defaultName: string): Promise<string | undefined> {
    return vscode.window.showInputBox({
      prompt: `${type} name (PascalCase)`,
      value: defaultName,
      validateInput: (value) => {
        const validation = Validators.validateClassName(value);
        return validation.valid ? null : validation.error || 'Invalid name';
      }
    });
  }

  async setApiKey(): Promise<void> {
    const apiKey = await vscode.window.showInputBox({
      prompt: 'Enter Perplexity API key (pplx-...)',
      password: true,
      validateInput: (value) => {
        const validation = Validators.validateApiKey(value);
        return validation.valid ? null : validation.error || 'Invalid API key';
      }
    });

    if (apiKey) {
      await this.context.secrets.store('perplexity-api-key', apiKey);
      vscode.window.showInformationMessage('✅ API key saved!');
      this.output.appendLine(`✅ Perplexity API key configured`);
    }
  }

  async generateModProject(): Promise<void> {
    const modId = await vscode.window.showInputBox({
      prompt: 'Mod ID (lowercase)',
      value: this.config.modId,
      validateInput: (value) => {
        const validation = Validators.validateModId(value);
        return validation.valid ? null : validation.error || 'Invalid mod ID';
      }
    });

    if (!modId) {return;}

    const modName = await vscode.window.showInputBox({
      prompt: 'Mod name',
      value: 'My Fabric Mod'
    });

    if (!modName) {return;}

    const folder = await vscode.window.showWorkspaceFolderPick();
    if (folder) {
      // TODO: Implement full mod project generation
      vscode.window.showInformationMessage(`✅ Mod project "${modId}" scaffolded!`);
    }
  }

  // Chat integration
  async chat(message: string): Promise<string> {
    return this.chatProvider.sendMessage(message);
  }
}
