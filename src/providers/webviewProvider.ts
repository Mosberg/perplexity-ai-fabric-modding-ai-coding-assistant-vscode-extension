import * as vscode from 'vscode';
import { WebviewView, WebviewViewProvider } from 'vscode';
import { FabricAgent } from '../fabricAgent';
import { ChatProvider } from './chatProvider';

export class WebviewProvider implements WebviewViewProvider {
  private _view?: WebviewView;
  private readonly agent: FabricAgent;
  private readonly chatProvider: ChatProvider;

  constructor(agent: FabricAgent, chatProvider: ChatProvider) {
    this.agent = agent;
    this.chatProvider = chatProvider;
  }

  public resolveWebviewView(
    webviewView: WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this.agent.getContext().extensionUri, 'media'),
        vscode.Uri.joinPath(this.agent.getContext().extensionUri, 'snippets')
      ]
    };

    webviewView.webview.html = this.getWebviewContent();

    // Handle messages from webview
    webviewView.webview.onDidReceiveMessage(async (data) => {
      await this.handleMessage(data);
    });
  }

  private getWebviewContent(): string {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fabric AI Assistant</title>
  <link href="./fabric-agent.css" rel="stylesheet">
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>🤖 Fabric AI</h1>
      <div class="status" id="status">Ready</div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <h3>🚀 Quick Generate</h3>
      <div class="action-grid">
        <button class="action-btn entity" data-action="generateEntity">👹 Entity</button>
        <button class="action-btn block" data-action="generateBlock">🧱 Block</button>
        <button class="action-btn item" data-action="generateItem">📦 Item</button>
        <button class="action-btn command" data-action="generateCommand">⚡ Command</button>
        <button class="action-btn renderer" data-action="generateRenderer">🖼️ Renderer</button>
        <button class="action-btn screen" data-action="generateScreen">📱 Screen</button>
        <button class="action-btn overlay" data-action="generateOverlay">📊 HUD</button>
        <button class="action-btn config" data-action="generateConfig">⚙️ Config</button>
        <button class="action-btn mixin" data-action="generateMixin">🔧 Mixin</button>
      </div>
    </div>

    <!-- Chat -->
    <div class="chat-section">
      <h3>💬 AI Chat</h3>
      <div class="messages" id="messages"></div>
      <div class="input-area">
        <input type="text" id="messageInput" placeholder="Ask about Fabric modding...">
        <button id="sendBtn">Send</button>
      </div>
    </div>
  </div>

  <script src="./fabric-agent.js"></script>
</body>
</html>`;
  }

  private async handleMessage(data: any): Promise<void> {
    try {
      switch (data.command) {
        case 'generateEntity':
          await vscode.commands.executeCommand('fabric.generateEntity');
          break;
        case 'generateBlock':
          await vscode.commands.executeCommand('fabric.generateBlock');
          break;
        case 'generateItem':
          await vscode.commands.executeCommand('fabric.generateItem');
          break;
        case 'generateCommand':
          await vscode.commands.executeCommand('fabric.generateCommand');
          break;
        case 'generateRenderer':
          await vscode.commands.executeCommand('fabric.generateRenderer');
          break;
        case 'generateScreen':
          await vscode.commands.executeCommand('fabric.generateScreen');
          break;
        case 'generateOverlay':
          await vscode.commands.executeCommand('fabric.generateOverlay');
          break;
        case 'generateConfig':
          await vscode.commands.executeCommand('fabric.generateConfig');
          break;
        case 'generateMixin':
          await vscode.commands.executeCommand('fabric.generateMixin');
          break;
        case 'sendMessage':
          const response = await this.chatProvider.sendMessage(data.text, (chunk) => {
            this._view?.webview.postMessage({
              command: 'streamChunk',
              content: chunk
            });
          });
          this._view?.webview.postMessage({
            command: 'streamEnd',
            content: response
          });
          break;
      }
    } catch (error) {
      this.agent.getErrorHandler().handleError(error);
    }
  }
}
