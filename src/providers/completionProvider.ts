import * as vscode from "vscode";
import { CompletionItemKind } from "vscode";

/**
 * Language server completion provider for Java/Fabric code
 */
export class CompletionProvider implements vscode.CompletionItemProvider {
  constructor() {}

  async provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position
  ): Promise<vscode.CompletionItem[] | undefined> {
    const linePrefix = document
      .lineAt(position)
      .text.slice(0, position.character);
    const triggerCharacter = linePrefix.slice(-1);

    // Common Fabric triggers
    if ([".", ",", "("].includes(triggerCharacter)) {
      return this.getFabricCompletions(document, position, linePrefix);
    }

    return undefined;
  }

  private async getFabricCompletions(
    _document: vscode.TextDocument,
    _position: vscode.Position,
    prefix: string
  ): Promise<vscode.CompletionItem[]> {
    const completions: vscode.CompletionItem[] = [];

    // Fabric API completions
    const fabricCompletions = [
      {
        label: "Registry.register",
        kind: CompletionItemKind.Method,
        insertText:
          'Registry.register(Registries.${1:registry}, Identifier.of("${2:modid}", "${3:name}"), ${4:value})',
      },
      {
        label: "Identifier.of",
        kind: CompletionItemKind.Method,
        insertText: 'Identifier.of("${1:modid}", "${2:name}")',
      },
      {
        label: "FabricItemGroup.builder",
        kind: CompletionItemKind.Constructor,
        insertText: "FabricItemGroup.builder().icon(${1:item}).build()",
      },
      {
        label: "EntityType.Builder",
        kind: CompletionItemKind.Constructor,
        insertText:
          'EntityType.Builder.create(${1:EntityClass}::new, SpawnGroup.${2:CREATURE}).dimensions(${3:0.6f}, ${4:1.8f}).build("${5:id}")',
      },
    ];

    // Context-aware completions based on prefix
    for (const completion of fabricCompletions) {
      if (
        completion.label.toLowerCase().includes(prefix.toLowerCase().slice(-10))
      ) {
        const item = new vscode.CompletionItem(completion.label);
        item.kind = completion.kind;
        item.insertText = new vscode.SnippetString(completion.insertText);
        item.documentation = new vscode.MarkdownString("Fabric API helper");
        completions.push(item);
      }
    }

    return completions;
  }
}
