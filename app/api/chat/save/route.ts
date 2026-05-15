import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const saveBodySchema = z.object({
  chatId: z.string(),
  newAssistantMessage: z.object({
    id: z.string(),
    role: z.literal("assistant"),
    parts: z.array(z.record(z.string(), z.unknown())),
  }),
  messages: z.array(z.unknown()),
});

export async function POST(req: Request) {
  try {
    const body = saveBodySchema.safeParse(await req.json());
    if (!body.success) return NextResponse.json({ ok: false }, { status: 400 });

    const { chatId, newAssistantMessage, messages } = body.data;

    const allMessages = [...messages, newAssistantMessage];

    await prisma.chat.update({
      where: { id: chatId },
      data: {
        messages: allMessages as import("@prisma/client").Prisma.JsonArray,
        updatedAt: new Date(),
      },
    });

    await prisma.chat
      .findUnique({ where: { id: chatId }, select: { userId: true } })
      .then((chat) => {
        if (chat?.userId) {
          return prisma.user.update({
            where: { id: chat.userId },
            data: { messageCount: { increment: 1 } },
          });
        }
      });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[CHAT_SAVE]", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
