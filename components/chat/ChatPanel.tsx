"use client";

import { useRef, useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { UIMessage } from "@ai-sdk/react";
import type { ParsedResume } from "@/types/resume";
import type { GeneratedResume } from "@/services/resume/generator";
import type { RawJob } from "@/types/job";
import { Send, AlertCircle, Sparkles, Loader2, X, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ChatPanelProps {
  chatId: string;
  resumeId?: string;
  messages?: UIMessage[];
  parsedResume?: ParsedResume | null;
  onResumeGenerated?: (resume: GeneratedResume) => void;
  onJobsFound?: (jobs: RawJob[]) => void;
}

export function ChatPanel({
  chatId,
  resumeId,
  messages: initialMessages,
  parsedResume,
  onResumeGenerated,
  onJobsFound,
}: ChatPanelProps) {
  const [input, setInput] = useState("");
  const [limitReached, setLimitReached] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzingGap, setIsAnalyzingGap] = useState(false);
  const [showGeneratePanel, setShowGeneratePanel] = useState(false);
  const [targetRole, setTargetRole] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const processedToolCalls = useRef<Set<string>>(new Set());

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { chatId, resumeId },
    }),
    messages: initialMessages ?? [],
    onFinish: async ({ message: finishedMessage }) => {
      try {
        await fetch("/api/chat/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chatId,
            newAssistantMessage: {
              id: finishedMessage.id,
              role: "assistant",
              parts: finishedMessage.parts,
            },
            messages,
          }),
        });
      } catch {
        // non-blocking
      }
    },
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  // Detect searchJobs tool results and surface them to the jobs panel
  useEffect(() => {
    if (!onJobsFound) return;
    for (const message of messages) {
      if (message.role !== "assistant") continue;
      for (const part of message.parts) {
        // Vercel AI SDK v4: tool parts have type "tool-{toolName}", state "output", result in "output"
        const p = part as Record<string, unknown>;
        if (
          typeof p.type === "string" &&
          p.type === "tool-searchJobs" &&
          p.state === "output" &&
          typeof p.toolCallId === "string" &&
          !processedToolCalls.current.has(p.toolCallId)
        ) {
          processedToolCalls.current.add(p.toolCallId);
          const result = p.output as RawJob[];
          if (Array.isArray(result) && result.length > 0) {
            onJobsFound(result);
          }
        }
      }
    }
  }, [messages, onJobsFound]);

  useEffect(() => {
    async function checkLimit() {
      try {
        const res = await fetch("/api/chat/check-limit");
        const json = (await res.json()) as { allowed: boolean };
        if (!json.allowed) setLimitReached(true);
      } catch {
        // non-blocking
      }
    }
    void checkLimit();
  }, []);

  const isStreaming = status === "streaming" || status === "submitted";
  const canSend = input.trim().length > 0 && !isStreaming && !limitReached;

  const visibleMessages = messages.filter((m) => m.role !== "system");
  const hasEnoughContext = visibleMessages.length >= 4;

  const extractConversationContext = () =>
    visibleMessages
      .map((m) => {
        const text = m.parts
          .filter((p): p is Extract<typeof p, { type: "text" }> => p.type === "text")
          .map((p) => p.text)
          .join("");
        return `${m.role}: ${text}`;
      })
      .join("\n");

  const handleSend = () => {
    if (!canSend) return;
    const text = input.trim();
    setInput("");
    sendMessage({ text });
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAnalyzeGap = async () => {
    if (!resumeId || !targetRole.trim()) {
      // Prompt for target role if not set
      const role = prompt("What role are you targeting?");
      if (!role?.trim()) return;
      setTargetRole(role.trim());
      return;
    }
    setIsAnalyzingGap(true);
    try {
      const res = await fetch("/api/chat/analyze-gap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId, targetRole: targetRole.trim() }),
      });
      if (!res.ok) throw new Error("Analysis failed");
      const { data } = (await res.json()) as { data: { analysis: string } };
      sendMessage({ text: `**Career Gap Analysis for "${targetRole}":**\n\n${data.analysis}` });
    } catch {
      toast.error("Analysis failed", { description: "Please try again." });
    } finally {
      setIsAnalyzingGap(false);
    }
  };

  const handleGenerateResume = async () => {
    if (!resumeId || !targetRole.trim()) return;
    setIsGenerating(true);
    setShowGeneratePanel(false);
    try {
      const res = await fetch("/api/generate-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeId,
          targetRole: targetRole.trim(),
          conversationContext: extractConversationContext(),
        }),
      });
      if (!res.ok) throw new Error("Generation failed");
      const { data } = (await res.json()) as {
        data: { generatedResume: GeneratedResume };
      };
      toast.success("Resume generated!", {
        description: "Switch to the Generated tab to preview and export.",
      });
      onResumeGenerated?.(data.generatedResume);
    } catch {
      toast.error("Generation failed", { description: "Please try again." });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {visibleMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center">
              <span className="text-xl">👋</span>
            </div>
            <div>
              <p className="text-sm font-medium">Your AI career coach is ready</p>
              <p className="text-xs text-muted-foreground mt-1">
                Ask about your resume, target roles, or how to improve your chances.
              </p>
            </div>
          </div>
        )}

        {visibleMessages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {isStreaming && <TypingIndicator />}

        {error && (
          <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 rounded-lg px-3 py-2">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Something went wrong. Please try again.</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Generate panel */}
      {showGeneratePanel && (
        <div className="border-t border-border bg-muted/30 px-4 py-3 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium">Generate optimized resume</p>
            <button
              onClick={() => setShowGeneratePanel(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <Input
            placeholder="Target role (e.g. Senior Software Engineer)"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="h-8 text-xs"
            onKeyDown={(e) => {
              if (e.key === "Enter" && targetRole.trim()) void handleGenerateResume();
            }}
            autoFocus
          />
          <Button
            size="sm"
            className="w-full h-8 text-xs bg-blue-600 hover:bg-blue-700"
            onClick={() => void handleGenerateResume()}
            disabled={!targetRole.trim()}
          >
            Generate
          </Button>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-border p-3 space-y-2">
        {hasEnoughContext && !showGeneratePanel && resumeId && (
          <div className="flex gap-1.5">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-8 text-xs border-blue-500/30 text-blue-400 hover:bg-blue-500/10 gap-1.5"
              onClick={() => setShowGeneratePanel(true)}
              disabled={isGenerating || isAnalyzingGap}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Generate Resume
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-8 text-xs border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 gap-1.5"
              onClick={() => void handleAnalyzeGap()}
              disabled={isGenerating || isAnalyzingGap}
            >
              {isAnalyzingGap ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Analyzing…
                </>
              ) : (
                <>
                  <TrendingUp className="w-3.5 h-3.5" />
                  Career Gap
                </>
              )}
            </Button>
          </div>
        )}

        <div className="flex items-end gap-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={limitReached ? "Message limit reached" : "Ask about your resume…"}
            disabled={limitReached || isStreaming}
            rows={1}
            className={cn(
              "resize-none min-h-[40px] max-h-32 overflow-y-auto text-sm",
              "focus-visible:ring-1 focus-visible:ring-blue-500"
            )}
            style={{ height: "40px" }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "40px";
              target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
            }}
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!canSend}
            className="flex-shrink-0 h-10 w-10 bg-blue-600 hover:bg-blue-700 disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground text-center">
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
