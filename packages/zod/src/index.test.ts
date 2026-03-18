import { describe, it, expect } from "vitest";
import { z } from "zod";
import { defineCatalog, validateCatalog, validateBlockProps } from "./index";

describe("@scui/zod", () => {
  it("defineCatalog preserves object shape", () => {
    const catalog = defineCatalog({
      MetricCard: {
        component: () => null,
        schema: z.object({ label: z.string(), value: z.string() }),
        description: "Displays a metric",
      },
    });

    expect(typeof catalog.MetricCard).toBe("object");
  });

  it("validateCatalog throws for invalid entries", () => {
    expect(() => validateCatalog({ Bad: { component: () => null } })).toThrow();
  });

  it("validateBlockProps parses props", () => {
    const entry = {
      component: () => null,
      schema: z.object({ label: z.string() }),
    };
    const parsed = validateBlockProps(entry, { label: "Users" });
    expect(parsed.success).toBe(true);
  });
});

