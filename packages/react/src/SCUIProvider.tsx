import React from "react";
import type { SCUIAdapter } from "@scui/core";
import type { Catalog } from "@scui/zod";
import { SCUIContext } from "./context";

export type SCUIProviderProps = {
  adapter: SCUIAdapter;
  catalog: Catalog;
  children: React.ReactNode;
};

export function SCUIProvider({ adapter, catalog, children }: SCUIProviderProps) {
  const value = React.useMemo(() => ({ adapter, catalog }), [adapter, catalog]);
  return <SCUIContext.Provider value={value}>{children}</SCUIContext.Provider>;
}

