"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, Upload } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-background to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            Powered by GPT-4o
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Your Personal{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              AI Career
            </span>{" "}
            Assistant
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Upload your resume, chat with AI, optimize your career, and discover
            jobs tailored to your skills — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className={cn(buttonVariants({ size: "lg" }), "gap-2")}>
              <Upload className="h-4 w-4" />
              Upload Resume
            </Link>
            <Link
              href="/sign-up"
              className={cn(buttonVariants({ size: "lg", variant: "outline" }), "gap-2")}
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-20 relative"
        >
          <div className="rounded-2xl border border-border bg-card shadow-2xl overflow-hidden max-w-4xl mx-auto">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/50">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
              <span className="ml-2 text-xs text-muted-foreground">ResumeAI — AI Chat</span>
            </div>
            <div className="grid grid-cols-3 h-64 divide-x divide-border">
              <div className="p-4 space-y-3">
                <div className="h-3 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
                <div className="h-3 bg-blue-500/30 rounded w-5/6" />
                <div className="h-3 bg-muted rounded w-2/3" />
                <div className="h-3 bg-blue-500/30 rounded w-4/5" />
              </div>
              <div className="p-4 space-y-2">
                <div className="h-2 bg-muted rounded w-full" />
                <div className="h-2 bg-muted rounded w-5/6" />
                <div className="h-2 bg-muted rounded w-4/5" />
                <div className="h-2 bg-muted rounded w-full" />
                <div className="h-2 bg-muted rounded w-3/4" />
              </div>
              <div className="p-4 space-y-3">
                <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-2 space-y-1">
                  <div className="h-2 bg-blue-400/50 rounded w-3/4" />
                  <div className="h-2 bg-muted rounded w-1/2" />
                  <div className="flex justify-between items-center mt-2">
                    <div className="h-2 bg-muted rounded w-1/4" />
                    <div className="text-xs text-blue-400 font-medium">92%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
