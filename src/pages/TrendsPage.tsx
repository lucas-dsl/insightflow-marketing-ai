import { motion } from "framer-motion";
import { TrendingUp, ArrowUpRight, Minus, Sparkles } from "lucide-react";
import { mockTrends } from "@/lib/mock-data";

export const TrendsPage = () => {
  return (
    <div className="min-h-screen pb-24 px-4 pt-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">Tendências</h1>
        <p className="text-sm text-muted-foreground mt-1">Tendências de mercado em tempo real</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-4 flex items-start gap-3"
      >
        <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-foreground">Análise inteligente</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Dados baseados em tendências de busca e comportamento de mercado. Conecte com Google Trends para dados em tempo real.
          </p>
        </div>
      </motion.div>

      <div className="mt-6 space-y-3">
        {mockTrends.map((trend, i) => (
          <motion.div
            key={trend.keyword}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.08 }}
            className="rounded-2xl border border-border gradient-card shadow-card p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground leading-snug flex-1">{trend.keyword}</h3>
              <div className={`flex items-center gap-1 text-xs font-mono font-medium ${
                trend.change > 0 ? "text-success" : trend.change < 0 ? "text-destructive" : "text-muted-foreground"
              }`}>
                {trend.change > 0 ? <ArrowUpRight className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                {trend.change > 0 ? "+" : ""}{trend.change}%
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${trend.interest}%` }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.6 }}
                  className="h-full rounded-full gradient-primary"
                />
              </div>
              <span className="text-xs font-mono text-muted-foreground w-8 text-right">{trend.interest}</span>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                trend.status === "rising"
                  ? "bg-success/10 text-success border border-success/20"
                  : "bg-secondary text-secondary-foreground"
              }`}>
                {trend.status === "rising" ? "Em alta" : "Estável"}
              </span>
              <TrendingUp className="h-3 w-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">Índice de interesse</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
