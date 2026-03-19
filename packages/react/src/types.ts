import type { SCUIResponse } from "@scui-llm/core";

export type SCUIStatus =
  | "idle"
  | "loading"
  | "streaming"
  | "validating"
  | "ready"
  | "error";

export type SCUIState = {
  status: SCUIStatus;
  partial?: SCUIResponse;
  error?: Error;
};

