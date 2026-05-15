import { z } from "zod";

export const uploadSchema = z.object({
  fileUrl: z.string().url(),
  fileName: z.string().min(1),
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
