import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const resume = await prisma.resume.findFirst({
    where: { id, userId: user.id },
  });

  if (!resume) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: resume });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const resume = await prisma.resume.findFirst({
    where: { id, userId: user.id },
  });

  if (!resume) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.resume.delete({ where: { id } });
  return NextResponse.json({ data: { deleted: true } });
}
