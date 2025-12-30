import * as vscode from "vscode";
import { MarkdownString } from "vscode";
import { FabricAgent } from "../fabricAgent";

/**
 * Hover provider for Fabric API documentation and explanations
 */
export class HoverProvider implements vscode.HoverProvider {
  private readonly fabricDocs: Record<string, string> = {
    "Registry.register":
      "Registers an object in the Minecraft registry system.\n\n``````",
    "Identifier.of":
      "Creates a Minecraft identifier (namespace:path).\n\n``````",
    "EntityType.Builder":
      "Builds entity types with dimensions, spawn rules, etc.\n\n``````",
    FabricBlockSettings:
      "Configures block properties (strength, material, sounds).\n\n``````",
  };

  constructor(private readonly agent: FabricAgent) {}

  async provideHover(
    document: vscode.TextDocument,
    position: vscode.Position
  ): Promise<vscode.Hover | undefined> {
    const wordRange = document.getWordRangeAtPosition(
      position,
      /[a-zA-Z_][a-zA-Z0-9_]*/
    );
    if (!wordRange) {
      return undefined;
    }

    const word = document.getText(wordRange);
    const doc = this.fabricDocs[word];

    if (doc) {
      return new vscode.Hover(new MarkdownString(doc));
    }

    // AI-powered hover for unknown symbols
    try {
      const codeContext = document.getText(
        new vscode.Range(
          Math.max(0, position.line - 5),
          0,
          Math.min(document.lineCount, position.line + 5),
          document.lineAt(position.line).text.length
        )
      );

      const explanation = await this.agent.chatCompletion(
        `Explain this Fabric code: \n\`\`\`java\n${codeContext}\n\`\`\`\nFocus on line with "${word}"`
      );

      return new vscode.Hover(new MarkdownString(explanation));
    } catch {
      return undefined;
    }
  }
}
