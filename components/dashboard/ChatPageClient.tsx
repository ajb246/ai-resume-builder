"use client";

import { useState, useCallback } from "react";
import type { UIMessage } from "@ai-sdk/react";
import type { ParsedResume } from "@/types/resume";
import type { GeneratedResume } from "@/services/resume/generator";
import type { RawJob, JobMatch } from "@/types/job";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { ResumePreview } from "@/components/resume/ResumePreview";
import { JobsPanel } from "@/components/jobs/JobsPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function quickMatch(jobs: RawJob[], skills: string[]): JobMatch[] {
  return jobs.map((job) => {
    const text = `${job.title} ${job.description}`.toLowerCase();
    const matched = skills.filter((s) => text.includes(s.toLowerCase()));
    const score =
      skills.length > 0
        ? Math.min(100, Math.round((matched.length / skills.length) * 100))
        : 50;
    return { ...job, matchScore: score, matchedSkills: matched, missingSkills: [] };
  });
}

interface ChatPageClientProps {
  chatId: string;
  resumeId?: string;
  chatTitle?: string;
  fileName?: string;
  initialMessages: UIMessage[];
  parsedResume: ParsedResume | null;
  initialGeneratedResume: GeneratedResume | null;
}

export function ChatPageClient({
  chatId,
  resumeId,
  chatTitle,
  fileName,
  initialMessages,
  parsedResume,
  initialGeneratedResume,
}: ChatPageClientProps) {
  const [generatedResume, setGeneratedResume] = useState<GeneratedResume | null>(
    initialGeneratedResume
  );
  const [chatJobs, setChatJobs] = useState<JobMatch[]>([]);

  const handleJobsFound = useCallback(
    (rawJobs: RawJob[]) => {
      const skills = parsedResume?.skills ?? [];
      setChatJobs(quickMatch(rawJobs, skills));
    },
    [parsedResume]
  );

  return (
    <div className="flex h-[calc(100vh-0px)] overflow-hidden">
      {/* Chat panel — primary column */}
      <div className="flex flex-col flex-1 min-w-0 border-r border-border">
        {/* Header */}
        <div className="flex items-center px-4 py-3 border-b border-border flex-shrink-0">
          <div className="min-w-0">
            <h1 className="text-sm font-semibold truncate">
              {chatTitle ?? "AI Career Coach"}
            </h1>
            {fileName && (
              <p className="text-[11px] text-muted-foreground truncate">{fileName}</p>
            )}
          </div>
        </div>

        {/* Chat */}
        <div className="flex-1 min-h-0">
          <ChatPanel
            chatId={chatId}
            {...(resumeId ? { resumeId } : {})}
            messages={initialMessages}
            {...(parsedResume ? { parsedResume } : {})}
            onResumeGenerated={setGeneratedResume}
            onJobsFound={handleJobsFound}
          />
        </div>
      </div>

      {/* Right panel — resume + jobs (hidden on mobile) */}
      <div className="hidden lg:flex flex-col w-[380px] flex-shrink-0">
        <Tabs defaultValue="resume" className="flex flex-col h-full">
          <div className="px-3 pt-3 border-b border-border flex-shrink-0">
            <TabsList className="w-full">
              <TabsTrigger value="resume" className="flex-1 text-xs">
                Resume
              </TabsTrigger>
              <TabsTrigger value="jobs" className="flex-1 text-xs">
                Job Matches
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="resume" className="flex-1 min-h-0 mt-0 overflow-hidden">
            {parsedResume ? (
              <ResumePreview
                parsedResume={parsedResume}
                generatedResume={generatedResume}
                {...(resumeId ? { resumeId } : {})}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
                No resume data available
              </div>
            )}
          </TabsContent>

          <TabsContent value="jobs" className="flex-1 min-h-0 mt-0">
            <JobsPanel
              {...(resumeId ? { resumeId } : {})}
              chatJobs={chatJobs}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
