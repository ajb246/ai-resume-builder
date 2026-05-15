import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { generateOptimizedResume } from "@/services/resume/generator";
import { createEmbedding, resumeToEmbeddingText } from "@/services/ai/embeddings";
import type { ParsedResume } from "@/types/resume";
import type { Prisma } from "@prisma/client";
import { z } from "zod";

const schema = z.object({
  resumeId: z.string(),
  targetRole: z.string().min(1),
  conversationContext: z.string(),
});

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = schema.safeParse(await req.json());
    if (!body.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const resume = await prisma.resume.findFirst({
      where: { id: body.data.resumeId, userId: user.id },
    });
    if (!resume) return NextResponse.json({ error: "Resume not found" }, { status: 404 });

    const generated = await generateOptimizedResume(
      resume.parsedJson as unknown as ParsedResume,
      body.data.targetRole,
      body.data.conversationContext
    );

    const updated = await prisma.resume.update({
      where: { id: resume.id },
      data: {
        generatedResume: generated as unknown as Prisma.JsonObject,
        targetRole: body.data.targetRole,
      },
    });

    // Store embedding non-blocking — failure here should not fail the whole request
    const embeddingText = resumeToEmbeddingText(generated);
    createEmbedding(embeddingText)
      .then(async (embedding) => {
        await prisma.$executeRaw`
          UPDATE "Resume"
          SET embedding = ${`[${embedding.join(",")}]`}::vector
          WHERE id = ${resume.id}
        `;
      })
      .catch((err: unknown) => {
        console.error("[EMBEDDING]", err);
      });

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("[GENERATE]", error);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
