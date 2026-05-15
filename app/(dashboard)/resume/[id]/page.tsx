import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ParsedResumeView } from "@/components/resume/ParsedResumeView";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import type { ParsedResume } from "@/types/resume";
import { MessageSquare, ArrowLeft } from "lucide-react";

export default async function ResumePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const resume = await prisma.resume.findFirst({
    where: { id, userId: user.id },
  });

  if (!resume) notFound();

  const parsed = resume.parsedJson as unknown as ParsedResume;

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-1.5")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <h1 className="text-xl font-bold truncate">{resume.fileName}</h1>
        </div>
        <Link
          href={`/chat/${resume.id}`}
          className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}
        >
          <MessageSquare className="h-4 w-4" />
          Chat with AI
        </Link>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <ParsedResumeView parsed={parsed} />
      </div>
    </div>
  );
}
