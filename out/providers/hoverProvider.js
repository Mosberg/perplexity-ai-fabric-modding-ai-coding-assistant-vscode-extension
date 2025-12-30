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
exports.HoverProvider = void 0;
const vscode = __importStar(require("vscode"));
const vscode_1 = require("vscode");
/**
 * Hover provider for Fabric API documentation and explanations
 */
class HoverProvider {
    constructor(agent) {
        this.agent = agent;
        this.fabricDocs = {
            "Registry.register": "Registers an object in the Minecraft registry system.\n\n``````",
            "Identifier.of": "Creates a Minecraft identifier (namespace:path).\n\n``````",
            "EntityType.Builder": "Builds entity types with dimensions, spawn rules, etc.\n\n``````",
            FabricBlockSettings: "Configures block properties (strength, material, sounds).\n\n``````",
        };
    }
    async provideHover(document, position) {
        const wordRange = document.getWordRangeAtPosition(position, /[a-zA-Z_][a-zA-Z0-9_]*/);
        if (!wordRange) {
            return undefined;
        }
        const word = document.getText(wordRange);
        const doc = this.fabricDocs[word];
        if (doc) {
            return new vscode.Hover(new vscode_1.MarkdownString(doc));
        }
        // AI-powered hover for unknown symbols
        try {
            const codeContext = document.getText(new vscode.Range(Math.max(0, position.line - 5), 0, Math.min(document.lineCount, position.line + 5), document.lineAt(position.line).text.length));
            const explanation = await this.agent.chatCompletion(`Explain this Fabric code: \n\`\`\`java\n${codeContext}\n\`\`\`\nFocus on line with "${word}"`);
            return new vscode.Hover(new vscode_1.MarkdownString(explanation));
        }
        catch {
            return undefined;
        }
    }
}
exports.HoverProvider = HoverProvider;
//# sourceMappingURL=hoverProvider.js.map