import { createOpenAICompatibleAdapter } from "@scui/adapters";
import { SCUIProvider, SCUIRender } from "@scui/react";
import { catalog } from "./catalog";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  throw new Error("VITE_OPENAI_API_KEY is not set");
}

const adapter = createOpenAICompatibleAdapter({
  baseUrl: "https://api.openai.com",
  model: "gpt-5.4",
  headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
})

export function App() {
  return (
    <SCUIProvider adapter={adapter} catalog={catalog} debug>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f5f5f5, #e5ecff)"
        }}
      >
        <SCUIRender
          error={(err) => <div>SCUI failed: {err.message}</div>}
          prompt="Show active users metric, use a dummy value of 123"
          loading={({ status }) => <div>Loading ({status})…</div>}
          skipped={() => <div>No eligible blocks to render.</div>}
        />
      </div>
    </SCUIProvider>
  );
}

