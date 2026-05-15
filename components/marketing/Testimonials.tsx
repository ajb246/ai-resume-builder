"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Sarah K.",
    role: "Software Engineer",
    quote:
      "Got 3 interview calls in the first week after optimizing my resume with this tool.",
    avatar: "SK",
  },
  {
    name: "Marcus T.",
    role: "Product Manager",
    quote:
      "The AI asked me questions I'd never thought to include on my resume. My match score went from 45% to 89%.",
    avatar: "MT",
  },
  {
    name: "Priya R.",
    role: "Data Scientist",
    quote:
      "The ATS optimization is incredible. I could immediately see which keywords were missing.",
    avatar: "PR",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by job seekers</h2>
          <p className="text-muted-foreground text-lg">
            Real results from real people — examples for illustration purposes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Card className="h-full border-border/50 bg-card/50">
                <CardContent className="pt-6 space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-blue-500/20 text-blue-400 text-xs font-medium">
                        {t.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
