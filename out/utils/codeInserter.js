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
exports.CodeInserter = void 0;
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const vscode = __importStar(require("vscode"));
/**
 * Smart code insertion and file creation
 */
class CodeInserter {
    /**
     * Insert code at cursor or create new file
     */
    static async insertCode(code) {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            // Insert at cursor
            await editor.edit((builder) => {
                builder.insert(editor.selection.active, code + "\n\n");
            });
            await vscode.commands.executeCommand("editor.action.formatDocument");
        }
        else {
            // Create new untitled document
            await this.createUntitledDocument(code);
        }
    }
    /**
     * Create file at specific path
     */
    static async createFile(uri, content) {
        try {
            const dirPath = path.dirname(uri.fsPath);
            await fs.mkdir(dirPath, { recursive: true });
            await fs.writeFile(uri.fsPath, content, this.ENCODING);
            const doc = await vscode.workspace.openTextDocument(uri);
            await vscode.window.showTextDocument(doc, { preview: false });
        }
        catch (error) {
            throw new Error(`Failed to create file: ${error}`);
        }
    }
    static async createUntitledDocument(code) {
        const language = this.detectLanguage(code);
        const doc = await vscode.workspace.openTextDocument({
            content: code,
            language,
        });
        await vscode.window.showTextDocument(doc);
    }
    static detectLanguage(code) {
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
exports.CodeInserter = CodeInserter;
CodeInserter.ENCODING = "utf8";
//# sourceMappingURL=codeInserter.js.map