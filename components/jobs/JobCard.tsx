"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { buttonVariants } from "@/components/ui/button";
import { Bookmark, BookmarkCheck, ExternalLink, MapPin, DollarSign } from "lucide-react";
import type { JobMatch } from "@/types/job";
import { cn } from "@/lib/utils";

export function JobCard({ job }: { job: JobMatch }) {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const scoreColor =
    job.matchScore >= 75
      ? "text-green-400"
      : job.matchScore >= 50
        ? "text-yellow-400"
        : "text-red-400";

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/jobs/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: job.id, saved: !saved }),
      });
      setSaved((s) => !s);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-4 space-y-3 hover:border-blue-500/50 transition-colors">
      {/* Title + bookmark */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{job.title}</p>
          <p className="text-xs text-muted-foreground truncate">{job.company}</p>
        </div>
        <button
          onClick={() => void handleSave()}
          disabled={saving}
          className="shrink-0 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          aria-label={saved ? "Unsave job" : "Save job"}
        >
          {saved ? (
            <BookmarkCheck className="h-4 w-4 text-blue-400" />
          ) : (
            <Bookmark className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Location + salary */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        {job.location && (
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {job.location}
          </span>
        )}
        {job.salary && (
          <span className="flex items-center gap-1">
            <DollarSign className="h-3 w-3" />
            {job.salary}
          </span>
        )}
      </div>

      {/* Match score */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Match score</span>
          <span className={cn("font-bold", scoreColor)}>{job.matchScore}%</span>
        </div>
        <Progress value={job.matchScore} className="h-1.5" />
      </div>

      {/* Missing skills */}
      {job.missingSkills.length > 0 && (
        <div>
          <p className="text-[10px] text-muted-foreground mb-1.5">Missing skills:</p>
          <div className="flex flex-wrap gap-1">
            {job.missingSkills.slice(0, 4).map((s) => (
              <Badge
                key={s}
                variant="outline"
                className="text-[10px] border-red-500/30 text-red-400"
              >
                {s}
              </Badge>
            ))}
            {job.missingSkills.length > 4 && (
              <Badge variant="outline" className="text-[10px] text-muted-foreground">
                +{job.missingSkills.length - 4} more
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Apply link */}
      <a
        href={job.applyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "w-full gap-2 h-7 text-xs"
        )}
      >
        Apply <ExternalLink className="h-3 w-3" />
      </a>
    </Card>
  );
}
