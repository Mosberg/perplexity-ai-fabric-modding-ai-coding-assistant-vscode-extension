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
const fabricConfig_1 = require("./fabricConfig");
const templateManager_1 = require("./templateManager");
class CodeInserter {
    /**
     * Insert code at cursor or create new untitled document
     */
    static async insertCode(code) {
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
        }
        else {
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
    static async createFile(workspaceFolder, relativePath, content) {
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
        }
        catch (error) {
            const err = error;
            throw new Error(`Failed to create ${relativePath}: ${err.message}`);
        }
    }
    /**
     * Create complete Fabric mod project structure
     */
    static async createModProject(workspaceFolder, modId, modName) {
        const config = fabricConfig_1.FabricConfigManager.getConfig();
        // Core files
        const files = [
            {
                path: `src/main/java/${config.packageName.replace(/\./g, '/')}/ModInitializer.java`,
                content: templateManager_1.TemplateManager.getModInitializer(modId, config.packageName)
            },
            {
                path: 'gradle.properties',
                content: templateManager_1.TemplateManager.getGradleProperties(config)
            },
            {
                path: 'build.gradle',
                content: templateManager_1.TemplateManager.getBuildGradle(config)
            },
            {
                path: 'src/main/resources/fabric.mod.json',
                content: templateManager_1.TemplateManager.getFabricModJson(modId, modName)
            },
            {
                path: 'src/main/resources/META-INF/mods.toml',
                content: templateManager_1.TemplateManager.getModsToml(modId, modName)
            }
        ];
        // Create all files
        for (const file of files) {
            if (typeof file.content === 'string') {
                await this.createFile(workspaceFolder, file.path, file.content);
            }
            else {
                throw new Error(`File content for ${file.path} is not a string.`);
            }
        }
        vscode.window.showInformationMessage(`✅ Fabric mod "${modId}" created! Run ./gradlew genSources`);
    }
    /**
     * Insert code block with proper formatting
     */
    static async insertFormatted(code, title) {
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
exports.CodeInserter = CodeInserter;
CodeInserter.ENCODING = 'utf-8';
//# sourceMappingURL=codeInserter.js.map