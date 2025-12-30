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
const http_client_1 = require("../../services/http-client");
const validators_1 = require("../../utils/validators");
/**
 * API integration tests
 */
describe("API Integration", () => {
    const mockApiKey = "pplx-test-key";
    before(() => {
        // Mock secrets storage
        jest.spyOn(global, "navigator", "get").mockReturnValue({
            credentials: {
                get: jest.fn().mockResolvedValue(mockApiKey),
            },
        });
    });
    test("full API call pipeline", async () => {
        (0, nock_1.default)("https://api.perplexity.ai")
            .post("/chat/completions")
            .reply(200, {
            choices: [
                {
                    message: { content: "Generated Fabric entity code" },
                },
            ],
        });
        // Validate key first
        const validation = validators_1.Validators.validateApiKey(mockApiKey);
        assert.strictEqual(validation.valid, true);
        const httpClient = http_client_1.HttpClient.getInstance();
        const response = await httpClient.request("https://api.perplexity.ai/chat/completions", {
            method: "POST",
            headers: { Authorization: `Bearer ${mockApiKey}` },
            body: JSON.stringify({ model: "test", messages: [] }),
        });
        assert.ok(response.choices);
        assert.strictEqual(response.choices[0].message.content, "Generated Fabric entity code");
    });
});
//# sourceMappingURL=api-caller.test.js.map