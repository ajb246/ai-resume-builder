"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Brain,
  MessageSquare,
  Target,
  Briefcase,
  BarChart3,
  Download,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Resume Analysis",
    description: "Upload any format. AI extracts and structures your experience instantly.",
  },
  {
    icon: MessageSquare,
    title: "Conversational Coaching",
    description: "Chat with your AI career coach. It asks the right questions.",
  },
  {
    icon: Target,
    title: "ATS Optimization",
    description: "Rewrites your resume with keywords that beat applicant tracking systems.",
  },
  {
    icon: Briefcase,
    title: "Job Matching",
    description: "Personalized job recommendations ranked by how well you match.",
  },
  {
    icon: BarChart3,
    title: "Resume Scoring",
    description: "Get a score out of 100 with actionable improvement suggestions.",
  },
  {
    icon: Download,
    title: "One-Click Export",
    description: "Download your polished resume as PDF or DOCX, instantly.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need to land your next role
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From upload to offer — AI handles the heavy lifting so you can focus on interviews.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Card className="h-full border-border/50 bg-card/50 hover:border-blue-500/30 hover:bg-card transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3">
                    <feature.icon className="h-5 w-5 text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
