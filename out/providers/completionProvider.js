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
/**
 * Language server completion provider for Java/Fabric code
 */
class CompletionProvider {
    constructor() { }
    async provideCompletionItems(document, position) {
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
    async getFabricCompletions(_document, _position, prefix) {
        const completions = [];
        // Fabric API completions
        const fabricCompletions = [
            {
                label: "Registry.register",
                kind: vscode_1.CompletionItemKind.Method,
                insertText: 'Registry.register(Registries.${1:registry}, Identifier.of("${2:modid}", "${3:name}"), ${4:value})',
            },
            {
                label: "Identifier.of",
                kind: vscode_1.CompletionItemKind.Method,
                insertText: 'Identifier.of("${1:modid}", "${2:name}")',
            },
            {
                label: "FabricItemGroup.builder",
                kind: vscode_1.CompletionItemKind.Constructor,
                insertText: "FabricItemGroup.builder().icon(${1:item}).build()",
            },
            {
                label: "EntityType.Builder",
                kind: vscode_1.CompletionItemKind.Constructor,
                insertText: 'EntityType.Builder.create(${1:EntityClass}::new, SpawnGroup.${2:CREATURE}).dimensions(${3:0.6f}, ${4:1.8f}).build("${5:id}")',
            },
        ];
        // Context-aware completions based on prefix
        for (const completion of fabricCompletions) {
            if (completion.label.toLowerCase().includes(prefix.toLowerCase().slice(-10))) {
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
exports.CompletionProvider = CompletionProvider;
//# sourceMappingURL=completionProvider.js.map