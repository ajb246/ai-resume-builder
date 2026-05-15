import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { searchJobs } from "@/services/jobs";
import { matchAndRankJobsWithEmbeddings } from "@/services/jobs/matcher";
import type { GeneratedResume } from "@/services/resume/generator";
import type { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const resumeId = searchParams.get("resumeId");

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const resume = await prisma.resume.findFirst({
      where: { ...(resumeId ? { id: resumeId } : {}), userId: user.id },
    });

    if (!resume?.generatedResume) {
      return NextResponse.json(
        { error: "Generate your resume first before finding job matches." },
        { status: 400 }
      );
    }

    const generated = resume.generatedResume as unknown as GeneratedResume;
    const targetRole = resume.targetRole ?? "software engineer";

    const rawJobs = await searchJobs(targetRole);
    const rankedJobs = await matchAndRankJobsWithEmbeddings(generated, rawJobs, targetRole);

    const top10 = rankedJobs.slice(0, 10);
    await prisma.$transaction(
      top10.map((job) =>
        prisma.job.upsert({
          where: { userId_externalId: { userId: user.id, externalId: job.id } },
          create: {
            user: { connect: { id: user.id } },
            externalId: job.id,
            title: job.title,
            company: job.company,
            location: job.location,
            ...(job.salary ? { salary: job.salary } : {}),
            ...(job.description ? { description: job.description } : {}),
            applyUrl: job.applyUrl,
            matchScore: job.matchScore,
            source: job.source,
          } satisfies Prisma.JobCreateInput,
          update: { matchScore: job.matchScore },
        })
      )
    );

    return NextResponse.json({ data: rankedJobs });
  } catch (error) {
    console.error("[JOBS]", error);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}
