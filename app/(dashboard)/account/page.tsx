import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DeleteAccountButton } from "@/components/account/DeleteAccountButton";

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const uploadCount = await prisma.resume.count({ where: { userId: user.id } });
  const chatCount = await prisma.chat.count({ where: { userId: user.id } });

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-8">
      <h1 className="text-2xl font-bold">Account</h1>

      <div className="rounded-xl border border-border p-6 space-y-4">
        <h2 className="font-semibold">Profile</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Name</p>
            <p>{user.name ?? "—"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Email</p>
            <p>{user.email}</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border p-6 space-y-4">
        <h2 className="font-semibold">Usage</h2>
        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Resumes uploaded</span>
            <span>{uploadCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Chat sessions</span>
            <span>{chatCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Messages sent</span>
            <span>{user.messageCount}</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-red-500/30 p-6 space-y-3">
        <h2 className="font-semibold text-red-400">Danger Zone</h2>
        <p className="text-sm text-muted-foreground">
          Permanently delete your account and all data. This cannot be undone.
        </p>
        <DeleteAccountButton />
      </div>
    </div>
  );
}
