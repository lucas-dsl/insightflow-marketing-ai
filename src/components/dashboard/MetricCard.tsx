import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string;
  change?: string;
  changeTone?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
}

const changeToneClasses = {
  positive: "text-success",
  negative: "text-destructive",
  neutral: "text-muted-foreground",
};

export const MetricCard = ({
  label,
  value,
  change,
  changeTone = "neutral",
  icon: Icon,
}: MetricCardProps) => (
  <motion.article
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="surface-card p-4"
  >
    <div className="mb-3 flex items-start justify-between">
      <div className="rounded-xl bg-secondary p-2">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      {change ? (
        <span className={`text-xs font-medium ${changeToneClasses[changeTone]}`}>
          {change}
        </span>
      ) : null}
    </div>
    <p className="text-2xl font-bold text-foreground">{value}</p>
    <p className="mt-1 text-xs text-muted-foreground">{label}</p>
  </motion.article>
);
