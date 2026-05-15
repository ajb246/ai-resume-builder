import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { MessageSquare, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default async function ChatsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const chats = await prisma.chat.findMany({
    where: { userId: user.id },
    include: { resume: { select: { fileName: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">My Chats</h1>
        <p className="text-muted-foreground mt-1">
          {chats.length} conversation{chats.length !== 1 ? "s" : ""}
        </p>
      </div>

      {chats.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p>No chats yet. Upload a resume to start a conversation.</p>
          <Link href="/dashboard" className={cn(buttonVariants({ variant: "outline" }), "mt-4")}>
            Go to Dashboard
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {chats.map((chat: (typeof chats)[number]) => (
            <Link
              key={chat.id}
              href={`/chat/${chat.id}`}
              className="flex items-center justify-between rounded-xl border border-border bg-card/50 p-4 gap-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-blue-400" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{chat.title ?? "Untitled Chat"}</p>
                  {chat.resume && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <FileText className="h-3 w-3" />
                      {chat.resume.fileName}
                    </p>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground shrink-0">
                {formatDate(chat.updatedAt)}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
