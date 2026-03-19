import React from "react";
import { useSCUIBlocks } from "./useSCUIBlocks";
import type { SCUIState } from "./types";

export type SCUIRenderProps = {
  prompt: string;
  loading?: (info: Pick<SCUIState, "status" | "partial">) => React.ReactNode;
  error?: (err: Error) => React.ReactNode;
  skipped?: (info: { partial?: SCUIState["partial"] }) => React.ReactNode;
};

export function SCUIRender({ prompt, loading, error, skipped }: SCUIRenderProps) {
  const { ui, state, eligibleBlocks, run } = useSCUIBlocks({ prompt });
  
  React.useEffect(() => {
    void run();
  }, [run]);

  if (state.status === "loading" || state.status === "streaming" || state.status === "validating") {
    return <>{loading ? loading({ status: state.status, partial: state.partial }) : null}</>;
  }
  
  if (state.status === "error") {
    return <>{error ? error(state.error ?? new Error("Unknown SCUI error")) : null}</>;
  }

  if (state.status === "ready" && (state.partial?.blocks?.length ?? 0) > 0 && eligibleBlocks.length === 0) {
    return <>{skipped ? skipped({ partial: state.partial }) : null}</>;
  }

  return ui;
}
