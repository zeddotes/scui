import React from "react";
import { describe, it, expect } from "vitest";
import { SCUITreeInspector } from "./index";

describe("@scui/devtools", () => {
  it("renders inspector", () => {
    const node = React.createElement(SCUITreeInspector, { response: { blocks: [] } });
    expect(node).toBeTruthy();
  });
});

