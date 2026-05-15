"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import {
  FileText, MessageSquare, Briefcase, ArrowRight,
  ExternalLink, MapPin, DollarSign, Upload, Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import type { RawJob } from "@/types/job";

interface Props {
  user: { name: string | null; email: string };
  stats: { resumes: number; chats: number };
  latestResume: { id: string; fileName: string; score: number | null; targetRole: string | null } | null;
  latestChatId: string | null;
  trendingJobs: RawJob[];
}

// Curated Unsplash photos — professional, royalty-free
const HERO_IMAGE = "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1400&q=80";

const JOB_PHOTOS = [
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=70",
  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&q=70",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=70",
  "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&q=70",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=70",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=70",
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.45, ease: "easeOut" as const } }),
};

export function DashboardClient({ user, stats, latestResume, latestChatId, trendingJobs }: Props) {
  const firstName = user.name?.split(" ")[0] ?? "there";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="overflow-y-auto h-full">
      {/* ── Hero banner ── */}
      <div className="relative h-52 md:h-64 w-full overflow-hidden">
        <Image
          src={HERO_IMAGE}
          alt="Professional workspace"
          fill
          className="object-cover object-center"
          priority
        />
        {/* dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Greeting on top of photo */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute bottom-0 left-0 p-6 md:p-8"
        >
          <p className="text-sm text-white/70">{greeting}</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mt-0.5">
            {firstName} 👋
          </h1>
          <p className="text-sm text-white/60 mt-1">
            {latestResume
              ? `Working on: ${latestResume.targetRole ?? latestResume.fileName}`
              : "Upload your resume to get started"}
          </p>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-8 py-8 space-y-8">

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: "Resumes", value: stats.resumes, icon: FileText, href: "/resume", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
            { label: "Conversations", value: stats.chats, icon: MessageSquare, href: "/chat", color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" },
            { label: "Job Matches", value: "Live", icon: Briefcase, href: "/jobs", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
          ].map((stat, i) => (
            <motion.div key={stat.label} custom={i} variants={fadeUp} initial="hidden" animate="show">
              <Link
                href={stat.href}
                className={cn(
                  "flex items-center gap-4 rounded-2xl border p-5 transition-all group",
                  "bg-card/60 hover:bg-card",
                  stat.border
                )}
              >
                <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center shrink-0", stat.bg)}>
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                </div>
                <div className="min-w-0">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* ── Quick actions with background photos ── */}
        <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Upload card */}
          <Link href="/resume" className="relative rounded-2xl overflow-hidden h-36 group">
            <Image
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=70"
              alt="Upload resume"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-800/60 to-transparent" />
            <div className="absolute inset-0 p-5 flex flex-col justify-end">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg bg-blue-500/30 backdrop-blur-sm flex items-center justify-center">
                  <Upload className="h-3.5 w-3.5 text-blue-300" />
                </div>
                <p className="font-semibold text-white text-sm">Upload Resume</p>
              </div>
              <p className="text-xs text-white/60">Let AI analyze and optimize it</p>
            </div>
          </Link>

          {/* Coach card */}
          <Link href={latestChatId ? `/chat/${latestChatId}` : "/resume"} className="relative rounded-2xl overflow-hidden h-36 group">
            <Image
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=70"
              alt="AI career coach"
              fill
              className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-violet-900/80 via-violet-800/60 to-transparent" />
            <div className="absolute inset-0 p-5 flex flex-col justify-end">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg bg-violet-500/30 backdrop-blur-sm flex items-center justify-center">
                  <Sparkles className="h-3.5 w-3.5 text-violet-300" />
                </div>
                <p className="font-semibold text-white text-sm">AI Career Coach</p>
              </div>
              <p className="text-xs text-white/60">
                {latestResume ? `Resume: ${latestResume.fileName}` : "Start with a resume upload"}
              </p>
            </div>
          </Link>
        </motion.div>

        {/* ── Trending jobs ── */}
        <motion.div custom={4} variants={fadeUp} initial="hidden" animate="show" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Trending Jobs</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Live listings — click to apply</p>
            </div>
            <Link href="/jobs" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-1.5 text-xs")}>
              All matches <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {trendingJobs.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card/40 p-8 text-center text-sm text-muted-foreground">
              Could not load trending jobs right now.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trendingJobs.map((job, i) => (
                <motion.a
                  key={job.id}
                  href={job.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  custom={5 + i}
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  className="group rounded-2xl border border-border overflow-hidden hover:border-blue-500/40 transition-all hover:shadow-lg hover:shadow-blue-500/5 flex flex-col"
                >
                  {/* Photo header */}
                  <div className="relative h-28 w-full overflow-hidden">
                    <Image
                      src={JOB_PHOTOS[i % JOB_PHOTOS.length]!}
                      alt={job.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white font-semibold text-sm leading-tight line-clamp-1">{job.title}</p>
                      <p className="text-white/70 text-xs mt-0.5">{job.company}</p>
                    </div>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-black/50 backdrop-blur-sm rounded-lg p-1.5">
                        <ExternalLink className="h-3 w-3 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-3 bg-card flex-1 flex flex-col gap-2">
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      {job.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate max-w-[120px]">{job.location}</span>
                        </span>
                      )}
                      {job.salary && (
                        <span className="flex items-center gap-1 text-emerald-400 font-medium">
                          <DollarSign className="h-3 w-3" />
                          {job.salary}
                        </span>
                      )}
                    </div>
                    {job.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed flex-1">
                        {job.description}
                      </p>
                    )}
                  </div>
                </motion.a>
              ))}
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
}
