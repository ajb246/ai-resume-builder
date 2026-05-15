import { prisma } from "@/lib/prisma";

interface SimilarityRow {
  id: string;
  similarity: number;
}

export async function findSimilarResumes(
  resumeId: string,
  userId: string,
  limit = 5
): Promise<string[]> {
  const results = await prisma.$queryRaw<SimilarityRow[]>`
    SELECT r.id,
           1 - (r.embedding <=> (
             SELECT embedding FROM "Resume" WHERE id = ${resumeId}
           )) AS similarity
    FROM "Resume" r
    WHERE r."userId" != ${userId}
      AND r.embedding IS NOT NULL
    ORDER BY similarity DESC
    LIMIT ${limit}
  `;
  return results.map((r) => r.id);
}
