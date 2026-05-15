import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  const existing = await prisma.user.findUnique({ where: { clerkId } });
  if (existing) return existing;

  // First login — create the user record (replaces Clerk webhook)
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email =
    clerkUser.emailAddresses[0]?.emailAddress ?? "";
  const name =
    `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() || null;

  return prisma.user.upsert({
    where: { clerkId },
    create: { clerkId, email, ...(name ? { name } : {}) },
    update: {},
  });
}
