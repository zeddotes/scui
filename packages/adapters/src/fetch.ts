import type { SCUIAdapter, SCUIModelRequest, SCUIModelResponse } from "@scui-llm/core";
import type { FetchLike, RequestMapper, ResponseMapper } from "./types";

export type CreateFetchAdapterOptions<T = unknown> = {
  url: string;
  headers?: Record<string, string>;
  fetchImpl?: FetchLike;
  mapRequest?: RequestMapper;
  mapResponse?: ResponseMapper<T>;
};

export function createFetchAdapter<T = unknown>({
  url,
  headers,
  fetchImpl,
  mapRequest,
  mapResponse,
}: CreateFetchAdapterOptions<T>): SCUIAdapter {
  const f: FetchLike = fetchImpl ?? fetch;

  return {
    async generate<U = T>(input: SCUIModelRequest): Promise<SCUIModelResponse<U>> {
      const body = mapRequest ? mapRequest(input) : input;

      const res = await f(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(headers ?? {}),
        },
        body: JSON.stringify(body),
      });

      const rawJson = await res.json().catch(() => null);
      if (mapResponse) {
        return (await mapResponse(res, rawJson)) as unknown as SCUIModelResponse<U>;
      }

      return {
        data: rawJson as U,
        raw: rawJson,
      };
    },
  };
}

