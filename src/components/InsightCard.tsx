import { motion } from "framer-motion";
import { Lightbulb, FlaskConical, TrendingUp, Megaphone, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { InsightItem } from "@/lib/mock-data";

const typeConfig = {
  opportunity: { icon: Lightbulb, label: "Oportunidade", className: "bg-primary/10 text-primary border-primary/20" },
  test: { icon: FlaskConical, label: "Teste A/B", className: "bg-accent/10 text-accent border-accent/20" },
  optimization: { icon: TrendingUp, label: "Otimização", className: "bg-success/10 text-success border-success/20" },
  campaign: { icon: Megaphone, label: "Campanha", className: "bg-warning/10 text-warning border-warning/20" },
};

const impactColors: Record<string, string> = {
  Alto: "bg-success/15 text-success",
  Médio: "bg-warning/15 text-warning",
  Baixo: "bg-muted text-muted-foreground",
};

export const InsightCard = ({ insight, index }: { insight: InsightItem; index: number }) => {
  const [expanded, setExpanded] = useState(false);
  const config = typeConfig[insight.type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="rounded-2xl border border-border gradient-card shadow-card overflow-hidden"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 text-left"
      >
        <div className="flex items-start gap-3">
          <div className={`rounded-xl p-2 border ${config.className}`}>
            <Icon className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${config.className}`}>
                {config.label}
              </span>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${impactColors[insight.impact]}`}>
                Impacto {insight.impact}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-foreground leading-snug">{insight.title}</h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{insight.description}</p>
          </div>
          <ChevronRight className={`h-4 w-4 text-muted-foreground shrink-0 mt-1 transition-transform ${expanded ? "rotate-90" : ""}`} />
        </div>
      </button>

      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="px-4 pb-4 border-t border-border"
        >
          <div className="pt-3 space-y-3">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1.5">Canais</p>
              <div className="flex flex-wrap gap-1.5">
                {insight.channels.map((ch) => (
                  <span key={ch} className="text-[11px] px-2 py-0.5 rounded-lg bg-secondary text-secondary-foreground">
                    {ch}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1.5">Próximos passos</p>
              <ul className="space-y-1.5">
                {insight.actions.map((action, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-foreground">
                    <span className="shrink-0 mt-0.5 h-4 w-4 rounded-full bg-primary/15 text-primary text-[10px] flex items-center justify-center font-mono font-bold">
                      {i + 1}
                    </span>
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
