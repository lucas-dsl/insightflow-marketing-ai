import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { InsightCard } from "@/components/InsightCard";
import { mockInsights } from "@/lib/mock-data";

export const InsightsPage = () => {
  return (
    <div className="min-h-screen pb-24 px-4 pt-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-foreground">Insights</h1>
          <span className="gradient-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">IA</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Recomendações cruzando seus dados + tendências de mercado
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-6 rounded-2xl border border-accent/20 bg-accent/5 p-4 flex items-start gap-3"
      >
        <Sparkles className="h-5 w-5 text-accent shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-foreground">{mockInsights.length} insights gerados</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Baseado nos seus dados de campanha e tendências atuais de mercado. Toque para expandir cada recomendação.
          </p>
        </div>
      </motion.div>

      <div className="mt-6 space-y-3">
        {mockInsights.map((insight, i) => (
          <InsightCard key={insight.id} insight={insight} index={i} />
        ))}
      </div>
    </div>
  );
};
