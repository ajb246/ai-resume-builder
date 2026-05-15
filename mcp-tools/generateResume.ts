import { generateOptimizedResume } from "@/services/resume/generator";
import type { ParsedResume } from "@/types/resume";

export const generateResumeTool = {
  name: "generateResume",
  description: "Generate an ATS-optimized resume from parsed data and a target role",
  parameters: {
    type: "object" as const,
    properties: {
      parsedResume: { type: "object", description: "Parsed resume JSON" },
      targetRole: { type: "string", description: "The role the user is targeting" },
      conversationContext: { type: "string", description: "Chat context for personalization" },
    },
    required: ["parsedResume", "targetRole", "conversationContext"],
  },
  execute: async (args: {
    parsedResume: ParsedResume;
    targetRole: string;
    conversationContext: string;
  }) => generateOptimizedResume(args.parsedResume, args.targetRole, args.conversationContext),
};
