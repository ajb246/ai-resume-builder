import { extractTextFromFile } from "@/services/resume/parser";
import { extractResumeData } from "@/services/resume/extractor";

export const parseResumeTool = {
  name: "parseResume",
  description: "Parse a resume file URL and extract structured data",
  parameters: {
    type: "object" as const,
    properties: {
      fileUrl: { type: "string", description: "URL of the resume file" },
      mimeType: { type: "string", description: "MIME type of the file" },
    },
    required: ["fileUrl", "mimeType"],
  },
  execute: async ({ fileUrl, mimeType }: { fileUrl: string; mimeType: string }) => {
    const res = await fetch(fileUrl);
    const buffer = Buffer.from(await res.arrayBuffer());
    const rawText = await extractTextFromFile(buffer, mimeType);
    return extractResumeData(rawText);
  },
};
