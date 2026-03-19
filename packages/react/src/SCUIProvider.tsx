import React from "react";
import type { SCUIAdapter } from "@scui-llm/core";
import type { Catalog } from "@scui-llm/zod";
import { SCUIContext } from "./context";

export type SCUIProviderProps = {
  adapter: SCUIAdapter;
  catalog: Catalog;
  debug?: boolean;
  children: React.ReactNode;
};

export function SCUIProvider({ adapter, catalog, debug, children }: SCUIProviderProps) {
  const value = React.useMemo(() => ({ adapter, catalog, debug }), [adapter, catalog, debug]);
  return <SCUIContext.Provider value={value}>{children}</SCUIContext.Provider>;
}

