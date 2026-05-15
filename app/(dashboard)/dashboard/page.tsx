import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ResumeUpload } from "@/components/resume/ResumeUpload";
import { ResumeCard } from "@/components/resume/ResumeCard";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const resumes = await prisma.resume.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const atFreeLimit = user.subscriptionPlan === "free" && resumes.length >= 1;

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">My Resumes</h1>
        <p className="text-muted-foreground mt-1">
          {user.subscriptionPlan === "free"
            ? `${resumes.length}/1 uploads used · Free plan`
            : `${resumes.length} resume${resumes.length !== 1 ? "s" : ""} · Premium`}
        </p>
      </div>

      {atFreeLimit ? (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-400">
          Free plan limit reached.{" "}
          <Link href="/#pricing" className="underline font-medium">
            Upgrade to Premium
          </Link>{" "}
          for unlimited uploads.
        </div>
      ) : (
        <ResumeUpload />
      )}

      {resumes.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Uploaded Resumes</h2>
          {resumes.map((resume) => (
            <ResumeCard key={resume.id} resume={resume} />
          ))}
        </div>
      )}
    </div>
  );
}
