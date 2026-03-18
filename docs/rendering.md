# Rendering

SCUI renders a flat list of validated blocks.

## Renderer behavior

- If a block's `component` is not in the catalog: it is skipped.
- If props fail schema validation: it is skipped.
- Otherwise the catalog component is rendered with parsed props.

## Loading state

The React layer exposes a simple state machine:

```ts
type SCUIState = {
  status: "idle" | "loading" | "streaming" | "validating" | "ready" | "error";
  partial?: { blocks: { component: string; props: Record<string, unknown> }[] };
  error?: Error;
};
```

## v1 constraints

- Flat blocks only (no nested layouts)
- No actions execution

## Common failure mode

If your model returns a value with a different type than your schema expects (e.g. `value: 123` but schema requires `z.string()`), validation fails and the block is skipped. Use schema coercion (e.g. `z.union([z.string(), z.number()]).transform(String)`) when you want to accept multiple encodings.

