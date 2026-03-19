import React from "react";
import type { SCUIResponse } from "@scui-llm/core";

export type SCUITreeInspectorProps = {
  response: SCUIResponse;
};

export function SCUITreeInspector({ response }: SCUITreeInspectorProps) {
  return (
    <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(response.blocks, null, 2)}</pre>
  );
}

export type SCUIRawDebugProps = {
  raw: unknown;
};

export function SCUIRawDebug({ raw }: SCUIRawDebugProps) {
  return <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(raw, null, 2)}</pre>;
}

export type SCUIReplayProps = {
  onReplay: () => void;
  children?: React.ReactNode;
};

export function SCUIReplay({ onReplay, children }: SCUIReplayProps) {
  return (
    <button type="button" onClick={onReplay}>
      {children ?? "Replay"}
    </button>
  );
}

