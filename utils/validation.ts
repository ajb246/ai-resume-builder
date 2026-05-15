import { z } from "zod";

export const uploadSchema = z.object({
  fileUrl: z.string().url(),
  fileName: z.string().max(255),
  mimeType: z.enum([
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ]),
});

export const generateSchema = z.object({
  resumeId: z.string().cuid(),
  targetRole: z.string().min(1).max(200),
  conversationContext: z.string().max(10000),
});

export const chatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant", "system"]),
        content: z.string().max(4000),
      })
    )
    .max(100),
  chatId: z.string().cuid(),
  resumeId: z.string().cuid().optional(),
});

export const chatMessageSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant", "system"]),
      content: z.string().min(1),
    })
  ),
  resumeId: z.string().cuid().optional(),
});
