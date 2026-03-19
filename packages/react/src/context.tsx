import React from "react";
import type { SCUIAdapter } from "@scui-llm/core";
import type { Catalog } from "@scui-llm/zod";

export type SCUIContextValue = {
  adapter: SCUIAdapter;
  catalog: Catalog;
  debug?: boolean;
};

export const SCUIContext = React.createContext<SCUIContextValue | null>(null);

export function useSCUIContext(): SCUIContextValue {
  const ctx = React.useContext(SCUIContext);
  if (!ctx) {
    throw new Error("SCUIProvider is missing");
  }
  return ctx;
}

