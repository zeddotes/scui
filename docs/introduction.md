# Introduction

SCUI is a schema-driven UI runtime powered by LLMs.

## What it does

- Models produce **structured blocks**, not JSX.
- Blocks are rendered via a **strict, validated catalog** of components.
- Adapters are **transport-only**: they call a model endpoint and return structured data.

## What it does not do (v1)

- Nested layouts or container hierarchies (flat `blocks` only)
- Actions execution
- Agent orchestration or memory

