import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { extractTextFromFile } from "@/services/resume/parser";
import { extractResumeData } from "@/services/resume/extractor";
import { buildResumeContextMessage } from "@/services/ai/prompts";
import { uploadRateLimit, checkRateLimit } from "@/lib/ratelimit";
import { UTApi } from "uploadthing/server";
import type { Prisma } from "@prisma/client";

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
]);

const MAX_FILE_SIZE_BYTES = 4 * 1024 * 1024;

function validateMagicBytes(buffer: Buffer, mimeType: string): boolean {
  if (mimeType === "application/pdf") {
    return buffer.slice(0, 4).toString() === "%PDF";
  }
  if (mimeType.includes("wordprocessingml")) {
    return buffer[0] === 0x50 && buffer[1] === 0x4b;
  }
  return true;
}

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { success, reset } = await checkRateLimit(uploadRateLimit, clerkId);
    if (!success) {
      return NextResponse.json(
        { error: "Too many uploads. Please wait before uploading again." },
        { status: 429, headers: { "Retry-After": String(Math.ceil(((reset ?? Date.now() + 3600000) - Date.now()) / 1000)) } }
      );
    }

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const mimeType = file.type;
    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      return NextResponse.json({ error: "File type not supported. Use PDF, DOCX, or TXT." }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    if (fileBuffer.length > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: "File too large (max 4MB)" }, { status: 400 });
    }

    if (!validateMagicBytes(fileBuffer, mimeType)) {
      return NextResponse.json({ error: "Invalid file content" }, { status: 400 });
    }

    // Upload to UploadThing server-side (bypasses the broken dev-mode client callback)
    const utapi = new UTApi();
    const uploadResult = await utapi.uploadFiles(
      new File([fileBuffer], file.name, { type: mimeType })
    );

    if (uploadResult.error) {
      console.error("[UPLOAD] UploadThing error:", uploadResult.error);
      return NextResponse.json({ error: "File storage failed" }, { status: 500 });
    }

    const fileUrl = uploadResult.data.ufsUrl;
    const fileName = file.name;

    const rawText = await extractTextFromFile(fileBuffer, mimeType);
    const parsedJson = await extractResumeData(rawText);

    const resume = await prisma.resume.create({
      data: {
        userId: user.id,
        fileName,
        fileUrl,
        rawText,
        parsedJson: parsedJson as unknown as Prisma.JsonObject,
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { uploadCount: { increment: 1 } },
    });

    const systemContextMessage = {
      id: crypto.randomUUID(),
      role: "system",
      parts: [{ type: "text", text: buildResumeContextMessage(parsedJson) }],
    };

    const chat = await prisma.chat.create({
      data: {
        userId: user.id,
        resumeId: resume.id,
        title: `Chat for ${fileName}`,
        messages: [systemContextMessage] as Prisma.JsonArray,
      },
    });

    return NextResponse.json({ data: { resume, chatId: chat.id } });
  } catch (error) {
    console.error("[UPLOAD]", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
