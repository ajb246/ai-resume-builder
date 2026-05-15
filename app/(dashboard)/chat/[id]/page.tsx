import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { UIMessage } from "@ai-sdk/react";
import type { ParsedResume } from "@/types/resume";
import type { GeneratedResume } from "@/services/resume/generator";
import { ChatPageClient } from "@/components/dashboard/ChatPageClient";

interface ChatPageProps {
  params: Promise<{ id: string }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { id } = await params;
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) redirect("/sign-in");

  const chat = await prisma.chat.findFirst({
    where: { id, userId: user.id },
    include: { resume: true },
  });
  if (!chat) notFound();

  const initialMessages = (chat.messages as unknown as UIMessage[]) ?? [];
  const parsedResume = chat.resume?.parsedJson
    ? (chat.resume.parsedJson as unknown as ParsedResume)
    : null;
  const initialGeneratedResume = chat.resume?.generatedResume
    ? (chat.resume.generatedResume as unknown as GeneratedResume)
    : null;

  return (
    <ChatPageClient
      chatId={chat.id}
      {...(chat.resumeId ? { resumeId: chat.resumeId } : {})}
      {...(chat.title ? { chatTitle: chat.title } : {})}
      {...(chat.resume?.fileName ? { fileName: chat.resume.fileName } : {})}
      initialMessages={initialMessages}
      parsedResume={parsedResume}
      initialGeneratedResume={initialGeneratedResume}
    />
  );
}
