"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompletionProvider = void 0;
const vscode = __importStar(require("vscode"));
const vscode_1 = require("vscode");
class CompletionProvider {
    constructor() { }
    provideCompletionItems(document, position, _token, context) {
        const linePrefix = document.lineAt(position).text.slice(0, position.character);
        const triggerChar = context.triggerCharacter;
        // Fabric-specific triggers
        if (['.', '(', ','].includes(triggerChar || '')) {
            return this.getFabricCompletions(linePrefix);
        }
        return this.getContextualCompletions(linePrefix);
    }
    getFabricCompletions(prefix) {
        const completions = [];
        // Registry completions
        const registryCompletions = [
            {
                label: 'Registry.register',
                kind: vscode_1.CompletionItemKind.Method,
                insertText: new vscode_1.SnippetString('Registry.register(Registries.${1:block}, Identifier.of("${2:mana}", "${3:name}"), ${4:new ${5:Block}(FabricBlockSettings.create())})')
            },
            {
                label: 'Identifier.of',
                kind: vscode_1.CompletionItemKind.Method,
                insertText: new vscode_1.SnippetString('Identifier.of("${1:mana}", "${2:name}")')
            },
            {
                label: 'FabricItemGroup.builder',
                kind: vscode_1.CompletionItemKind.Constructor,
                insertText: new vscode_1.SnippetString('FabricItemGroup.builder().icon(${1:Items.DIAMOND}).build()')
            }
        ];
        // EntityType builder
        const entityCompletions = [
            {
                label: 'EntityType.Builder.create',
                kind: vscode_1.CompletionItemKind.Constructor,
                insertText: new vscode_1.SnippetString('EntityType.Builder.create(${1:MyEntity}::new, SpawnGroup.${2:CREATURE}).dimensions(${3:0.6f}, ${4:1.8f}).build("${5:id}")')
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
    getContextualCompletions(prefix) {
        const completions = [];
        // Common Fabric classes
        const fabricClasses = [
            { label: 'FabricBlockSettings', kind: vscode_1.CompletionItemKind.Class, detail: 'Block settings builder' },
            { label: 'FabricItemGroup', kind: vscode_1.CompletionItemKind.Class, detail: 'Creative tab builder' },
            { label: 'EntityType.Builder', kind: vscode_1.CompletionItemKind.Class, detail: 'Entity type builder' }
        ];
        // Registries
        const registries = [
            { label: 'Registries.BLOCK', kind: vscode_1.CompletionItemKind.Field },
            { label: 'Registries.ITEM', kind: vscode_1.CompletionItemKind.Field },
            { label: 'Registries.ENTITY_TYPE', kind: vscode_1.CompletionItemKind.Field }
        ];
        const allItems = [...fabricClasses, ...registries];
        for (const item of allItems) {
            if (item.label.toLowerCase().includes(prefix.toLowerCase())) {
                const completion = new vscode.CompletionItem(item.label, item.kind);
                if ('detail' in item) {
                    completion.detail = item.detail;
                }
                completion.documentation = new vscode.MarkdownString('Fabric API helper');
                completions.push(completion);
            }
        }
        return completions;
    }
    resolveCompletionItem(item) {
        // Add documentation on resolve
        if (item.label === 'Registry.register') {
            item.documentation = new vscode.MarkdownString('``````');
        }
        return item;
    }
}
exports.CompletionProvider = CompletionProvider;
//# sourceMappingURL=completionProvider.js.map