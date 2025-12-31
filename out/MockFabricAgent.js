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
const assert = __importStar(require("assert"));
const vscode = __importStar(require("vscode"));
const hoverProvider_1 = require("./providers/hoverProvider");
// Mock FabricAgent with controllable chatCompletion
class MockFabricAgent {
    constructor(response) {
        this.response = response;
        this.chatCompletion = async (_prompt) => {
            if (typeof this.response === "function") {
                // Simulate error if function throws
                return await this.response();
            }
            return this.response;
        };
    }
}
// Helper to create a mock TextDocument
function createMockDocument(text) {
    const uri = vscode.Uri.parse("untitled:Test.java");
    // @ts-ignore
    return {
        uri,
        getText: (range) => {
            if (!range) {
                return text;
            }
            const lines = text.split("\n");
            const start = range.start.line;
            const end = range.end.line;
            let selected = lines.slice(start, end + 1);
            // If range is single line, slice columns
            if (start === end) {
                selected[0] = selected[0].substring(range.start.character, range.end.character);
            }
            return selected.join("\n");
        },
        lineAt: (line) => ({
            text: text.split("\n")[line] || "",
        }),
        lineCount: text.split("\n").length,
        getWordRangeAtPosition: (position, regex) => {
            const line = text.split("\n")[position.line] || "";
            let match = null;
            if (regex) {
                let r = new RegExp(regex, "g");
                let m;
                while ((m = r.exec(line))) {
                    if (position.character >= m.index &&
                        position.character <= m.index + m[0].length) {
                        match = m;
                        break;
                    }
                }
            }
            if (!match) {
                return undefined;
            }
            return new vscode.Range(position.line, match.index, position.line, match.index + match[0].length);
        },
    };
}
suite("HoverProvider", () => {
    test("Returns Fabric API doc hover for known symbol", async () => {
        const agent = new MockFabricAgent(undefined);
        const provider = new hoverProvider_1.HoverProvider(agent);
        const doc = createMockDocument("Registry.register();");
        const pos = new vscode.Position(0, 2); // On 'Registry'
        // Patch getWordRangeAtPosition to always return 'Registry.register'
        doc.getWordRangeAtPosition = () => new vscode.Range(0, 0, 0, 16);
        doc.getText = () => "Registry.register";
        const hover = await provider.provideHover(doc, pos);
        assert.ok(hover, "Hover should be returned");
        assert.ok(hover.contents[0].value.includes("Registers an object"), "Should contain Fabric doc");
    });
    test("Returns AI explanation for unknown symbol", async () => {
        const agent = new MockFabricAgent("This is an AI explanation.");
        const provider = new hoverProvider_1.HoverProvider(agent);
        const doc = createMockDocument("SomeUnknownSymbol();");
        const pos = new vscode.Position(0, 2);
        // Patch getWordRangeAtPosition to always return 'SomeUnknownSymbol'
        doc.getWordRangeAtPosition = () => new vscode.Range(0, 0, 0, 17);
        doc.getText = (range) => range ? "SomeUnknownSymbol" : "SomeUnknownSymbol();";
        const hover = await provider.provideHover(doc, pos);
        assert.ok(hover, "Hover should be returned");
        assert.ok(hover.contents[0].value.includes("AI explanation"), "Should contain AI explanation");
    });
    test("Returns undefined if no symbol at position", async () => {
        const agent = new MockFabricAgent(undefined);
        const provider = new hoverProvider_1.HoverProvider(agent);
        const doc = createMockDocument("   ");
        const pos = new vscode.Position(0, 1);
        doc.getWordRangeAtPosition = () => undefined;
        const hover = await provider.provideHover(doc, pos);
        assert.strictEqual(hover, undefined, "Should return undefined for no symbol");
    });
    test("Returns undefined if AI returns empty/undefined", async () => {
        const agent = new MockFabricAgent("");
        const provider = new hoverProvider_1.HoverProvider(agent);
        const doc = createMockDocument("FooBar();");
        const pos = new vscode.Position(0, 2);
        doc.getWordRangeAtPosition = () => new vscode.Range(0, 0, 0, 6);
        doc.getText = (range) => (range ? "FooBar" : "FooBar();");
        const hover = await provider.provideHover(doc, pos);
        assert.strictEqual(hover, undefined, "Should return undefined for empty AI response");
    });
    test("Returns undefined if AI throws error", async () => {
        const agent = new MockFabricAgent(() => {
            throw new Error("AI error");
        });
        const provider = new hoverProvider_1.HoverProvider(agent);
        const doc = createMockDocument("BazQux();");
        const pos = new vscode.Position(0, 2);
        doc.getWordRangeAtPosition = () => new vscode.Range(0, 0, 0, 6);
        doc.getText = (range) => (range ? "BazQux" : "BazQux();");
        const hover = await provider.provideHover(doc, pos);
        assert.strictEqual(hover, undefined, "Should return undefined on AI error");
    });
});
//# sourceMappingURL=MockFabricAgent.js.map