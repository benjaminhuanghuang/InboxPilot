import { embed, embedMany } from "ai";
import { google } from "@ai-sdk/google";
import { EMBEDDING_DIMENSIONS } from "@/lib/db/schema";

const model = google.embedding("gemini-embedding-001");

type TaskType = "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY";

export async function embedOne(
  value: string,
  taskType: TaskType,
): Promise<number[]> {
  const { embedding } = await embed({
    model,
    value,
    providerOptions: {
      google: { outputDimensionality: EMBEDDING_DIMENSIONS, taskType },
    },
  });
  return embedding;
}

export async function embedBatch(
  values: string[],
  taskType: TaskType,
): Promise<number[][]> {
  if (values.length === 0) return [];
  const { embeddings } = await embedMany({
    model,
    values,
    providerOptions: {
      google: { outputDimensionality: EMBEDDING_DIMENSIONS, taskType },
    },
  });
  return embeddings;
}
