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
const http_client_1 = require("../../services/http-client");
const nock_1 = __importDefault(require("nock"));
/**
 * HttpClient unit tests
 */
describe("HttpClient", () => {
    let httpClient;
    beforeEach(() => {
        httpClient = http_client_1.HttpClient.getInstance({ timeout: 5000 });
    });
    test("singleton pattern", () => {
        const client2 = http_client_1.HttpClient.getInstance();
        assert.strictEqual(httpClient, client2);
    });
    test("successful request", async () => {
        (0, nock_1.default)("https://api.perplexity.ai")
            .post("/chat/completions")
            .reply(200, { choices: [{ message: { content: "test" } }] });
        const response = await httpClient.request("https://api.perplexity.ai/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: "{}",
        });
        assert.ok(response.choices);
    });
    test("handles 404 client error", async () => {
        (0, nock_1.default)("https://api.perplexity.ai")
            .post("/chat/completions")
            .reply(404, { error: "Not found" });
        await assert.rejects(() => httpClient.request("https://api.perplexity.ai/chat/completions", {
            method: "POST",
        }), /HTTP 404/);
    });
    test("automatic retry on 500", async () => {
        let callCount = 0;
        (0, nock_1.default)("https://api.perplexity.ai")
            .post("/chat/completions")
            .times(2)
            .reply(500)
            .post("/chat/completions")
            .reply(200, { choices: [{ message: { content: "success" } }] });
        const response = await httpClient.request("https://api.perplexity.ai/chat/completions", {
            method: "POST",
            retries: 2,
        });
        assert.strictEqual(callCount, 3); // 2 failures + 1 success
        assert.ok(response.choices);
    });
});
//# sourceMappingURL=http-client.test.js.map