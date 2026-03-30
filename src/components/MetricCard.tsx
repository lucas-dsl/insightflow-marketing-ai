import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  gradient?: string;
}

export const MetricCard = ({ label, value, change, changeType = "neutral", icon: Icon, gradient }: MetricCardProps) => {
  const changeColor = changeType === "positive" ? "text-success" : changeType === "negative" ? "text-destructive" : "text-muted-foreground";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border border-border p-4 shadow-card ${gradient || "gradient-card"}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="rounded-xl bg-secondary p-2">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        {change && (
          <span className={`text-xs font-mono font-medium ${changeColor}`}>
            {change}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </motion.div>
  );
};
