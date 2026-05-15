import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { openai } from "@/lib/openai";
import { z } from "zod";

const schema = z.object({
  currentSkills: z.array(z.string()),
  targetRole: z.string().min(1),
  missingSkills: z.array(z.string()),
});

interface SkillResource {
  name: string;
  freeResource: string;
  paidResource?: string;
  estimatedWeeks: number;
}

interface SkillRecommendationsJson {
  skills?: unknown[];
}

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = schema.safeParse(await req.json());
    if (!body.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

    const { currentSkills, targetRole, missingSkills } = body.data;

    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Generate a learning plan for someone targeting the role of ${targetRole}.
For each missing skill, suggest:
- 1 free resource (YouTube, documentation, free course)
- 1 paid resource if highly valuable (Udemy, Coursera)
- Estimated time to reach proficiency
Format as JSON: { skills: [{ name, freeResource, paidResource, estimatedWeeks }] }`,
        },
        {
          role: "user",
          content: `Current skills: ${currentSkills.join(", ")}\nMissing: ${missingSkills.join(", ")}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const parsed = JSON.parse(res.choices[0]?.message.content ?? "{}") as SkillRecommendationsJson;
    const skills = Array.isArray(parsed.skills)
      ? (parsed.skills as SkillResource[])
      : [];

    return NextResponse.json({ data: { skills } });
  } catch (error) {
    console.error("[SKILL_RECOMMENDATIONS]", error);
    return NextResponse.json({ error: "Recommendations failed" }, { status: 500 });
  }
}
