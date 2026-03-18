export type SCUIBlock = {
  component: string;
  props: Record<string, unknown>;
};

export type SCUIResponse = {
  blocks: SCUIBlock[];
};

export type SCUIModelRequest = {
  prompt: string;
  systemPrompt?: string;
  schema: unknown;
  catalog: {
    name: string;
    description?: string;
    propsSchema?: unknown;
  }[];
  context?: Record<string, unknown>;
};

export type SCUIModelResponse<T = unknown> = {
  data: T;
  raw?: unknown;
};

export interface SCUIAdapter {
  generate<T = unknown>(input: SCUIModelRequest): Promise<SCUIModelResponse<T>>;
}

export class SCUIAdapterError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
    this.name = "SCUIAdapterError";
  }
}

export class SCUIValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SCUIValidationError";
  }
}

export type ExecuteOptions = {
  adapter: SCUIAdapter;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function isBlockLike(value: unknown): value is { component: unknown; props: unknown } {
  return isRecord(value) && "component" in value && "props" in value;
}

export async function executeSCUIRequest(
  request: SCUIModelRequest,
  { adapter }: ExecuteOptions,
): Promise<SCUIResponse> {
  let result: SCUIModelResponse<unknown>;
  try {
    result = await adapter.generate(request);
  } catch (error) {
    throw new SCUIAdapterError("SCUI adapter failed to generate response", error);
  }

  const data = result.data;
  if (!isRecord(data) || !Array.isArray(data.blocks)) {
    throw new SCUIValidationError("Adapter result.data must contain a blocks array");
  }

  const blocks = data.blocks
    .filter(isBlockLike)
    .map((block) => ({
      component: String(block.component),
      props: isRecord(block.props) ? block.props : {},
    }));

  return { blocks };
}

