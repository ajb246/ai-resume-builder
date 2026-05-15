"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import { UploadCloud, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const ACCEPTED_TYPES = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "text/plain": [".txt"],
};

export function ResumeUpload() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [stage, setStage] = useState<"idle" | "uploading" | "parsing">("idle");

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setIsProcessing(true);
      setStage("uploading");

      try {
        const formData = new FormData();
        formData.append("file", file);

        setStage("parsing");

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (res.status === 403) {
          const { error } = (await res.json()) as { error: string };
          toast.error("Upload limit reached", { description: error });
          return;
        }

        if (!res.ok) {
          const { error } = (await res.json()).catch?.(() => ({})) ?? {};
          throw new Error(error ?? "Upload processing failed");
        }

        const { data } = (await res.json()) as { data: { resume: { id: string }; chatId: string } };
        toast.success("Resume uploaded!", {
          description: "AI is ready to analyze your resume.",
        });
        router.push(`/chat/${data.chatId}`);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Please try again.";
        toast.error("Upload failed", { description: msg });
      } finally {
        setIsProcessing(false);
        setStage("idle");
      }
    },
    [router]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxFiles: 1,
    disabled: isProcessing,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all",
        isDragActive
          ? "border-blue-500 bg-blue-500/5"
          : "border-border hover:border-blue-500/50 hover:bg-muted/50",
        isProcessing && "pointer-events-none opacity-70"
      )}
    >
      <input {...getInputProps()} />

      <div className="flex flex-col items-center gap-4">
        {isProcessing ? (
          <>
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
            <p className="text-lg font-medium">
              {stage === "uploading"
                ? "Uploading your resume..."
                : "AI is analyzing your resume..."}
            </p>
            <p className="text-sm text-muted-foreground">This takes about 10–15 seconds</p>
          </>
        ) : (
          <>
            <UploadCloud
              className={cn(
                "h-12 w-12",
                isDragActive ? "text-blue-500" : "text-muted-foreground"
              )}
            />
            <div>
              <p className="text-lg font-medium">
                {isDragActive ? "Drop your resume here" : "Drop your resume or click to upload"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">PDF, DOCX, or TXT · Max 4MB</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
