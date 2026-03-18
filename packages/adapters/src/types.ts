import type { SCUIModelRequest, SCUIModelResponse } from "@scui/core";

export type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export type RequestMapper = (input: SCUIModelRequest) => unknown;
export type ResponseMapper<T> = (response: Response, rawJson: unknown) => Promise<SCUIModelResponse<T>>;

