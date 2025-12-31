import * as vscode from 'vscode';

export class ErrorHandler {
  constructor(private readonly output: vscode.OutputChannel) {}

  handleError(error: unknown): void {
    const err = error instanceof Error ? error : new Error(String(error));

    // Log to output channel
    this.logError(err);

    // Categorize and show user-friendly message
    const category = this.categorizeError(err);
    const userMessage = this.getUserMessage(err, category);
    const actions = this.getQuickFixActions(category);

    vscode.window.showErrorMessage(userMessage, ...actions).then(action => {
      this.handleQuickFix(action, err);
    });
  }

  private logError(error: Error): void {
    const timestamp = new Date().toISOString();
    this.output.appendLine(`[${timestamp}] ❌ ${error.name}: ${error.message}`);
    if (error.stack) {
      this.output.appendLine(`   Stack: ${error.stack.slice(0, 500)}...`);
    }
    this.output.show(true);
  }

  private categorizeError(error: Error): string {
    const msg = error.message.toLowerCase();

    if (msg.includes('http 4')) {return 'ClientError';}
    if (msg.includes('http 5')) {return 'ServerError';}
    if (msg.includes('api key') || msg.includes('pplx-')) {return 'AuthError';}
    if (msg.includes('timeout') || msg.includes('abort')) {return 'TimeoutError';}
    if (msg.includes('validation')) {return 'ValidationError';}

    return 'UnknownError';
  }

  private getUserMessage(error: Error, category: string): string {
    const messages: Record<string, string> = {
      'ClientError': 'Invalid request - check your input and try again',
      'ServerError': 'AI service temporarily unavailable - retrying...',
      'AuthError': 'API key issue - configure Perplexity API key',
      'TimeoutError': 'Request timed out - network slow, try again',
      'ValidationError': 'Invalid input format - check naming conventions',
      'UnknownError': 'Unexpected error occurred'
    };

    const baseMsg = messages[category] || 'Something went wrong';
    return `${baseMsg}: ${error.message.slice(0, 100)}${error.message.length > 100 ? '...' : ''}`;
  }

  private getQuickFixActions(category: string): string[] {
    const actions: Record<string, string[]> = {
      'AuthError': ['🔑 Set API Key', '📋 View Logs'],
      'ValidationError': ['🔄 Retry', '📋 View Logs'],
      'ClientError': ['🔄 Retry', '📋 View Logs'],
      'TimeoutError': ['🔄 Retry', '📋 View Logs'],
      'ServerError': ['⏳ Retry Later', '📋 View Logs']
    };

    return actions[category] || ['📋 View Logs'];
  }

  private async handleQuickFix(action: string | undefined, _error: Error): Promise<void> {
    switch (action) {
      case '🔑 Set API Key':
        await vscode.commands.executeCommand('fabric.setApiKey');
        break;

      case '🔄 Retry':
        // Caller handles retry logic
        vscode.window.showInformationMessage('Please try the command again');
        break;

      case '📋 View Logs':
        this.output.show();
        break;

      case '⏳ Retry Later':
        vscode.window.showInformationMessage('Try again in a few minutes');
        break;
    }
  }

  // Type-safe error creation
  static validationError(message: string): Error {
    const error = new Error(message);
    error.name = 'ValidationError';
    return error;
  }

  static httpError(status: number, message: string): Error {
    const error = new Error(message);
    error.name = `HttpError_${status}`;
    return error;
  }
}
