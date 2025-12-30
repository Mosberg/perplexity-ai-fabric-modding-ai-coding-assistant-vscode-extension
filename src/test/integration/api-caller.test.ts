import * as assert from "assert";
import nock from "nock";
import { HttpClient } from "../../services/http-client";
import { Validators } from "../../utils/validators";

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
    } as any);
  });

  test("full API call pipeline", async () => {
    nock("https://api.perplexity.ai")
      .post("/chat/completions")
      .reply(200, {
        choices: [
          {
            message: { content: "Generated Fabric entity code" },
          },
        ],
      });

    // Validate key first
    const validation = Validators.validateApiKey(mockApiKey);
    assert.strictEqual(validation.valid, true);

    const httpClient = HttpClient.getInstance();
    const response = await httpClient.request(
      "https://api.perplexity.ai/chat/completions",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${mockApiKey}` },
        body: JSON.stringify({ model: "test", messages: [] }),
      }
    );

    assert.ok(response.choices);
    assert.strictEqual(
      response.choices[0].message.content,
      "Generated Fabric entity code"
    );
  });
});
