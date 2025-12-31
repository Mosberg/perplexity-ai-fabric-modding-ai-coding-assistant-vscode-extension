import * as vscode from 'vscode';
import { CompletionItemKind, SnippetString } from 'vscode';


export class CompletionProvider implements vscode.CompletionItemProvider {
  constructor() {}

  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    _token: vscode.CancellationToken,
    context: vscode.CompletionContext
  ): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {

    const linePrefix = document.lineAt(position).text.slice(0, position.character);
    const triggerChar = context.triggerCharacter;

    // Fabric-specific triggers
    if (['.', '(', ','].includes(triggerChar || '')) {
      return this.getFabricCompletions(linePrefix);
    }

    return this.getContextualCompletions(linePrefix);
  }

  private getFabricCompletions(
    prefix: string
  ): vscode.CompletionItem[] {
    const completions: vscode.CompletionItem[] = [];

    // Registry completions
    const registryCompletions = [
      {
        label: 'Registry.register',
        kind: CompletionItemKind.Method,
        insertText: new SnippetString('Registry.register(Registries.${1:block}, Identifier.of("${2:mana}", "${3:name}"), ${4:new ${5:Block}(FabricBlockSettings.create())})')
      },
      {
        label: 'Identifier.of',
        kind: CompletionItemKind.Method,
        insertText: new SnippetString('Identifier.of("${1:mana}", "${2:name}")')
      },
      {
        label: 'FabricItemGroup.builder',
        kind: CompletionItemKind.Constructor,
        insertText: new SnippetString('FabricItemGroup.builder().icon(${1:Items.DIAMOND}).build()')
      }
    ];

    // EntityType builder
    const entityCompletions = [
      {
        label: 'EntityType.Builder.create',
        kind: CompletionItemKind.Constructor,
        insertText: new SnippetString('EntityType.Builder.create(${1:MyEntity}::new, SpawnGroup.${2:CREATURE}).dimensions(${3:0.6f}, ${4:1.8f}).build("${5:id}")')
      }
    ];

    // Filter by prefix
    const allCompletions = [...registryCompletions, ...entityCompletions];

    for (const completion of allCompletions) {
      if (completion.label.toLowerCase().includes(prefix.slice(-10).toLowerCase())) {
        // Convert to vscode.CompletionItem for type safety
        const item = new vscode.CompletionItem(completion.label, completion.kind);
        item.insertText = completion.insertText;
        completions.push(item);
      }
    }

    return completions;
  }

  private getContextualCompletions(prefix: string): vscode.CompletionItem[] {
    const completions: vscode.CompletionItem[] = [];

    // Common Fabric classes
    const fabricClasses = [
      { label: 'FabricBlockSettings', kind: CompletionItemKind.Class, detail: 'Block settings builder' },
      { label: 'FabricItemGroup', kind: CompletionItemKind.Class, detail: 'Creative tab builder' },
      { label: 'EntityType.Builder', kind: CompletionItemKind.Class, detail: 'Entity type builder' }
    ];

    // Registries
    const registries = [
      { label: 'Registries.BLOCK', kind: CompletionItemKind.Field },
      { label: 'Registries.ITEM', kind: CompletionItemKind.Field },
      { label: 'Registries.ENTITY_TYPE', kind: CompletionItemKind.Field }
    ];

    const allItems = [...fabricClasses, ...registries];

    for (const item of allItems) {
      if (item.label.toLowerCase().includes(prefix.toLowerCase())) {
        const completion = new vscode.CompletionItem(item.label, item.kind);
        if ('detail' in item) {
          completion.detail = (item as { detail: string }).detail;
        }
        completion.documentation = new vscode.MarkdownString('Fabric API helper');
        completions.push(completion);
      }
    }

    return completions;
  }

  resolveCompletionItem?(item: vscode.CompletionItem): vscode.ProviderResult<vscode.CompletionItem> {
    // Add documentation on resolve
    if (item.label === 'Registry.register') {
      item.documentation = new vscode.MarkdownString(
        '``````'
      );
    }

    return item;
  }
}
