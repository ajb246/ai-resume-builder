import { getCurrentUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">
        Welcome back{user?.name ? `, ${user.name}` : ""}!
      </h1>
      <p className="text-muted-foreground mt-1">Upload a resume to get started.</p>
    </div>
  );
}
