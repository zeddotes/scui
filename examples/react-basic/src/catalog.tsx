import { defineCatalog } from "@scui/zod";
import { z } from "zod";

function MetricCard(props: { label: string; value: number }) {
  console.log("metric card", props)
  return (
    <div
      style={{
        padding: "12px 16px",
        borderRadius: 8,
        border: "1px solid #e2e2e2",
        display: "inline-block",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        backgroundColor: "#ffffff"
      }}
    >
      <div style={{ fontSize: 12, color: "#666" }}>{props.label}</div>
      <div style={{ fontSize: 20, fontWeight: 600 }}>{props.value}</div>
    </div>
  );
}

export const catalog = defineCatalog({
  MetricCard: {
    component: MetricCard,
    schema: z.object({
      label: z.string(),
      value: z.number()
    }),
    description: "Displays a metric"
  }
});

