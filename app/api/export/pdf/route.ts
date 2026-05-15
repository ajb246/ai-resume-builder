import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { renderToBuffer } from "@react-pdf/renderer";
import { createElement } from "react";
import { ModernResumePDF } from "@/components/resume/templates/ModernTemplate";
import { MinimalResumePDF } from "@/components/resume/templates/MinimalTemplate";
import { CorporateResumePDF } from "@/components/resume/templates/CorporateTemplate";
import { TechnicalResumePDF } from "@/components/resume/templates/TechnicalTemplate";
import type { GeneratedResume } from "@/services/resume/generator";

const TEMPLATES = {
  modern: ModernResumePDF,
  minimal: MinimalResumePDF,
  corporate: CorporateResumePDF,
  technical: TechnicalResumePDF,
} as const;

type TemplateName = keyof typeof TEMPLATES;

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await req.json()) as { resumeId: string; template?: string };
    const templateKey: TemplateName =
      body.template && body.template in TEMPLATES
        ? (body.template as TemplateName)
        : "modern";

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const resume = await prisma.resume.findFirst({
      where: { id: body.resumeId, userId: user.id },
    });
    if (!resume?.generatedResume) {
      return NextResponse.json({ error: "No generated resume found" }, { status: 404 });
    }

    const TemplateComponent = TEMPLATES[templateKey];
    const element = createElement(TemplateComponent, {
      resume: resume.generatedResume as unknown as GeneratedResume,
    });
    // renderToBuffer expects ReactElement<DocumentProps> — the Document wrapper satisfies this at runtime
    const buffer = await renderToBuffer(element as Parameters<typeof renderToBuffer>[0]);

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="resume-${templateKey}.pdf"`,
      },
    });
  } catch (error) {
    console.error("[EXPORT_PDF]", error);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
