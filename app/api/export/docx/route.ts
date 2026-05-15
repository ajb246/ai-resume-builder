import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { generateDocx } from "@/services/resume/exporter";
import type { GeneratedResume } from "@/services/resume/generator";

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await req.json()) as { resumeId: string };

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const resume = await prisma.resume.findFirst({
      where: { id: body.resumeId, userId: user.id },
    });
    if (!resume?.generatedResume) {
      return NextResponse.json({ error: "No generated resume found" }, { status: 404 });
    }

    const buffer = await generateDocx(resume.generatedResume as unknown as GeneratedResume);

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": 'attachment; filename="resume.docx"',
      },
    });
  } catch (error) {
    console.error("[EXPORT_DOCX]", error);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
