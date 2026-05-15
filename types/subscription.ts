export type Plan = "free" | "premium";

export interface UsageQuota {
  uploads: number;
  messagesPerDay: number;
  templates: string[];
}

export const LIMITS: Record<Plan, UsageQuota> = {
  free: {
    uploads: 1,
    messagesPerDay: 10,
    templates: ["modern", "minimal"],
  },
  premium: {
    uploads: Infinity,
    messagesPerDay: Infinity,
    templates: ["modern", "minimal", "corporate", "technical"],
  },
};
