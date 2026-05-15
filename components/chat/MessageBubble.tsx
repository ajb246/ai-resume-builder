"use client";

import type { UIMessage } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { Loader2, Search, Sparkles, BarChart2, FileText, Mail } from "lucide-react";

interface MessageBubbleProps {
  message: UIMessage;
}

const TOOL_LABELS: Record<string, { icon: React.ReactNode; running: string; done: string }> = {
  searchJobs: {
    icon: <Search className="w-3.5 h-3.5" />,
    running: "Searching for jobs…",
    done: "Jobs found — check the Job Matches panel →",
  },
  generateResume: {
    icon: <Sparkles className="w-3.5 h-3.5" />,
    running: "Generating optimized resume…",
    done: "Resume generated — check the Generated tab →",
  },
  scoreResume: {
    icon: <BarChart2 className="w-3.5 h-3.5" />,
    running: "Scoring your resume…",
    done: "Resume scored",
  },
  optimizeATS: {
    icon: <FileText className="w-3.5 h-3.5" />,
    running: "Optimizing for ATS…",
    done: "ATS optimization complete",
  },
  generateCoverLetter: {
    icon: <Mail className="w-3.5 h-3.5" />,
    running: "Generating cover letter…",
    done: "Cover letter ready",
  },
};

function ToolCallChip({ part }: { part: Record<string, unknown> }) {
  const toolName = typeof part.type === "string" ? part.type.replace(/^tool-/, "") : "";
  const meta = TOOL_LABELS[toolName];
  const isDone = part.state === "output";
  const icon = meta?.icon ?? <Sparkles className="w-3.5 h-3.5" />;
  const label = isDone
    ? (meta?.done ?? `${toolName} complete`)
    : (meta?.running ?? `Running ${toolName}…`);

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 border border-border rounded-lg px-3 py-2 w-fit">
      {isDone ? (
        <span className="text-blue-400">{icon}</span>
      ) : (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
      )}
      <span>{label}</span>
    </div>
  );
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  const text = message.parts
    .filter((p): p is Extract<typeof p, { type: "text" }> => p.type === "text")
    .map((p) => p.text)
    .join("");

  const toolParts = message.parts
    .map((p) => p as Record<string, unknown>)
    .filter((p) => typeof p.type === "string" && (p.type as string).startsWith("tool-"));

  if (!text && toolParts.length === 0) return null;

  return (
    <div className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-[11px] font-bold text-white mt-0.5">
          AI
        </div>
      )}

      <div className={cn("max-w-[75%] space-y-2", isUser && "items-end flex flex-col")}>
        {/* Tool call chips */}
        {!isUser && toolParts.map((p, i) => (
          <ToolCallChip key={i} part={p} />
        ))}

        {/* Text bubble */}
        {text && (
          <div
            className={cn(
              "rounded-2xl px-4 py-3 text-sm leading-relaxed",
              isUser
                ? "bg-blue-600 text-white rounded-br-sm"
                : "bg-muted text-foreground rounded-bl-sm"
            )}
          >
            {isUser ? (
              <p className="whitespace-pre-wrap">{text}</p>
            ) : (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                  li: ({ children }) => <li>{children}</li>,
                  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                  code: ({ children }) => (
                    <code className="bg-background/50 rounded px-1 py-0.5 text-xs font-mono">
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre className="bg-background/50 rounded-lg p-3 overflow-x-auto text-xs font-mono mb-2">
                      {children}
                    </pre>
                  ),
                  h1: ({ children }) => <h1 className="text-base font-bold mb-2">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-sm font-bold mb-1">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-sm font-semibold mb-1">{children}</h3>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-2 border-blue-500 pl-3 italic my-2">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {text}
              </ReactMarkdown>
            )}
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-7 h-7 rounded-full bg-muted flex-shrink-0 flex items-center justify-center text-[11px] font-bold text-muted-foreground mt-0.5">
          U
        </div>
      )}
    </div>
  );
}
