# Catalog

The catalog is the only place that maps model output (`component`) to real renderable UI.

## Define a catalog

```ts
import { defineCatalog } from "@scui-llm/zod";
import { z } from "zod";

export const catalog = defineCatalog({
  MetricCard: {
    component: MetricCard,
    schema: z.object({
      label: z.string(),
      value: z.union([z.string(), z.number()]).transform((v) => String(v)),
    }),
    description: "Displays a metric",
  },
});
```

## Guarantees

- Every rendered block is validated against the entry schema.
- Missing components or invalid props are skipped.

## Design note

`@scui-llm/zod` intentionally does not depend on React. The React layer is responsible for interpreting `component` as a React component.

