"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { BrainCircuit, LayoutDashboard, FileText, MessageSquare, Briefcase, Settings, Sun, Moon } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/resume", label: "Resumes", icon: FileText },
  { href: "/chat", label: "Chats", icon: MessageSquare },
  { href: "/jobs", label: "Jobs", icon: Briefcase },
  { href: "/account", label: "Account", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

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
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
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

      <div className="p-4 border-t border-border flex items-center justify-between">
        <UserButton />
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Toggle theme"
        >
          {mounted && (theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />)}
        </button>
      </div>
    </aside>
  );
}
