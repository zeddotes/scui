import React from "react";
import type { SCUIBlock, SCUIModelRequest, SCUIResponse } from "@scui/core";
import { useSCUIContext } from "./context";
import type { SCUIState } from "./types";
import { renderBlocks } from "./render";

export type UseSCUIBlocksInput = Pick<
  SCUIModelRequest,
  "prompt" | "systemPrompt" | "schema" | "context"
> & {
  catalog?: SCUIModelRequest["catalog"];
};

export type UseSCUIBlocksResult = {
  ui: React.ReactNode;
  state: SCUIState;
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
  const { adapter, catalog } = useSCUIContext();

  const [state, setState] = React.useState<SCUIState>({ status: "idle" });
  const [response, setResponse] = React.useState<SCUIResponse | null>(null);

  const run = React.useCallback(async () => {
    setState({ status: "loading" });
    try {
      const req: SCUIModelRequest = {
        prompt: input.prompt,
        systemPrompt: input.systemPrompt,
        schema: input.schema ?? {},
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
      setState({ status: "ready", partial: normalized });
      return normalized;
    } catch (error) {
      setState({ status: "error", error: error as Error });
      return null;
    }
  }, [adapter, catalog, input.catalog, input.context, input.prompt, input.schema, input.systemPrompt]);

  const ui = React.useMemo(() => {
    const blocks = response?.blocks ?? [];
    return renderBlocks(blocks, catalog);
  }, [catalog, response]);

  return { ui, state, run };
}

