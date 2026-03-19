import React from "react";
import type { SCUIBlock } from "@scui-llm/core";
import type { Catalog } from "@scui-llm/zod";

export type RenderOptions = {
  debug?: boolean;
};

export function renderBlock(
  block: SCUIBlock,
  catalog: Catalog,
  { debug }: RenderOptions = {},
): React.ReactNode {
  const entry = catalog[block.component];
  if (!entry) {
    if (debug) {
      console.warn("[scui] skipped block: unknown component", { component: block.component, block });
    }
    return null;
  }

  const parsed = entry.schema.safeParse(block.props);
  if (!parsed.success) {
    if (debug) {
      console.warn("[scui] skipped block: props failed schema", {
        component: block.component,
        issues: parsed.error.issues,
        props: block.props,
      });
    }
    return null;
  }

  const Comp = entry.component as React.ComponentType<Record<string, unknown>>;
  const props = parsed.data as Record<string, unknown>;
  return <Comp {...props} />;
}

export function renderBlocks(
  blocks: SCUIBlock[],
  catalog: Catalog,
  options: RenderOptions = {},
): React.ReactNode {
  return (
    <>
      {blocks.map((block, idx) => (
        <React.Fragment key={`${block.component}:${idx}`}>
          {renderBlock(block, catalog, options)}
        </React.Fragment>
      ))}
    </>
  );
}

