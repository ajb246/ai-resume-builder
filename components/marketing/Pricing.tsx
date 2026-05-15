"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

const freePlan = {
  name: "Free",
  price: "$0",
  period: "forever",
  features: [
    "1 resume upload",
    "10 AI messages / day",
    "Modern & Minimal templates",
    "PDF export",
  ],
};

const premiumPlan = {
  name: "Premium",
  price: "$19",
  period: "per month",
  features: [
    "Unlimited resume uploads",
    "Unlimited AI coaching",
    "All 4 templates",
    "ATS optimization",
    "Job matching with scores",
    "Cover letter generator",
    "DOCX + PDF export",
    "Priority support",
  ],
};

function PlanFeature({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-2 text-sm">
      <Check className="h-4 w-4 text-blue-400 shrink-0" />
      {text}
    </li>
  );
}

export function Pricing() {
  return (
    <section id="pricing" className="py-24 px-4 bg-muted/20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
          <p className="text-muted-foreground text-lg">Start free. Upgrade when you&apos;re ready.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Free */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <Card className="h-full">
              <CardHeader className="pb-4">
                <p className="text-sm text-muted-foreground font-medium">{freePlan.name}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{freePlan.price}</span>
                  <span className="text-muted-foreground text-sm">/ {freePlan.period}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {freePlan.features.map((f) => (
                    <PlanFeature key={f} text={f} />
                  ))}
                </ul>
                <Link
                  href="/sign-up"
                  className={cn(buttonVariants({ variant: "outline" }), "w-full justify-center")}
                >
                  Get started free
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          {/* Premium */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card className="h-full ring-2 ring-blue-500 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-blue-500 text-white hover:bg-blue-500">Most Popular</Badge>
              </div>
              <CardHeader className="pb-4">
                <p className="text-sm text-muted-foreground font-medium">{premiumPlan.name}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{premiumPlan.price}</span>
                  <span className="text-muted-foreground text-sm">/ {premiumPlan.period}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {premiumPlan.features.map((f) => (
                    <PlanFeature key={f} text={f} />
                  ))}
                </ul>
                <Link
                  href="/sign-up?plan=premium"
                  className={cn(buttonVariants(), "w-full justify-center")}
                >
                  Start with Premium
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
