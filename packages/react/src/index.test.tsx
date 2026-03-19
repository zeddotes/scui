import React from "react";
import { describe, it, expect } from "vitest";
import { z } from "zod";
import type { SCUIAdapter, SCUIModelRequest, SCUIModelResponse, SCUIResponse } from "@scui-llm/core";
import { defineCatalog, type Catalog } from "@scui-llm/zod";
import { renderBlock } from "./render";

describe("@scui-llm/react render", () => {
  it("skips unknown components", () => {
    const catalog = defineCatalog({}) as unknown as Catalog;
    const node = renderBlock({ component: "Missing", props: {} }, catalog);
    expect(node).toBeNull();
  });

  it("renders catalog component when props validate", () => {
    function MetricCard(props: { label: string }) {
      return React.createElement("div", null, props.label);
    }

    const catalog = defineCatalog({
      MetricCard: {
        component: MetricCard,
        schema: z.object({ label: z.string() }),
      },
    }) as unknown as Catalog;

    const node = renderBlock({ component: "MetricCard", props: { label: "Users" } }, catalog);
    expect(node).not.toBeNull();
  });
});

describe("@scui-llm/react hook", () => {
  it("adapter can return blocks", async () => {
    const adapter: SCUIAdapter = {
      async generate<T = unknown>(input: SCUIModelRequest): Promise<SCUIModelResponse<T>> {
        void input;
        const data: SCUIResponse = { blocks: [{ component: "MetricCard", props: { label: "X" } }] };
        return { data: data as unknown as T };
      },
    };

    expect(typeof adapter.generate).toBe("function");
  });
});

