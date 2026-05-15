import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function DELETE() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.user.delete({ where: { id: user.id } });

    const client = await clerkClient();
    await client.users.deleteUser(clerkId);

    return NextResponse.json({ data: { deleted: true } });
  } catch (error) {
    console.error("[DELETE_ACCOUNT]", error);
    return NextResponse.json({ error: "Deletion failed" }, { status: 500 });
  }
}
