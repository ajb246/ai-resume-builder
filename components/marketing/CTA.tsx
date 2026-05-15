"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, Upload } from "lucide-react";

export function CTA() {
  return (
    <section className="py-24 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-blue-900/40 via-blue-800/20 to-background border border-blue-500/20 p-12 text-center"
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          Ready to land your dream job?
        </h2>
        <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
          Join thousands of job seekers who use ResumeAI to get more interviews, faster.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/sign-up" className={cn(buttonVariants({ size: "lg" }), "gap-2")}>
            <Upload className="h-4 w-4" />
            Upload Resume
          </Link>
          <Link
            href="/sign-up"
            className={cn(buttonVariants({ size: "lg", variant: "outline" }), "gap-2")}
          >
            Start Free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
