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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert = __importStar(require("assert"));
const nock_1 = __importDefault(require("nock"));
const chatProvider_1 = require("../../providers/chatProvider");
describe("ChatProvider Integration", () => {
    let chatProvider;
    const mockAgent = {
        getApiKey: jest.fn().mockResolvedValue("pplx-test-key"),
    };
    beforeEach(() => {
        // Mock dependencies
        chatProvider = new chatProvider_1.ChatProvider(mockAgent, { request: jest.fn() }, {
            handleError: jest.fn(),
        });
    });
    test("streaming chat response", async () => {
        const chunks = ['data: {"choices":[{"delta":{"content":"Hello"}}]\n\n'];
        (0, nock_1.default)("https://api.perplexity.ai")
            .post("/chat/completions")
            .reply(200, chunks.join(""), {
            "Content-Type": "text/plain",
        });
        let receivedChunks = [];
        const fullResponse = await chatProvider.sendMessage("test", (chunk) => {
            receivedChunks.push(chunk);
        });
        assert.ok(fullResponse.includes("Hello"));
        assert.strictEqual(receivedChunks.length, 1);
    });
    test("handles API errors", async () => {
        (0, nock_1.default)("https://api.perplexity.ai")
            .post("/chat/completions")
            .reply(401, { error: "Unauthorized" });
        const response = await chatProvider.sendMessage("test");
        assert.ok(response.includes("Error"));
    });
});
//# sourceMappingURL=chat-provider.test.js.map