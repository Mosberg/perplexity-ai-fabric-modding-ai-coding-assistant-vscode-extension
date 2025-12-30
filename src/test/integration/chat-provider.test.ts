import * as assert from "assert";
import nock from "nock";
import { ChatProvider } from "../../providers/chatProvider";

describe("ChatProvider Integration", () => {
  let chatProvider: ChatProvider;
  const mockAgent = {
    getApiKey: jest.fn().mockResolvedValue("pplx-test-key"),
  };

  beforeEach(() => {
    // Mock dependencies
    chatProvider = new ChatProvider(
      mockAgent as any,
      { request: jest.fn() } as any,
      {
        handleError: jest.fn(),
      } as any
    );
  });

  test("streaming chat response", async () => {
    const chunks = ['data: {"choices":[{"delta":{"content":"Hello"}}]\n\n'];

    nock("https://api.perplexity.ai")
      .post("/chat/completions")
      .reply(200, chunks.join(""), {
        "Content-Type": "text/plain",
      });

    let receivedChunks: string[] = [];
    const fullResponse = await chatProvider.sendMessage("test", (chunk) => {
      receivedChunks.push(chunk);
    });

    assert.ok(fullResponse.includes("Hello"));
    assert.strictEqual(receivedChunks.length, 1);
  });

  test("handles API errors", async () => {
    nock("https://api.perplexity.ai")
      .post("/chat/completions")
      .reply(401, { error: "Unauthorized" });

    const response = await chatProvider.sendMessage("test");
    assert.ok(response.includes("Error"));
  });
});
