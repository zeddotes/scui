import React from "react";
import type { SCUIBlock } from "@scui/core";
import type { Catalog } from "@scui/zod";

export function renderBlock(block: SCUIBlock, catalog: Catalog): React.ReactNode {
  const entry = catalog[block.component];
  if (!entry) return null;

  const parsed = entry.schema.safeParse(block.props);
  if (!parsed.success) return null;

  const Comp = entry.component as React.ComponentType<Record<string, unknown>>;
  const props = parsed.data as Record<string, unknown>;
  return <Comp {...props} />;
}

export function renderBlocks(blocks: SCUIBlock[], catalog: Catalog): React.ReactNode {
  return (
    <>
      {blocks.map((block, idx) => (
        <React.Fragment key={`${block.component}:${idx}`}>
          {renderBlock(block, catalog)}
        </React.Fragment>
      ))}
    </>
  );
}

