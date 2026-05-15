import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { jobId, saved = true } = (await req.json()) as {
      jobId: string;
      saved?: boolean;
    };

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    await prisma.job.updateMany({
      where: { externalId: jobId, userId: user.id },
      data: { saved },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[JOBS_SAVE]", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
