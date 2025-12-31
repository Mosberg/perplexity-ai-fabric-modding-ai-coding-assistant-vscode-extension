import * as vscode from 'vscode';
import { FabricAgent } from './fabricAgent';
import { HttpClient } from './services/http-client';
import { ErrorHandler } from './utils/error-handler';
import { FabricConfigManager } from './utils/fabricConfig';

export function activate(context: vscode.ExtensionContext) {
  console.log('🎮 Perplexity Fabric AI v2.0 ACTIVATED!');

  // Initialize core services
  const output = vscode.window.createOutputChannel('Fabric AI', { log: true });
  // const httpClient = new HttpClient();
  const httpClient = HttpClient.getInstance();
  const errorHandler = new ErrorHandler(output);

  // Master agent with ALL dependencies
  const agent = new FabricAgent(
    context,
    httpClient,
    errorHandler,
    output,
    FabricConfigManager.getConfig()
  );

  // Register LSP Providers
  const providers = [
    // Code Completions (Java/JSON/Gradle)
    vscode.languages.registerCompletionItemProvider(
      ['java', 'json', 'gradle', 'properties'],
      agent.getCompletionProvider(),
      '.', '(', ','
    ),

    // Hover Documentation
    vscode.languages.registerHoverProvider(
      ['java', 'json', 'gradle', 'properties'],
      agent.getHoverProvider()
    ),

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
  vscode.window.showInformationMessage(
    '🤖 Fabric AI Ready! Open sidebar or Ctrl+Shift+P → "Fabric AI: Generate Entity"'
  );

  output.appendLine('✅ All providers registered');
  output.appendLine('✅ 12 commands registered');
  output.appendLine('✅ Ready for Fabric modding!');
}

export function deactivate() {
  console.log('🛑 Fabric AI deactivated');
}
