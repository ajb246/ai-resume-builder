import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ResumeCard } from "@/components/resume/ResumeCard";
import { ResumeUpload } from "@/components/resume/ResumeUpload";

export default async function ResumesPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const resumes = await prisma.resume.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      chats: {
        orderBy: { updatedAt: "desc" },
        take: 1,
        select: { id: true },
      },
    },
  });

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">My Resumes</h1>
        <p className="text-muted-foreground mt-1">
          {resumes.length} resume{resumes.length !== 1 ? "s" : ""}
        </p>
      </div>

      <ResumeUpload />

      {resumes.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Uploaded Resumes</h2>
          {resumes.map((resume) => (
            <ResumeCard
              key={resume.id}
              resume={resume}
              chatId={resume.chats[0]?.id ?? null}
            />
          ))}
        </div>
      )}
    </div>
  );
}
