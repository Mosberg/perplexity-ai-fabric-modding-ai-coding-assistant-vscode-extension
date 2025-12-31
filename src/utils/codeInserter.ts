import * as fs from 'fs/promises';
import * as path from 'path';
import * as vscode from 'vscode';
import { FabricConfigManager } from './fabricConfig';
import { TemplateManager } from './templateManager';

export class CodeInserter {
  private static readonly ENCODING = 'utf-8';

  /**
   * Insert code at cursor or create new untitled document
   */
  static async insertCode(code: string): Promise<void> {
    const editor = vscode.window.activeTextEditor;

    if (editor && editor.document.languageId === 'java') {
      // Insert at cursor in Java file
      const position = editor.selection.active;
      await editor.edit(builder => {
        builder.insert(position, code + '\n\n');
      });

      // Auto-format
      await vscode.commands.executeCommand('editor.action.formatDocument');
      vscode.window.showInformationMessage('✅ Code inserted and formatted!');

    } else {
      // Create new Java document
      const document = await vscode.workspace.openTextDocument({
        language: 'java',
        content: code
      });
      await vscode.window.showTextDocument(document, { preview: false });
    }
  }

  /**
   * Create file at specific workspace path
   */
  static async createFile(workspaceFolder: vscode.WorkspaceFolder, relativePath: string, content: string): Promise<void> {
    try {
      const uri = vscode.Uri.joinPath(workspaceFolder.uri, relativePath);
      const dirPath = path.dirname(uri.fsPath);

      // Create directories
      await fs.mkdir(dirPath, { recursive: true });

      // Write file
      await fs.writeFile(uri.fsPath, content, this.ENCODING);

      // Open in editor
      const document = await vscode.workspace.openTextDocument(uri);
      await vscode.window.showTextDocument(document, { preview: false });

      vscode.window.showInformationMessage(`✅ Created: ${relativePath}`);

    } catch (error) {
      const err = error as NodeJS.ErrnoException;
      throw new Error(`Failed to create ${relativePath}: ${err.message}`);
    }
  }

  /**
   * Create complete Fabric mod project structure
   */
  static async createModProject(
    workspaceFolder: vscode.WorkspaceFolder,
    modId: string,
    modName: string
  ): Promise<void> {
    const config = FabricConfigManager.getConfig();

    // Core files
    const files = [
      {
        path: `src/main/java/${config.packageName.replace(/\./g, '/')}/ModInitializer.java`,
        content: TemplateManager.getModInitializer(modId, config.packageName)
      },
      {
        path: 'gradle.properties',
        content: TemplateManager.getGradleProperties(config)
      },
      {
        path: 'build.gradle',
        content: TemplateManager.getBuildGradle(config)
      },
      {
        path: 'src/main/resources/fabric.mod.json',
        content: TemplateManager.getFabricModJson(modId, modName)
      },
      {
        path: 'src/main/resources/META-INF/mods.toml',
        content: TemplateManager.getModsToml(modId, modName)
      }
    ];

    // Create all files
    for (const file of files) {
      if (typeof file.content === 'string') {
        await this.createFile(workspaceFolder, file.path, file.content);
      } else {
        throw new Error(`File content for ${file.path} is not a string.`);
      }
    }

    vscode.window.showInformationMessage(`✅ Fabric mod "${modId}" created! Run ./gradlew genSources`);
  }


  /**
   * Insert code block with proper formatting
   */
  static async insertFormatted(code: string, title: string): Promise<void> {
    const editor = vscode.window.activeTextEditor;

    if (editor) {
      const position = editor.selection.active;
      const snippet = new vscode.SnippetString(code + '\n\n');

      await editor.insertSnippet(snippet, position);
      await vscode.commands.executeCommand('editor.action.formatSelection');

      vscode.window.showInformationMessage(`✅ ${title} inserted!`);
    }
  }
}
