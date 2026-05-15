import { openai } from "@/lib/openai";
import type { GeneratedResume } from "./generator";

export interface ResumeScore {
  total: number;
  breakdown: {
    atsReadability: number;
    keywordDensity: number;
    actionVerbs: number;
    metricsUsage: number;
    formatting: number;
  };
  suggestions: string[];
  atsKeywordsFound: string[];
  atsKeywordsMissing: string[];
}

const STRONG_ACTION_VERBS = [
  "led", "built", "developed", "designed", "implemented", "launched",
  "increased", "reduced", "improved", "managed", "created", "delivered",
  "architected", "engineered", "optimized", "scaled", "drove", "achieved",
  "spearheaded", "established", "transformed", "automated", "streamlined",
];

const METRICS_PATTERNS = [
  /\d+%/,
  /\$\d+/,
  /\d+[km]\+?/i,
  /\d+ team/i,
  /\d+x/i,
];

interface KwData {
  found?: unknown;
  missing?: unknown;
  score?: unknown;
}

export async function scoreResume(
  resume: GeneratedResume,
  targetRole: string
): Promise<ResumeScore> {
  const allBullets = resume.experience.flatMap((e) => e.bullets);
  const fullText = [resume.summary, ...allBullets, ...resume.skills]
    .join(" ")
    .toLowerCase();

  // 1. Action verbs score (0–20)
  const bulletCount = allBullets.length;
  const bulletsWithActionVerbs = allBullets.filter((b) => {
    const firstWord = b.split(" ")[0]?.toLowerCase() ?? "";
    return STRONG_ACTION_VERBS.some((v) => firstWord.startsWith(v));
  });
  const actionVerbScore =
    bulletCount > 0
      ? Math.round((bulletsWithActionVerbs.length / bulletCount) * 20)
      : 0;

  // 2. Metrics usage score (0–20)
  const bulletsWithMetrics = allBullets.filter((b) =>
    METRICS_PATTERNS.some((p) => p.test(b))
  );
  const metricsScore =
    bulletCount > 0
      ? Math.min(20, Math.round((bulletsWithMetrics.length / bulletCount) * 25))
      : 0;

  // 3. ATS readability (0–25)
  const hasStandardSections = [
    resume.experience.length > 0,
    resume.education.length > 0,
    resume.skills.length >= 5,
    Boolean(resume.summary),
    Boolean(resume.email),
  ].filter(Boolean).length;
  const atsReadabilityScore = Math.round((hasStandardSections / 5) * 25);

  // 4. Formatting (0–10)
  const avgBulletWords =
    allBullets.reduce((sum, b) => sum + b.split(" ").length, 0) / (bulletCount || 1);
  const formattingScore = avgBulletWords >= 8 && avgBulletWords <= 25 ? 10 : 5;

  // 5. Keyword density via GPT-4o-mini (0–25)
  const kwResult = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `Given a target role and resume text, identify:
1. ATS keywords present in the resume (from the role's typical requirements)
2. Important keywords missing from the resume
Return JSON: { "found": string[], "missing": string[], "score": number (0-25) }`,
      },
      {
        role: "user",
        content: `Target role: ${targetRole}\n\nResume text:\n${fullText.slice(0, 3000)}`,
      },
    ],
    response_format: { type: "json_object" },
  });

  let kwFound: string[] = [];
  let kwMissing: string[] = [];
  let kwScore = 10;

  try {
    const parsed = JSON.parse(kwResult.choices[0]?.message.content ?? "{}") as KwData;
    kwFound = Array.isArray(parsed.found) ? (parsed.found as string[]) : [];
    kwMissing = Array.isArray(parsed.missing) ? (parsed.missing as string[]) : [];
    kwScore = typeof parsed.score === "number" ? parsed.score : 10;
  } catch {
    // fall through with defaults
  }

  const total = atsReadabilityScore + kwScore + actionVerbScore + metricsScore + formattingScore;

  const suggestions: string[] = [];
  if (actionVerbScore < 14)
    suggestions.push("Start more bullet points with strong action verbs (Led, Built, Increased, Reduced).");
  if (metricsScore < 12)
    suggestions.push("Add measurable results: percentages, dollar amounts, team size, or time saved.");
  if (kwMissing.length > 0)
    suggestions.push(`Add these keywords for ${targetRole} roles: ${kwMissing.slice(0, 5).join(", ")}.`);
  if (!resume.summary)
    suggestions.push("Add a professional summary targeting your desired role.");
  if (resume.skills.length < 8)
    suggestions.push("Expand your skills section to at least 8–12 relevant skills.");

  return {
    total: Math.min(100, total),
    breakdown: {
      atsReadability: atsReadabilityScore,
      keywordDensity: kwScore,
      actionVerbs: actionVerbScore,
      metricsUsage: metricsScore,
      formatting: formattingScore,
    },
    suggestions,
    atsKeywordsFound: kwFound,
    atsKeywordsMissing: kwMissing,
  };
}
