import React from "react";
import { useSCUIBlocks } from "./useSCUIBlocks";
import type { SCUIState } from "./types";

export type SCUIRenderProps = {
  prompt: string;
  fallback?: React.ReactNode;
  loading?: (info: Pick<SCUIState, "status" | "partial">) => React.ReactNode;
  error?: (err: Error) => React.ReactNode;
};

export function SCUIRender({ prompt, fallback = null, loading, error }: SCUIRenderProps) {
  const { ui, state, run } = useSCUIBlocks({ prompt, schema: {} });
  const hasRunRef = React.useRef(false);
  console.log("state", state)
  React.useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;
    void run();
  }, [run]);

  if (state.status === "loading" || state.status === "streaming" || state.status === "validating") {
    return <>{loading ? loading({ status: state.status, partial: state.partial }) : fallback}</>;
  }
  
  if (state.status === "error") {
    return <>{error ? error(state.error ?? new Error("Unknown SCUI error")) : null}</>;
  }

  return <>{ui}</>;
}

