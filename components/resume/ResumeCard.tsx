"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Resume } from "@prisma/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, MessageSquare, Trash2, BarChart3 } from "lucide-react";

interface ResumeCardProps {
  resume: Resume;
  chatId: string | null;
}

export function ResumeCard({ resume, chatId }: ResumeCardProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this resume? This cannot be undone.")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/resume/${resume.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Resume deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete resume");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-card/50 p-4 gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="shrink-0 w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
          <FileText className="h-5 w-5 text-blue-400" />
        </div>
        <div className="min-w-0">
          <p className="font-medium text-sm truncate">{resume.fileName}</p>
          <p className="text-xs text-muted-foreground">
            Uploaded {formatDate(resume.createdAt)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {resume.score !== null && (
          <div className="flex items-center gap-1 text-xs font-medium text-blue-400">
            <BarChart3 className="h-3.5 w-3.5" />
            {resume.score}
          </div>
        )}
        <Link
          href={`/resume/${resume.id}`}
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-1.5 text-xs")}
        >
          <FileText className="h-3.5 w-3.5" />
          View
        </Link>
        <Link
          href={chatId ? `/chat/${chatId}` : `/resume/${resume.id}`}
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-1.5 text-xs")}
        >
          <MessageSquare className="h-3.5 w-3.5" />
          Chat
        </Link>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "gap-1.5 text-xs text-destructive hover:text-destructive"
          )}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export { Badge };
