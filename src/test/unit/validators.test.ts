import * as assert from "assert";
import { Validators } from "../../utils/validators";

/**
 * Validators unit tests
 */
describe("Validators", () => {
  describe("validateApiKey", () => {
    test("valid perplexity key", () => {
      const result = Validators.validateApiKey("pplx-1234567890abcdef");
      assert.strictEqual(result.valid, true);
    });

    test("invalid - missing pplx-", () => {
      const result = Validators.validateApiKey("sk-123");
      assert.strictEqual(result.valid, false);
      assert.ok(result.error?.includes("pplx-"));
    });

    test("empty key", () => {
      const result = Validators.validateApiKey("");
      assert.strictEqual(result.valid, false);
    });
  });

  describe("validateModId", () => {
    test("valid mod id", () => {
      assert.strictEqual(Validators.validateModId("mana").valid, true);
      assert.strictEqual(Validators.validateModId("my_mod_123").valid, true);
    });

    test("invalid characters", () => {
      const result = Validators.validateModId("MyMod");
      assert.strictEqual(result.valid, false);
    });

    test("too short", () => {
      const result = Validators.validateModId("ab");
      assert.strictEqual(result.valid, false);
    });
  });

  describe("validateClassName", () => {
    test("valid java class", () => {
      assert.strictEqual(
        Validators.validateClassName("CustomEntity").valid,
        true
      );
      assert.strictEqual(
        Validators.validateClassName("MyBlock123").valid,
        true
      );
    });

    test("invalid - lowercase start", () => {
      const result = Validators.validateClassName("customEntity");
      assert.strictEqual(result.valid, false);
    });
  });
});
