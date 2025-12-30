import * as vscode from "vscode";
import {
  WebviewView,
  WebviewViewProvider,
  WebviewViewResolveContext,
} from "vscode";
import { FabricAgent } from "../fabricAgent";
import { ChatProvider } from "./chatProvider";

/**
 * Webview sidebar provider for Fabric AI interface
 */
export class WebviewProvider implements WebviewViewProvider {
  private readonly chatProvider: ChatProvider;

  constructor(_agent: FabricAgent, chatProvider: ChatProvider) {
    this.chatProvider = chatProvider;
  }

  public resolveWebviewView(
    webviewView: WebviewView,
    _context: WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [],
    };

    webviewView.webview.html = this.getHtmlContent(); // Now loads external CSS/JS

    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.command) {
        case "sendMessage":
          const response = await this.chatProvider.sendMessage(
            data.text,
            (chunk) => {
              webviewView.webview.postMessage({
                command: "streamChunk",
                content: chunk,
              });
            }
          );
          webviewView.webview.postMessage({
            command: "streamEnd",
            content: response,
          });
          break;

        case "generateEntity":
          await vscode.commands.executeCommand("fabric.generateEntity");
          break;

        case "generateBlock":
          await vscode.commands.executeCommand("fabric.generateBlock");
          break;

        // Add other generator commands...
      }
    });
  }

  private getHtmlContent(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fabric AI</title>
    <style>
        body { font-family: var(--vscode-font-family); margin: 0; padding: 16px; }
        .header { font-size: 18px; font-weight: bold; margin-bottom: 16px; }
        .quick-actions { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 8px; }
        .action-btn { padding: 12px; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; }
        .chat-input { width: 100%; padding: 12px; border: 1px solid var(--vscode-input-border); border-radius: 6px; }
        .send-btn { padding: 12px 24px; background: var(--vscode-button-background); border: none; border-radius: 6px; cursor: pointer; }
    </style>
</head>
<body>
    <div class="header">🤖 Fabric AI Assistant</div>

    <div class="quick-actions">
        <button class="action-btn" onclick="vscode.postMessage({command: 'generateEntity'})">Entity</button>
        <button class="action-btn" onclick="vscode.postMessage({command: 'generateBlock'})">Block</button>
        <button class="action-btn" onclick="vscode.postMessage({command: 'generateItem'})">Item</button>
        <button class="action-btn" onclick="vscode.postMessage({command: 'generateCommand'})">Command</button>
        <button class="action-btn" onclick="vscode.postMessage({command: 'generateMixin'})">Mixin</button>
    </div>

    <div style="margin-top: 24px;">
        <input class="chat-input" id="chatInput" placeholder="Ask about Fabric modding...">
        <button class="send-btn" onclick="sendMessage()">Send</button>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        async function sendMessage() {
            const input = document.getElementById('chatInput');
            vscode.postMessage({ command: 'sendMessage', text: input.value });
            input.value = '';
        }
    </script>
</body>
</html>`;
  }
}
