import { motion } from "framer-motion";
import { Sparkles, Filter } from "lucide-react";
import { InsightCard } from "@/components/InsightCard";
import { mockInsights } from "@/lib/mock-data";
import { useFilter } from "@/contexts/FilterContext";

export const InsightsPage = () => {
  const { selectedChannel } = useFilter();

  const filteredInsights = selectedChannel
    ? mockInsights.filter((ins) => ins.channels.some((ch) => ch.toLowerCase().includes(selectedChannel.toLowerCase())))
    : mockInsights;

  return (
    <div className="min-h-screen pb-24 px-4 pt-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-foreground">Insights</h1>
          <span className="gradient-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">IA</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Problemas detectados + oportunidades de mercado = ações estratégicas
        </p>
      </motion.div>

      {selectedChannel && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mt-4 rounded-2xl border border-primary/20 bg-primary/5 p-3 flex items-center gap-2"
        >
          <Filter className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs text-primary font-medium">Filtrado por:</span>
          <span className="text-xs font-semibold text-foreground">{selectedChannel}</span>
          <span className="text-[10px] text-muted-foreground ml-auto">{filteredInsights.length} insights</span>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-4 rounded-2xl border border-accent/20 bg-accent/5 p-4 flex items-start gap-3"
      >
        <Sparkles className="h-5 w-5 text-accent shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-foreground">{filteredInsights.length} insights gerados</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Cada card cruza um problema real dos seus dados com uma tendência de mercado, gerando ação + ideia criativa.
          </p>
        </div>
      </motion.div>

      <div className="mt-6 space-y-4">
        {filteredInsights.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">Nenhum insight encontrado para "{selectedChannel}"</p>
          </div>
        ) : (
          filteredInsights.map((insight, i) => (
            <InsightCard key={insight.id} insight={insight} index={i} />
          ))
        )}
      </div>
    </div>
  );
};
