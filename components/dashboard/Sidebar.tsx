"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { BrainCircuit, LayoutDashboard, FileText, MessageSquare, Briefcase, Settings } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/resume", label: "Resumes", icon: FileText },
  { href: "/chat", label: "Chats", icon: MessageSquare },
  { href: "/jobs", label: "Jobs", icon: Briefcase },
  { href: "/account", label: "Account", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col h-full w-64 border-r border-border bg-background">
      <div className="h-16 flex items-center px-4 border-b border-border">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <BrainCircuit className="h-5 w-5 text-blue-500" />
          ResumeAI
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-blue-500/10 text-blue-400"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <UserButton />
      </div>
    </aside>
  );
}
