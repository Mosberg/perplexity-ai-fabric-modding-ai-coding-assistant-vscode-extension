import * as fs from "fs/promises";
import * as path from "path";
import * as vscode from "vscode";

/**
 * Smart code insertion and file creation
 */
export class CodeInserter {
  private static readonly ENCODING = "utf8";

  /**
   * Insert code at cursor or create new file
   */
  static async insertCode(code: string): Promise<void> {
    const editor = vscode.window.activeTextEditor;

    if (editor) {
      // Insert at cursor
      await editor.edit((builder) => {
        builder.insert(editor.selection.active, code + "\n\n");
      });
      await vscode.commands.executeCommand("editor.action.formatDocument");
    } else {
      // Create new untitled document
      await this.createUntitledDocument(code);
    }
  }

  /**
   * Create file at specific path
   */
  static async createFile(uri: vscode.Uri, content: string): Promise<void> {
    try {
      const dirPath = path.dirname(uri.fsPath);
      await fs.mkdir(dirPath, { recursive: true });
      await fs.writeFile(uri.fsPath, content, this.ENCODING);

      const doc = await vscode.workspace.openTextDocument(uri);
      await vscode.window.showTextDocument(doc, { preview: false });
    } catch (error) {
      throw new Error(`Failed to create file: ${error}`);
    }
  }

  private static async createUntitledDocument(code: string): Promise<void> {
    const language = this.detectLanguage(code);
    const doc = await vscode.workspace.openTextDocument({
      content: code,
      language,
    });
    await vscode.window.showTextDocument(doc);
  }

  private static detectLanguage(code: string): string {
    if (/public\s+(class|interface|enum|record)/.test(code)) {
      return "java";
    }
    if (/fun\s+\w+/.test(code)) {
      return "kotlin";
    }
    if (/^\s*\{/.test(code.trim())) {
      return "json";
    }
    return "java"; // Default for Fabric
  }
}
