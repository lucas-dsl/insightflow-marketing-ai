import { motion } from "framer-motion";
import { AlertTriangle, Lightbulb, Target, TrendingUp } from "lucide-react";
import type { GeneratedInsight } from "@/services/insightsEngine";

const priorityClasses: Record<GeneratedInsight["priority"], string> = {
  Alta: "bg-destructive/15 text-destructive",
  Media: "bg-warning/15 text-warning",
  Baixa: "bg-muted text-muted-foreground",
};

interface InsightCardProps {
  index: number;
  insight: GeneratedInsight;
}

const sections = [
  {
    key: "problem",
    icon: AlertTriangle,
    label: "Problema",
    tone: "border-destructive/10 bg-destructive/5 text-destructive",
  },
  {
    key: "opportunity",
    icon: TrendingUp,
    label: "Oportunidade",
    tone: "border-accent/10 bg-accent/5 text-accent",
  },
  {
    key: "action",
    icon: Target,
    label: "Proxima acao",
    tone: "border-primary/10 bg-primary/5 text-primary",
  },
  {
    key: "creativeIdea",
    icon: Lightbulb,
    label: "Ideia criativa",
    tone: "border-warning/10 bg-warning/5 text-warning",
  },
] as const;

export const InsightCard = ({ index, insight }: InsightCardProps) => (
  <motion.article
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.08 }}
    className="surface-card overflow-hidden"
  >
    <div className="space-y-3 p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground">
          Insight {index + 1}
        </span>
        <span
          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${priorityClasses[insight.priority]}`}
        >
          Prioridade {insight.priority}
        </span>
      </div>

      {sections.map(({ key, icon: Icon, label, tone }) => (
        <div key={key} className={`rounded-xl border p-3 ${tone}`}>
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-background/50 p-1.5">
              <Icon className="h-3.5 w-3.5" />
            </div>
            <div>
              <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider">
                {label}
              </p>
              <p className="text-xs font-medium leading-relaxed text-foreground">
                {insight[key]}
              </p>
            </div>
          </div>
        </div>
      ))}

      <div className="flex flex-wrap gap-1.5 pt-1">
        {insight.channels.map((channel) => (
          <span
            key={channel}
            className="rounded-lg bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground"
          >
            {channel}
          </span>
        ))}
      </div>
    </div>
  </motion.article>
);
