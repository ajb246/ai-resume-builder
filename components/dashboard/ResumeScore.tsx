"use client";

import { motion } from "framer-motion";
import type { ResumeScore } from "@/services/resume/scorer";

const BREAKDOWN_MAX: Record<string, number> = {
  atsReadability: 25,
  keywordDensity: 25,
  actionVerbs: 20,
  metricsUsage: 20,
  formatting: 10,
};

export function ScoreGauge({ score }: { score: ResumeScore }) {
  const circumference = 2 * Math.PI * 40;
  const color =
    score.total >= 75 ? "#22c55e" : score.total >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <div className="space-y-4 p-4">
      {/* Circular gauge */}
      <div className="flex items-center justify-center">
        <div className="relative w-32 h-32">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-muted"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: circumference * (1 - score.total / 100) }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className="text-3xl font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {score.total}
            </motion.span>
            <span className="text-[10px] text-muted-foreground">/100</span>
          </div>
        </div>
      </div>

      {/* Breakdown bars */}
      <div className="space-y-2.5">
        {Object.entries(score.breakdown).map(([key, value]) => {
          const max = BREAKDOWN_MAX[key] ?? 25;
          const label = key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (s) => s.toUpperCase());
          return (
            <div key={key} className="space-y-1">
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>{label}</span>
                <span>
                  {value}/{max}
                </span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(value / max) * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* ATS keywords */}
      {(score.atsKeywordsFound.length > 0 || score.atsKeywordsMissing.length > 0) && (
        <div className="space-y-2 pt-1">
          {score.atsKeywordsFound.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-green-500 mb-1">Found keywords</p>
              <div className="flex flex-wrap gap-1">
                {score.atsKeywordsFound.slice(0, 8).map((k) => (
                  <span
                    key={k}
                    className="text-[9px] bg-green-500/10 text-green-500 px-1.5 py-0.5 rounded"
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>
          )}
          {score.atsKeywordsMissing.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-red-400 mb-1">Missing keywords</p>
              <div className="flex flex-wrap gap-1">
                {score.atsKeywordsMissing.slice(0, 8).map((k) => (
                  <span
                    key={k}
                    className="text-[9px] bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded"
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Suggestions */}
      {score.suggestions.length > 0 && (
        <div className="space-y-2 pt-1">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
            Improvements
          </p>
          {score.suggestions.map((s, i) => (
            <div key={i} className="text-[10px] text-muted-foreground flex gap-2">
              <span className="text-amber-400 flex-shrink-0">→</span>
              <span>{s}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
