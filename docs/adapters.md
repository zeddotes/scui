# Adapters

Adapters are transport-only. They do not know about React, catalogs, or components.

## Fetch adapter

```ts
import { createFetchAdapter } from "@scui/adapters";

const adapter = createFetchAdapter({
  url: "/api/scui",
  headers: { Authorization: "Bearer ..." },
  mapRequest: (req) => req,
});
```

## OpenAI-compatible adapter

```ts
import { createOpenAICompatibleAdapter } from "@scui/adapters";

const adapter = createOpenAICompatibleAdapter({
  baseUrl: "https://api.openai.com",
  model: "gpt-5.4",
  headers: { Authorization: "Bearer ..." },
});
```

## Rules

- No auth assumptions (only optional header injection)
- Allow custom headers
- Allow request/response mapping
- Allow custom fetch implementation

## Notes

- The OpenAI-compatible adapter targets the OpenAI Responses API (`/v1/responses`) by default.
- Your model must return JSON matching `{"blocks":[{"component":string,"props":object}]}`. If props don’t match the catalog schema, the block is skipped by the renderer.

## Catalog schema enforcement

The catalog entry’s Zod schema is the source of truth. Rendering validates `block.props` against the entry schema; invalid blocks are skipped.

