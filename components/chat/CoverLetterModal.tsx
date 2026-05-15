"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Copy, Download, Check } from "lucide-react";
import { toast } from "sonner";
import type { GeneratedResume } from "@/services/resume/generator";

interface CoverLetterModalProps {
  open: boolean;
  onClose: () => void;
  resume: GeneratedResume;
}

export function CoverLetterModal({ open, onClose, resume }: CoverLetterModalProps) {
  const [jobDescription, setJobDescription] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!jobDescription.trim()) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume,
          jobDescription: jobDescription.trim(),
          ...(companyName.trim() ? { companyName: companyName.trim() } : {}),
        }),
      });
      if (!res.ok) throw new Error("Generation failed");
      const { data } = (await res.json()) as { data: string };
      setCoverLetter(data);
    } catch {
      toast.error("Cover letter generation failed");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([coverLetter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cover-letter.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm">Generate Cover Letter</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Company name (optional)</label>
            <Input
              placeholder="e.g. Acme Corp"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="h-8 text-xs"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Job description *</label>
            <Textarea
              placeholder="Paste the job description here…"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={5}
              className="text-xs resize-none"
            />
          </div>

          <Button
            size="sm"
            className="w-full bg-blue-600 hover:bg-blue-700 text-xs"
            onClick={() => void handleGenerate()}
            disabled={!jobDescription.trim() || generating}
          >
            {generating ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> Generating…</>
            ) : (
              "Generate Cover Letter"
            )}
          </Button>

          {coverLetter && (
            <>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  Your cover letter (editable)
                </label>
                <Textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={10}
                  className="text-xs font-mono resize-none"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs gap-1.5"
                  onClick={() => void handleCopy()}
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied!" : "Copy"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs gap-1.5"
                  onClick={handleDownload}
                >
                  <Download className="w-3.5 h-3.5" />
                  Download .txt
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
