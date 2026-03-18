import { describe, it, expect } from "vitest";
import { createFetchAdapter } from "./fetch";

describe("@scui/adapters", () => {
  it("createFetchAdapter returns adapter", async () => {
    const adapter = createFetchAdapter({
      url: "https://example.invalid",
      fetchImpl: async () =>
        new Response(JSON.stringify({ blocks: [] }), {
          status: 200,
          headers: { "content-type": "application/json" },
        }),
    });

    const out = await adapter.generate({
      prompt: "x",
      schema: {},
      catalog: [],
    });

    expect(out.data).toBeTruthy();
  });
});

