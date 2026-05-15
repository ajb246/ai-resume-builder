import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { searchAdzuna } from "@/services/jobs/adzuna";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

const TRENDING_ROLES = [
  "Software Engineer",
  "Data Scientist",
  "Product Manager",
  "UX Designer",
  "DevOps Engineer",
];

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [resumes, chats, trendingJobs] = await Promise.all([
    prisma.resume.count({ where: { userId: user.id } }),
    prisma.chat.count({ where: { userId: user.id } }),
    searchAdzuna(TRENDING_ROLES[Math.floor(Math.random() * TRENDING_ROLES.length)] ?? "Software Engineer", "us", 6).catch(() => []),
  ]);

  const latestResume = await prisma.resume.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: { id: true, fileName: true, score: true, targetRole: true },
  });

  const latestChat = latestResume
    ? await prisma.chat.findFirst({
        where: { userId: user.id, resumeId: latestResume.id },
        orderBy: { updatedAt: "desc" },
        select: { id: true },
      })
    : null;

  return (
    <DashboardClient
      user={{ name: user.name, email: user.email }}
      stats={{ resumes, chats }}
      latestResume={latestResume}
      latestChatId={latestChat?.id ?? null}
      trendingJobs={trendingJobs}
    />
  );
}
