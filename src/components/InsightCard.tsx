import { motion } from "framer-motion";
import { AlertTriangle, TrendingUp, Target, Lightbulb } from "lucide-react";
import type { InsightItem } from "@/lib/mock-data";

const impactColors: Record<string, string> = {
  Alto: "bg-destructive/15 text-destructive",
  Médio: "bg-warning/15 text-warning",
  Baixo: "bg-muted text-muted-foreground",
};

export const InsightCard = ({ insight, index }: { insight: InsightItem; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="rounded-2xl border border-border gradient-card shadow-card overflow-hidden"
    >
      <div className="p-4 space-y-3">
        {/* Header with impact badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">Insight #{insight.id}</span>
          </div>
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${impactColors[insight.impact]}`}>
            Impacto {insight.impact}
          </span>
        </div>

        {/* Problem */}
        <div className="flex items-start gap-3 rounded-xl bg-destructive/5 border border-destructive/10 p-3">
          <div className="rounded-lg bg-destructive/10 p-1.5 shrink-0">
            <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-destructive/70 font-semibold mb-0.5">Problema</p>
            <p className="text-xs text-foreground font-medium leading-relaxed">{insight.problem}</p>
          </div>
        </div>

        {/* Trend */}
        <div className="flex items-start gap-3 rounded-xl bg-accent/5 border border-accent/10 p-3">
          <div className="rounded-lg bg-accent/10 p-1.5 shrink-0">
            <TrendingUp className="h-3.5 w-3.5 text-accent" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-accent/70 font-semibold mb-0.5">Tendência</p>
            <p className="text-xs text-foreground font-medium leading-relaxed">{insight.trend}</p>
          </div>
        </div>

        {/* Action */}
        <div className="flex items-start gap-3 rounded-xl bg-primary/5 border border-primary/10 p-3">
          <div className="rounded-lg bg-primary/10 p-1.5 shrink-0">
            <Target className="h-3.5 w-3.5 text-primary" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-primary/70 font-semibold mb-0.5">Próxima ação</p>
            <p className="text-xs text-foreground font-medium leading-relaxed">{insight.action}</p>
          </div>
        </div>

        {/* Creative Insight */}
        <div className="flex items-start gap-3 rounded-xl bg-warning/5 border border-warning/10 p-3">
          <div className="rounded-lg bg-warning/10 p-1.5 shrink-0">
            <Lightbulb className="h-3.5 w-3.5 text-warning" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-warning/70 font-semibold mb-0.5">Insight criativo</p>
            <p className="text-xs text-foreground font-medium leading-relaxed">{insight.creative}</p>
          </div>
        </div>

        {/* Channels */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {insight.channels.map((ch) => (
            <span key={ch} className="text-[10px] px-2 py-0.5 rounded-lg bg-secondary text-secondary-foreground font-medium">
              {ch}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
