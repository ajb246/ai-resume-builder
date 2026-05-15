import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { extractTextFromFile } from "@/services/resume/parser";
import { extractResumeData } from "@/services/resume/extractor";
import { z } from "zod";

const uploadBodySchema = z.object({
  fileUrl: z.string().url(),
  fileName: z.string().min(1),
  mimeType: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (user.subscriptionPlan === "free") {
      const count = await prisma.resume.count({ where: { userId: user.id } });
      if (count >= 1) {
        return NextResponse.json(
          { error: "Upload limit reached. Upgrade to Premium for unlimited uploads." },
          { status: 403 }
        );
      }
    }

    const body = uploadBodySchema.safeParse(await req.json());
    if (!body.success) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
    const { fileUrl, fileName, mimeType } = body.data;

    const fileRes = await fetch(fileUrl);
    if (!fileRes.ok) {
      return NextResponse.json({ error: "Failed to fetch uploaded file" }, { status: 400 });
    }
    const fileBuffer = Buffer.from(await fileRes.arrayBuffer());

    const rawText = await extractTextFromFile(fileBuffer, mimeType);
    const parsedJson = await extractResumeData(rawText);

    const resume = await prisma.resume.create({
      data: {
        userId: user.id,
        fileName,
        fileUrl,
        rawText,
        parsedJson: parsedJson as unknown as import("@prisma/client").Prisma.JsonObject,
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { uploadCount: { increment: 1 } },
    });

    return NextResponse.json({ data: resume });
  } catch (error) {
    console.error("[UPLOAD]", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
