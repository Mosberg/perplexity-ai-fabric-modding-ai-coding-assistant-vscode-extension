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
const validators_1 = require("../../utils/validators");
/**
 * Validators unit tests
 */
describe("Validators", () => {
    describe("validateApiKey", () => {
        test("valid perplexity key", () => {
            const result = validators_1.Validators.validateApiKey("pplx-1234567890abcdef");
            assert.strictEqual(result.valid, true);
        });
        test("invalid - missing pplx-", () => {
            const result = validators_1.Validators.validateApiKey("sk-123");
            assert.strictEqual(result.valid, false);
            assert.ok(result.error?.includes("pplx-"));
        });
        test("empty key", () => {
            const result = validators_1.Validators.validateApiKey("");
            assert.strictEqual(result.valid, false);
        });
    });
    describe("validateModId", () => {
        test("valid mod id", () => {
            assert.strictEqual(validators_1.Validators.validateModId("mana").valid, true);
            assert.strictEqual(validators_1.Validators.validateModId("my_mod_123").valid, true);
        });
        test("invalid characters", () => {
            const result = validators_1.Validators.validateModId("MyMod");
            assert.strictEqual(result.valid, false);
        });
        test("too short", () => {
            const result = validators_1.Validators.validateModId("ab");
            assert.strictEqual(result.valid, false);
        });
    });
    describe("validateClassName", () => {
        test("valid java class", () => {
            assert.strictEqual(validators_1.Validators.validateClassName("CustomEntity").valid, true);
            assert.strictEqual(validators_1.Validators.validateClassName("MyBlock123").valid, true);
        });
        test("invalid - lowercase start", () => {
            const result = validators_1.Validators.validateClassName("customEntity");
            assert.strictEqual(result.valid, false);
        });
    });
});
//# sourceMappingURL=validators.test.js.map