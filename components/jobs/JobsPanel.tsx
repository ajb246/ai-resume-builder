"use client";

import { useState, useEffect } from "react";
import { JobCard } from "@/components/jobs/JobCard";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Briefcase, MessageSquare } from "lucide-react";
import type { JobMatch } from "@/types/job";

interface JobsPanelProps {
  resumeId?: string;
  chatJobs?: JobMatch[];
}

export function JobsPanel({ resumeId, chatJobs = [] }: JobsPanelProps) {
  const [fetchedJobs, setFetchedJobs] = useState<JobMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!resumeId) return;
    setLoading(true);
    setError(null);

    fetch(`/api/jobs/recommendations?resumeId=${resumeId}`)
      .then((r) => r.json())
      .then((json: { data?: JobMatch[]; error?: string }) => {
        if (json.error) { setError(json.error); return; }
        setFetchedJobs(json.data ?? []);
      })
      .catch(() => setError("Failed to load job matches"))
      .finally(() => setLoading(false));
  }, [resumeId]);

  // Chat-sourced jobs take priority when present
  const displayJobs = chatJobs.length > 0 ? chatJobs : fetchedJobs;
  const fromChat = chatJobs.length > 0;

  if (!resumeId && chatJobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-center p-6">
        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
          <Briefcase className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium">No resume yet</p>
        <p className="text-xs text-muted-foreground">Upload a resume to get personalized job matches</p>
      </div>
    );
  }

  if (loading && chatJobs.length === 0) {
    return (
      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-sm">Finding matches…</h3>
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-40 rounded-xl" />)}
      </div>
    );
  }

  if (error && chatJobs.length === 0) {
    return (
      <div className="p-4 flex flex-col items-center justify-center h-full gap-3 text-center">
        <Briefcase className="w-6 h-6 text-muted-foreground opacity-40" />
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (displayJobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-center p-6">
        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
          <Briefcase className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium">No matches found</p>
        <p className="text-xs text-muted-foreground">Ask the AI coach to search for jobs, or generate your optimized resume first</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm">
            {fromChat ? "Jobs from your search" : "Job Matches"} ({displayJobs.length})
          </h3>
          {fromChat && (
            <span className="flex items-center gap-1 text-[10px] text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">
              <MessageSquare className="w-2.5 h-2.5" />
              AI search
            </span>
          )}
        </div>
        {displayJobs.map((job) => <JobCard key={job.id} job={job} />)}
      </div>
    </ScrollArea>
  );
}
