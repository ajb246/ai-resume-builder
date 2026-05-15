"use client";

import { useState } from "react";
import { JobCard } from "@/components/jobs/JobCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Briefcase, RefreshCw } from "lucide-react";
import type { JobMatch } from "@/types/job";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface Resume {
  id: string;
  fileName: string;
  targetRole: string | null;
}

interface JobsPageClientProps {
  resumes: Resume[];
}

export function JobsPageClient({ resumes }: JobsPageClientProps) {
  const [selectedId, setSelectedId] = useState(resumes[0]?.id ?? "");
  const [jobs, setJobs] = useState<JobMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetched, setFetched] = useState(false);

  if (resumes.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground space-y-3">
        <Briefcase className="h-10 w-10 mx-auto opacity-40" />
        <p className="font-medium">No generated resumes yet</p>
        <p className="text-sm">Upload a resume and generate an optimized version first.</p>
        <Link href="/dashboard" className={cn(buttonVariants({ variant: "outline" }), "mt-2")}>
          Go to Dashboard
        </Link>
      </div>
    );
  }

  async function fetchJobs() {
    setLoading(true);
    setError(null);
    setFetched(false);
    try {
      const res = await fetch(`/api/jobs/recommendations?resumeId=${selectedId}`);
      const json = (await res.json()) as { data?: JobMatch[]; error?: string };
      if (json.error) { setError(json.error); return; }
      setJobs(json.data ?? []);
      setFetched(true);
    } catch {
      setError("Failed to load job matches. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Resume selector + search button */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <select
          value={selectedId}
          onChange={(e) => { setSelectedId(e.target.value); setFetched(false); setJobs([]); }}
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {resumes.map((r) => (
            <option key={r.id} value={r.id}>
              {r.fileName}{r.targetRole ? ` — ${r.targetRole}` : ""}
            </option>
          ))}
        </select>
        <Button
          onClick={() => void fetchJobs()}
          disabled={loading || !selectedId}
          className="gap-2 bg-blue-600 hover:bg-blue-700 shrink-0"
        >
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          {loading ? "Searching…" : fetched ? "Refresh" : "Find Jobs"}
        </Button>
      </div>

      {/* Results */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-36 rounded-xl" />)}
        </div>
      )}

      {error && (
        <div className="text-center py-8 text-muted-foreground text-sm">{error}</div>
      )}

      {fetched && !loading && jobs.length === 0 && (
        <div className="text-center py-8 text-muted-foreground text-sm">
          No job matches found. Try a different resume.
        </div>
      )}

      {jobs.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">{jobs.length} matches found</p>
          {jobs.map((job) => <JobCard key={job.id} job={job} />)}
        </div>
      )}

      {!fetched && !loading && (
        <div className="text-center py-16 text-muted-foreground">
          <Briefcase className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Select a resume and click Find Jobs</p>
        </div>
      )}
    </div>
  );
}
