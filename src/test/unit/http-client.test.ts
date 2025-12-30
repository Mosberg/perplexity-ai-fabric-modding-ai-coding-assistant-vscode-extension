import * as assert from "assert";
import nock from "nock";
import { HttpClient } from "../../services/http-client";

/**
 * HttpClient unit tests
 */
describe("HttpClient", () => {
  let httpClient: HttpClient;

  beforeEach(() => {
    httpClient = HttpClient.getInstance({ timeout: 5000 });
  });

  test("singleton pattern", () => {
    const client2 = HttpClient.getInstance();
    assert.strictEqual(httpClient, client2);
  });

  test("successful request", async () => {
    nock("https://api.perplexity.ai")
      .post("/chat/completions")
      .reply(200, { choices: [{ message: { content: "test" } }] });

    const response = await httpClient.request(
      "https://api.perplexity.ai/chat/completions",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      }
    );

    assert.ok(response.choices);
  });

  test("handles 404 client error", async () => {
    nock("https://api.perplexity.ai")
      .post("/chat/completions")
      .reply(404, { error: "Not found" });

    await assert.rejects(
      () =>
        httpClient.request("https://api.perplexity.ai/chat/completions", {
          method: "POST",
        }),
      /HTTP 404/
    );
  });

  test("automatic retry on 500", async () => {
    let callCount = 0;
    nock("https://api.perplexity.ai")
      .post("/chat/completions")
      .times(2)
      .reply(500)
      .post("/chat/completions")
      .reply(200, { choices: [{ message: { content: "success" } }] });

    const response = await httpClient.request(
      "https://api.perplexity.ai/chat/completions",
      {
        method: "POST",
        retries: 2,
      }
    );

    assert.strictEqual(callCount, 3); // 2 failures + 1 success
    assert.ok(response.choices);
  });
});
