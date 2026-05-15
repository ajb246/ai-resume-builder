import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { JobsPageClient } from "@/components/jobs/JobsPageClient";

export default async function JobsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const all = await prisma.resume.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    select: { id: true, fileName: true, targetRole: true, generatedResume: true },
  });

  // Only show resumes that have been generated
  const resumes = all
    .filter((r) => r.generatedResume !== null)
    .map(({ id, fileName, targetRole }) => ({ id, fileName, targetRole }));

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Job Matches</h1>
        <p className="text-muted-foreground mt-1">
          Personalized job listings matched to your resume
        </p>
      </div>
      <JobsPageClient resumes={resumes} />
    </div>
  );
}
