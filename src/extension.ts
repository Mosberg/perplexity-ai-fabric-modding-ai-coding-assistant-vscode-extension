import * as vscode from "vscode";
import { FabricAgent } from "./fabricAgent";
import { HttpClient } from "./services/http-client";
import { ErrorHandler } from "./utils/error-handler";
import { Validators } from "./utils/validators";

/**
 * Main extension activation function
 * Initializes all services, providers, and commands
 */
export async function activate(
  context: vscode.ExtensionContext
): Promise<void> {
  const outputChannel = vscode.window.createOutputChannel("Fabric AI");
  const errorHandler = new ErrorHandler(outputChannel);
  const httpClient = HttpClient.getInstance();

  // Global error handler
  process.on("uncaughtException", (error) => errorHandler.handleError(error));
  process.on("unhandledRejection", (reason) =>
    errorHandler.handleError(reason as Error)
  );

  outputChannel.appendLine("[Fabric AI] Initializing...");

  try {
    // Validate API key on startup
    const apiKey = await context.secrets.get("perplexityApiKey");
    if (!apiKey || !Validators.validateApiKey(apiKey).valid) {
      vscode.window.showWarningMessage(
        "Fabric AI: Set your Perplexity API key (Ctrl+Shift+P → Fabric AI: Set API Keys)"
      );
    }

    // Initialize core agent
    const agent = new FabricAgent(
      context,
      httpClient,
      errorHandler,
      outputChannel
    );

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
  } catch (error) {
    errorHandler.handleError(error);
    outputChannel.appendLine(`[Fabric AI] ❌ Activation failed: ${error}`);
  }
}

/**
 * Register language providers (completions, hovers, code actions)
 */
function registerProviders(
  context: vscode.ExtensionContext,
  agent: FabricAgent,
  outputChannel: vscode.OutputChannel
): void {
  outputChannel.appendLine("[Fabric AI] Registering providers...");

  // Code completions for Java, JSON, Gradle
  const completionLanguages = ["java", "json", "gradle", "groovy"];
  for (const lang of completionLanguages) {
    context.subscriptions.push(
      vscode.languages.registerCompletionItemProvider(
        { language: lang, scheme: "file" },
        agent.getCompletionProvider(),
        ".",
        ",",
        "("
      )
    );
  }

  // Hovers for Java
  context.subscriptions.push(
    vscode.languages.registerHoverProvider(
      { language: "java", scheme: "file" },
      agent.getHoverProvider()
    )
  );

  // Webview sidebar
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "fabric.agent",
      agent.getWebviewProvider()
    )
  );

  outputChannel.appendLine("[Fabric AI] ✅ Providers registered");
}

/**
 * Register all Fabric AI commands
 */
function registerCommands(
  context: vscode.ExtensionContext,
  agent: FabricAgent,
  errorHandler: ErrorHandler,
  outputChannel: vscode.OutputChannel
): void {
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
    context.subscriptions.push(
      vscode.commands.registerCommand(cmd.id, async () => {
        try {
          await cmd.handler();
        } catch (error) {
          errorHandler.handleError(error);
        }
      })
    );
  }

  outputChannel.appendLine(
    `[Fabric AI] ✅ ${commands.length} commands registered`
  );
}

/**
 * Register status bar item
 */
function registerStatusBar(context: vscode.ExtensionContext): void {
  const statusBar = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );

  statusBar.command = "fabric.chatWithAI";
  statusBar.text = "🤖 Fabric AI";
  statusBar.tooltip = "Fabric Modding AI Assistant";
  statusBar.show();

  context.subscriptions.push(statusBar);
}

/**
 * Show welcome message on first activation
 */
async function showWelcomeMessage(
  context: vscode.ExtensionContext
): Promise<void> {
  const hasShown = context.globalState.get("fabricAI.welcomeShown", false);
  if (hasShown) {
    return;
  }

  const selection = await vscode.window.showInformationMessage(
    "🎉 Welcome to Fabric Modding AI!",
    "Set API Key",
    "Don't Show Again"
  );

  if (selection === "Set API Key") {
    vscode.commands.executeCommand("fabric.setApiKey");
  } else if (selection === "Don't Show Again") {
    await context.globalState.update("fabricAI.welcomeShown", true);
  }
}

/**
 * Extension deactivation - cleanup resources
 */
export function deactivate(): void {
  // Global cleanup will be handled by FabricAgent dispose
  console.log("[Fabric AI] Extension deactivated");
}
