import * as vscode from "vscode";
import { FabricAgent } from "./fabricAgent";
import { FabricConfigManager } from "./utils/fabricConfig";

export function activate(context: vscode.ExtensionContext) {
  console.log("🎮 Ultimate Fabric AI ACTIVATED!");

  // Config
  const config = FabricConfigManager.getConfig();

  // Output channel for error logging
  const outputChannel = vscode.window.createOutputChannel("Fabric AI");

  // Core agent
  const agent = new FabricAgent(context, outputChannel);

  // Register ALL providers
  const providers = [
    vscode.languages.registerCompletionItemProvider(
      ["java", "json", "gradle"],
      agent.getCompletionProvider()
    ),
    vscode.languages.registerHoverProvider(
      ["java", "json", "gradle"],
      agent.getHoverProvider()
    ),

    // Webview sidebar
    vscode.window.registerWebviewViewProvider(
      "fabric.agent",
      agent.getWebviewProvider()
    ),

    // ALL Commands (Fabric + Copilot)
    vscode.commands.registerCommand("fabric.setApiKey", () =>
      agent.setApiKey()
    ),
    vscode.commands.registerCommand("fabric.newMod", () =>
      agent.generateModProject()
    ),
    vscode.commands.registerCommand("fabric.generateEntity", () =>
      agent.generateEntity()
    ),
    vscode.commands.registerCommand("fabric.generateBlock", () =>
      agent.generateBlock()
    ),
    vscode.commands.registerCommand("fabric.generateItem", () =>
      agent.generateItem()
    ),
    vscode.commands.registerCommand("fabric.generateCommand", () =>
      agent.generateCommand()
    ),
    vscode.commands.registerCommand("fabric.generateRenderer", () =>
      agent.generateRenderer()
    ),
    vscode.commands.registerCommand("fabric.generateScreen", () =>
      agent.generateScreen()
    ),
    vscode.commands.registerCommand("fabric.generateOverlay", () =>
      agent.generateOverlay()
    ),
    vscode.commands.registerCommand("fabric.generateConfig", () =>
      agent.generateConfig()
    ),
    vscode.commands.registerCommand("fabric.generateMixin", () =>
      agent.generateMixin()
    ),

    // Copilot commands (from perplexity-ai-copilot)
    vscode.commands.registerCommand("copilot.chat", () =>
      agent.openCopilotChat()
    ),
    vscode.commands.registerCommand("copilot.explain", () =>
      agent.explainCode()
    ),
    vscode.commands.registerCommand("copilot.generate", () =>
      agent.generateCode()
    ),
  ];

  context.subscriptions.push(...providers);

  // Welcome message
  vscode.window.showInformationMessage(
    "🤖 Ultimate Fabric AI Ready! Open sidebar or Ctrl+Shift+P → Fabric AI"
  );
}

export function deactivate() {}
