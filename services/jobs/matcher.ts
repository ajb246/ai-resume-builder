import { openai } from "@/lib/openai";
import type { RawJob, JobMatch } from "@/types/job";
import type { GeneratedResume } from "@/services/resume/generator";
import { createEmbedding, cosineSimilarity, resumeToEmbeddingText } from "@/services/ai/embeddings";

interface SkillsJsonResponse {
  skills?: unknown;
  requirements?: unknown;
}

async function extractJobSkills(jobDescription: string): Promise<string[]> {
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Extract a list of technical and professional skills/requirements from this job description. Return only a JSON object with a 'skills' array of strings. Be specific (e.g., 'React' not 'frontend frameworks').",
      },
      { role: "user", content: jobDescription },
    ],
    response_format: { type: "json_object" },
  });

  try {
    const content = res.choices[0]?.message.content ?? "{}";
    const parsed = JSON.parse(content) as SkillsJsonResponse;
    const skills = parsed.skills ?? parsed.requirements;
    return Array.isArray(skills) ? (skills as string[]) : [];
  } catch {
    return [];
  }
}

function calculateMatchScore(
  userSkills: string[],
  jobSkills: string[]
): { score: number; matched: string[]; missing: string[] } {
  if (jobSkills.length === 0) return { score: 0, matched: [], missing: [] };

  const normalize = (s: string) => s.toLowerCase().trim();

  const matched: string[] = [];
  const missing: string[] = [];

  for (const skill of jobSkills) {
    const norm = normalize(skill);
    const isMatch = userSkills.some(
      (us) => normalize(us).includes(norm) || norm.includes(normalize(us))
    );
    if (isMatch) {
      matched.push(skill);
    } else {
      missing.push(skill);
    }
  }

  const score = Math.round((matched.length / jobSkills.length) * 100);
  return { score, matched, missing };
}

export async function matchAndRankJobs(
  resume: GeneratedResume,
  jobs: RawJob[],
  targetRole: string
): Promise<JobMatch[]> {
  const userSkills = resume.skills;
  const results: JobMatch[] = [];
  const batchSize = 5;
  const jobsToProcess = jobs.slice(0, 20);

  for (let i = 0; i < jobsToProcess.length; i += batchSize) {
    const batch = jobsToProcess.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(async (job) => {
        const jobSkills = await extractJobSkills(job.description);
        const { score, matched, missing } = calculateMatchScore(userSkills, jobSkills);
        return {
          ...job,
          matchScore: score,
          matchedSkills: matched,
          missingSkills: missing,
        };
      })
    );
    results.push(...batchResults);
  }

  return results.sort((a, b) => b.matchScore - a.matchScore);
}

export async function matchAndRankJobsWithEmbeddings(
  resume: GeneratedResume,
  jobs: RawJob[],
  _targetRole: string
): Promise<JobMatch[]> {
  const resumeEmbedding = await createEmbedding(resumeToEmbeddingText(resume));

  const results = await Promise.all(
    jobs.slice(0, 20).map(async (job) => {
      const jobSkills = await extractJobSkills(job.description);
      const { score: keywordScore, matched, missing } = calculateMatchScore(resume.skills, jobSkills);

      const jobEmbedding = await createEmbedding(
        `${job.title} ${job.company} ${job.description.slice(0, 500)}`
      );
      const semanticScore = cosineSimilarity(resumeEmbedding, jobEmbedding);

      const blendedScore = Math.round(keywordScore * 0.6 + semanticScore * 100 * 0.4);

      return {
        ...job,
        matchScore: Math.min(100, blendedScore),
        matchedSkills: matched,
        missingSkills: missing,
      };
    })
  );

  return results.sort((a, b) => b.matchScore - a.matchScore);
}
