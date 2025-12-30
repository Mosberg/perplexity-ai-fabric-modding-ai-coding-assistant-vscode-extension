import * as vscode from "vscode";

/**
 * Unified error handling with user-friendly dialogs and logging
 */
export class ErrorHandler {
  constructor(private readonly output: vscode.OutputChannel) {}

  /**
   * Handle any error with categorization and user feedback
   */
  handleError(error: unknown): void {
    const err = error instanceof Error ? error : new Error(String(error));

    this.logError(err);

    const category = this.getErrorCategory(err);
    const userMessage = this.getUserMessage(err, category);
    const actions = this.getErrorActions(category);

    vscode.window
      .showErrorMessage(userMessage, ...actions)
      .then((selection) => {
        this.handleAction(selection, err);
      });
  }

  private logError(error: Error): void {
    const timestamp = new Date().toLocaleTimeString();
    this.output.appendLine(`[${timestamp}] ❌ ${error.name}: ${error.message}`);
    if (error.stack) {
      this.output.appendLine(`  Stack: ${error.stack.slice(0, 500)}`);
    }
    this.output.show(true);
  }

  private getErrorCategory(error: Error): string {
    if (error.message.includes("HTTP 4")) {
      return "ClientError";
    }
    if (error.message.includes("HTTP 5")) {
      return "ServerError";
    }
    if (error.name === "ValidationError") {
      return "ValidationError";
    }
    if (error.message.includes("API key")) {
      return "AuthError";
    }
    if (error.message.includes("timeout")) {
      return "TimeoutError";
    }
    return "UnknownError";
  }

  private getUserMessage(error: Error, category: string): string {
    const messages: Record<string, string> = {
      ClientError: "Invalid request - check your input",
      ServerError: "AI service temporarily unavailable",
      ValidationError: "Invalid input - please check format",
      AuthError: "API key issue - please reconfigure",
      TimeoutError: "Request timed out - try again",
      UnknownError: "Something went wrong",
    };

    return `${messages[category] || "An error occurred"}: ${error.message.slice(
      0,
      100
    )}`;
  }

  private getErrorActions(category: string): string[] {
    const actions: Record<string, string[]> = {
      AuthError: ["Set API Key", "View Logs"],
      ValidationError: ["Retry", "View Logs"],
      ClientError: ["Retry", "View Logs"],
      TimeoutError: ["Retry", "View Logs"],
    };
    return actions[category] || ["View Logs"];
  }

  private handleAction(selection: string | undefined, _error: Error): void {
    switch (selection) {
      case "Set API Key":
        vscode.commands.executeCommand("fabric.setApiKey");
        break;
      case "Retry":
        // Trigger retry logic in calling context
        break;
      case "View Logs":
        this.output.show();
        break;
    }
  }
}
