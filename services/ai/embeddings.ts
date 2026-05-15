import { openai } from "@/lib/openai";
import type { GeneratedResume } from "@/services/resume/generator";

export async function createEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text.slice(0, 8000),
  });
  return response.data[0]?.embedding ?? [];
}

export function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * (b[i] ?? 0), 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (magnitudeA * magnitudeB);
}

export function resumeToEmbeddingText(resume: GeneratedResume): string {
  const parts = [
    resume.summary ?? "",
    `Skills: ${resume.skills.join(", ")}`,
    ...resume.experience.map(
      (e) => `${e.title} at ${e.company}: ${e.bullets.join(" ")}`
    ),
    ...(resume.atsKeywords.length > 0
      ? [`Keywords: ${resume.atsKeywords.join(", ")}`]
      : []),
  ];
  return parts.join("\n").slice(0, 8000);
}
