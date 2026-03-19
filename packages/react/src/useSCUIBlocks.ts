import React from "react";
import type { SCUIBlock, SCUIModelRequest, SCUIResponse } from "@scui-llm/core";
import { useSCUIContext } from "./context";
import type { SCUIState } from "./types";
import { renderBlocks } from "./render";
import { validateBlockProps } from "@scui-llm/zod";

export type UseSCUIBlocksInput = Pick<
  SCUIModelRequest,
  "prompt" | "systemPrompt" | "context"
> & {
  catalog?: SCUIModelRequest["catalog"];
};

export type UseSCUIBlocksResult = {
  ui: React.ReactNode;
  state: SCUIState;
  eligibleBlocks: SCUIBlock[];
  run: () => Promise<SCUIResponse | null>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function isBlock(value: unknown): value is SCUIBlock {
  if (!isRecord(value)) return false;
  return typeof value.component === "string" && isRecord(value.props);
}

export function useSCUIBlocks(input: UseSCUIBlocksInput): UseSCUIBlocksResult {
  const { adapter, catalog, debug } = useSCUIContext();

  const [state, setState] = React.useState<SCUIState>({ status: "idle" });
  const [response, setResponse] = React.useState<SCUIResponse | null>(null);
  const [eligibleBlocks, setEligibleBlocks] = React.useState<SCUIBlock[]>([]);

  const run = React.useCallback(async () => {
    if (debug) {
      console.log("[scui] run()", { prompt: input.prompt, systemPrompt: input.systemPrompt, context: input.context });
    }
    setState({ status: "loading" });
    try {
      const req: SCUIModelRequest = {
        prompt: input.prompt,
        systemPrompt: input.systemPrompt,
        catalog:
          input.catalog ??
          Object.entries(catalog).map(([name, entry]) => ({
            name,
            description: entry.description,
            propsSchema: entry.schema,
          })),
        context: input.context,
      };

      const result = await adapter.generate<SCUIResponse>(req);
      if (debug) {
        console.log("[scui] adapter result", result);
      }
      setState({ status: "validating", partial: result.data });

      const blocks = (() => {
        const data = result.data as unknown;
        if (!isRecord(data)) return [];
        const maybeBlocks = data.blocks;
        if (!Array.isArray(maybeBlocks)) return [];
        return maybeBlocks.filter(isBlock);
      })();

      const normalized: SCUIResponse = { blocks };

      setResponse(normalized);
      const eligible = blocks.filter((b) => {
        const entry = catalog[b.component];
        if (!entry) return false;
        const parsed = validateBlockProps<Record<string, unknown>>(entry, b.props);
        return parsed.success;
      });
      setEligibleBlocks(eligible);
      setState({ status: "ready", partial: normalized });
      return normalized;
    } catch (error) {
      if (debug) {
        console.error("[scui] error", error);
      }
      setState({ status: "error", error: error as Error });
      return null;
    }
  }, [adapter, catalog, debug, input.catalog, input.context, input.prompt, input.systemPrompt]);

  const ui = React.useMemo(() => {
    const blocks = response?.blocks ?? [];
    return renderBlocks(blocks, catalog, { debug });
  }, [catalog, debug, response]);

  React.useEffect(() => {
    if (!debug) return;
    console.log("[scui] state", state);
  }, [debug, state]);

  return { ui, state, eligibleBlocks, run };
}

