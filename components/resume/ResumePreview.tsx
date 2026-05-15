"use client";

import { useState } from "react";
import type { ParsedResume } from "@/types/resume";
import type { GeneratedResume } from "@/services/resume/generator";
import type { ResumeScore } from "@/services/resume/scorer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModernTemplatePreview } from "@/components/resume/templates/ModernTemplatePreview";
import { MinimalTemplatePreview } from "@/components/resume/templates/MinimalTemplatePreview";
import { CorporateTemplatePreview } from "@/components/resume/templates/CorporateTemplatePreview";
import { TechnicalTemplatePreview } from "@/components/resume/templates/TechnicalTemplatePreview";
import { ScoreGauge } from "@/components/dashboard/ResumeScore";
import { CoverLetterModal } from "@/components/chat/CoverLetterModal";
import { Download, FileText, Loader2, BarChart2, Mail } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type TemplateName = "modern" | "minimal" | "corporate" | "technical";

interface TemplateOption {
  id: TemplateName;
  label: string;
}

const TEMPLATES: TemplateOption[] = [
  { id: "modern", label: "Modern" },
  { id: "minimal", label: "Minimal" },
  { id: "corporate", label: "Corporate" },
  { id: "technical", label: "Technical" },
];

interface ResumePreviewProps {
  parsedResume: ParsedResume;
  generatedResume?: GeneratedResume | null;
  resumeId?: string;
}

export function ResumePreview({
  parsedResume,
  generatedResume,
  resumeId,
}: ResumePreviewProps) {
  const [template, setTemplate] = useState<TemplateName>("modern");
  const [exportingPdf, setExportingPdf] = useState(false);
  const [exportingDocx, setExportingDocx] = useState(false);
  const [score, setScore] = useState<ResumeScore | null>(null);
  const [scoring, setScoring] = useState(false);
  const [showCoverLetter, setShowCoverLetter] = useState(false);

  const handleExportPdf = async () => {
    if (!resumeId || !generatedResume) return;
    setExportingPdf(true);
    try {
      const res = await fetch("/api/export/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId, template }),
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `resume-${template}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("PDF export failed");
    } finally {
      setExportingPdf(false);
    }
  };

  const handleExportDocx = async () => {
    if (!resumeId || !generatedResume) return;
    setExportingDocx(true);
    try {
      const res = await fetch("/api/export/docx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId }),
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "resume.docx";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("DOCX export failed");
    } finally {
      setExportingDocx(false);
    }
  };

  const handleScore = async () => {
    if (!resumeId) return;
    setScoring(true);
    try {
      const res = await fetch("/api/score-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId }),
      });
      if (!res.ok) throw new Error("Scoring failed");
      const { data } = (await res.json()) as { data: ResumeScore };
      setScore(data);
    } catch {
      toast.error("Scoring failed");
    } finally {
      setScoring(false);
    }
  };

  const renderPreview = () => {
    if (!generatedResume) return null;
    switch (template) {
      case "minimal":
        return <MinimalTemplatePreview resume={generatedResume} />;
      case "corporate":
        return <CorporateTemplatePreview resume={generatedResume} />;
      case "technical":
        return <TechnicalTemplatePreview resume={generatedResume} />;
      default:
        return <ModernTemplatePreview resume={generatedResume} />;
    }
  };

  return (
    <>
      <Tabs defaultValue="original" className="flex flex-col h-full">
        <div className="px-3 pt-2 pb-2 border-b border-border flex-shrink-0">
          <TabsList className="w-full">
            <TabsTrigger value="original" className="flex-1 text-xs">
              Original
            </TabsTrigger>
            <TabsTrigger value="generated" className="flex-1 text-xs" disabled={!generatedResume}>
              Generated {generatedResume && "✓"}
            </TabsTrigger>
            <TabsTrigger value="score" className="flex-1 text-xs" disabled={!generatedResume}>
              Score
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Original tab */}
        <TabsContent value="original" className="flex-1 min-h-0 mt-0 overflow-hidden">
          <ScrollArea className="h-full">
            <ParsedResumeView resume={parsedResume} />
          </ScrollArea>
        </TabsContent>

        {/* Generated tab */}
        <TabsContent value="generated" className="flex-1 min-h-0 mt-0 flex flex-col overflow-hidden">
          {generatedResume ? (
            <>
              {/* Template switcher + actions */}
              <div className="px-3 py-2 border-b border-border flex-shrink-0 space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {TEMPLATES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTemplate(t.id)}
                      className={cn(
                        "text-[10px] px-2 py-1 rounded-md capitalize transition-colors",
                        template === t.id
                          ? "bg-blue-600 text-white"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 text-[10px] px-2 gap-1"
                    onClick={() => void handleExportPdf()}
                    disabled={exportingPdf}
                  >
                    {exportingPdf ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
                    PDF
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 text-[10px] px-2 gap-1"
                    onClick={() => void handleExportDocx()}
                    disabled={exportingDocx}
                  >
                    {exportingDocx ? <Loader2 className="w-3 h-3 animate-spin" /> : <FileText className="w-3 h-3" />}
                    DOCX
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 text-[10px] px-2 gap-1 border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                    onClick={() => setShowCoverLetter(true)}
                  >
                    <Mail className="w-3 h-3" />
                    Cover Letter
                  </Button>
                </div>
              </div>

              <ScrollArea className="flex-1 min-h-0">
                {renderPreview()}
              </ScrollArea>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
              Generate your resume to preview it here
            </div>
          )}
        </TabsContent>

        {/* Score tab */}
        <TabsContent value="score" className="flex-1 min-h-0 mt-0 overflow-hidden">
          {generatedResume ? (
            <ScrollArea className="h-full">
              {score ? (
                <ScoreGauge score={score} />
              ) : (
                <div className="flex flex-col items-center justify-center h-48 gap-3 p-6">
                  <BarChart2 className="w-8 h-8 text-muted-foreground" />
                  <div className="text-center">
                    <p className="text-sm font-medium">Score your resume</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Get an ATS compatibility score with breakdown and tips
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-xs"
                    onClick={() => void handleScore()}
                    disabled={scoring}
                  >
                    {scoring ? (
                      <><Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />Scoring…</>
                    ) : (
                      "Analyze Resume"
                    )}
                  </Button>
                </div>
              )}
            </ScrollArea>
          ) : (
            <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
              Generate your resume first
            </div>
          )}
        </TabsContent>
      </Tabs>

      {generatedResume && (
        <CoverLetterModal
          open={showCoverLetter}
          onClose={() => setShowCoverLetter(false)}
          resume={generatedResume}
        />
      )}
    </>
  );
}

function ParsedResumeView({ resume }: { resume: ParsedResume }) {
  return (
    <div className="p-6 space-y-5">
      <div>
        <h2 className="text-lg font-bold">{resume.name}</h2>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-xs text-muted-foreground">
          {resume.email && <span>{resume.email}</span>}
          {resume.phone && <span>{resume.phone}</span>}
          {resume.location && <span>{resume.location}</span>}
        </div>
      </div>

      {resume.summary && (
        <>
          <Separator />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Summary
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">{resume.summary}</p>
          </div>
        </>
      )}

      {resume.skills.length > 0 && (
        <>
          <Separator />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Skills
            </p>
            <div className="flex flex-wrap gap-1.5">
              {resume.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-[10px] px-2 py-0.5">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </>
      )}

      {resume.experience.length > 0 && (
        <>
          <Separator />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Experience
            </p>
            <div className="space-y-4">
              {resume.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold">{exp.title}</p>
                      <p className="text-[11px] text-muted-foreground">{exp.company}</p>
                    </div>
                    <p className="text-[10px] text-muted-foreground whitespace-nowrap flex-shrink-0">
                      {exp.startDate} – {exp.current ? "Present" : (exp.endDate ?? "")}
                    </p>
                  </div>
                  {exp.bullets.length > 0 && (
                    <ul className="mt-1.5 space-y-1 list-disc list-inside">
                      {exp.bullets.map((bullet, j) => (
                        <li key={j} className="text-[11px] text-muted-foreground leading-relaxed">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {resume.education.length > 0 && (
        <>
          <Separator />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Education
            </p>
            <div className="space-y-2">
              {resume.education.map((edu, i) => (
                <div key={i}>
                  <p className="text-xs font-semibold">
                    {edu.degree}
                    {edu.field ? ` in ${edu.field}` : ""}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] text-muted-foreground">{edu.institution}</p>
                    {edu.graduationDate && (
                      <p className="text-[10px] text-muted-foreground">{edu.graduationDate}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {resume.certifications && resume.certifications.length > 0 && (
        <>
          <Separator />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Certifications
            </p>
            <div className="space-y-1.5">
              {resume.certifications.map((cert, i) => (
                <div key={i} className="flex items-center justify-between">
                  <p className="text-xs">{cert.name}</p>
                  {cert.issuer && (
                    <p className="text-[10px] text-muted-foreground">{cert.issuer}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {resume.projects && resume.projects.length > 0 && (
        <>
          <Separator />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Projects
            </p>
            <div className="space-y-3">
              {resume.projects.map((proj, i) => (
                <div key={i}>
                  <p className="text-xs font-semibold">{proj.name}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{proj.description}</p>
                  {proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {proj.technologies.map((tech) => (
                        <Badge key={tech} variant="outline" className="text-[10px] px-1.5 py-0">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
