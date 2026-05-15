"use client";

import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";
import { ModeToggle } from "@/components/ModeToggle";
import { BrainCircuit } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
          <BrainCircuit className="h-6 w-6 text-blue-500" />
          ResumeAI
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="#features" className="hover:text-foreground transition-colors">
            Features
          </Link>
          <Link href="#pricing" className="hover:text-foreground transition-colors">
            Pricing
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <ModeToggle />
          <Show when="signed-out" fallback={
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className={cn(buttonVariants({ variant: "ghost" }))}>
                Dashboard
              </Link>
              <UserButton />
            </div>
          }>
            <Link href="/sign-in" className={cn(buttonVariants({ variant: "ghost" }))}>
              Sign in
            </Link>
            <Link href="/sign-up" className={cn(buttonVariants())}>
              Get started
            </Link>
          </Show>
        </div>
      </div>
    </nav>
  );
}
