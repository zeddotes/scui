import type { SCUIAdapter, SCUIModelRequest, SCUIModelResponse, SCUIResponse } from "@scui/core";
import type { FetchLike, ResponseMapper } from "./types";

export type CreateOpenAICompatibleAdapterOptions<T = SCUIResponse> = {
  baseUrl: string;
  model: string;
  headers?: Record<string, string>;
  fetchImpl?: FetchLike;
  mapResponse?: ResponseMapper<T>;
  endpoint?: "responses";
};

function getNestedString(obj: unknown, path: string[]): string | null {
  let cur: unknown = obj;
  for (const key of path) {
    if (!cur || typeof cur !== "object") return null;
    cur = (cur as Record<string, unknown>)[key];
  }
  return typeof cur === "string" ? cur : null;
}

function extractFirstJsonObject(text: string): unknown | null {
  const start = text.indexOf("{");
  if (start === -1) return null;
  for (let end = text.length - 1; end > start; end--) {
    if (text[end] !== "}") continue;
    const slice = text.slice(start, end + 1);
    try {
      return JSON.parse(slice);
    } catch {
      // keep scanning
    }
  }
  return null;
}

export function createOpenAICompatibleAdapter<T = SCUIResponse>({
  baseUrl,
  model,
  headers,
  fetchImpl,
  mapResponse,
  endpoint = "responses",
}: CreateOpenAICompatibleAdapterOptions<T>): SCUIAdapter {
  const f: FetchLike = fetchImpl ?? fetch;
  const url = `${baseUrl.replace(/\/+$/, "")}/v1/${endpoint}`;

  return {
    async generate<U = T>(input: SCUIModelRequest): Promise<SCUIModelResponse<U>> {
      const system = input.systemPrompt
        ? `System:\n${input.systemPrompt}\n`
        : "System:\nReturn JSON only.\n";
      const user = `User:\n${input.prompt}\n`;

      const schemaHint = input.schema ? `Schema:\n${JSON.stringify(input.schema)}\n` : "";
      const catalogHint =
        input.catalog?.length
          ? `Catalog:\n${JSON.stringify(
              input.catalog.map((c: SCUIModelRequest["catalog"][number]) => ({
                name: c.name,
                description: c.description,
              })),
            )}\n`
          : "";

      const instruction =
        "Respond with JSON matching {\"blocks\":[{\"component\":string,\"props\":object}]}";

      const body = {
        model,
        input: [
          { role: "system", content: `${system}${schemaHint}${catalogHint}${instruction}` },
          { role: "user", content: user },
        ],
        temperature: 0,
      };

      const res = await f(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(headers ?? {}),
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error(`OpenAI API error: ${res.statusText}`);
      }

      const rawJson = await res.json().catch(() => null);
      if (mapResponse) return (await mapResponse(res, rawJson)) as unknown as SCUIModelResponse<U>;

      const choices0 =
        rawJson && typeof rawJson === "object"
          ? ((rawJson as Record<string, unknown>).choices as unknown[] | undefined)?.[0]
          : undefined;

          console.log(choices0)
      const output0 =
        rawJson && typeof rawJson === "object"
          ? ((rawJson as Record<string, unknown>).output as unknown[] | undefined)?.[0]
          : undefined;

          console.log(output0)

      const content =
        getNestedString(choices0, ["message", "content"]) ??
        getNestedString(output0, ["content", "0", "text"]) ??
        "";

          console.log(content)

      const extracted = typeof content === "string" ? extractFirstJsonObject(content) : null;
      const data = (extracted ?? rawJson) as U;

          console.log({ data, raw: rawJson })

      return { data, raw: rawJson };
    },
  };
}

