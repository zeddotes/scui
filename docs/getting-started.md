# Getting Started

Install:

```bash
bun add @scui-llm/react @scui-llm/core @scui-llm/adapters @scui-llm/zod
```

Define a catalog:

```ts
import { z } from "zod";
import { defineCatalog } from "@scui-llm/zod";

function MetricCard(props: { label: string; value: string }) {
  return <div>{props.label}: {props.value}</div>;
}

export const catalog = defineCatalog({
  MetricCard: {
    component: MetricCard,
    schema: z.object({
      label: z.string(),
      value: z.number(),
    }),
    description: "Displays a metric",
  },
});
```

Wire up the provider:

```tsx
import { SCUIProvider } from "@scui-llm/react";
import { createFetchAdapter } from "@scui-llm/adapters";
import { catalog } from "./catalog";

const adapter = createFetchAdapter({ url: "/api/scui" });

export function App() {
  return (
    <SCUIProvider adapter={adapter} catalog={catalog}>
      {/* your app */}
    </SCUIProvider>
  );
}
```

## Development workflow

Before running any node-based tooling (including `bun run build/test/lint`), run:

```bash
nvm use
```

