import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useAppState } from "@/app/useAppState";
import { FilterBanner } from "@/components/common/FilterBanner";
import { PageHeader } from "@/components/common/PageHeader";
import { InsightCard } from "@/components/insights/InsightCard";
import { generateInsights } from "@/services/insightsEngine";
import { getMarketTrends, type Trend } from "@/services/trendsService";

export const InsightsPage = () => {
  const { hasImportedData, importedRows, selectedChannel } = useAppState();
  const [marketTrends, setMarketTrends] = useState<Trend[]>([]);

  useEffect(() => {
    let active = true;

    const loadMarketTrends = async () => {
      const trends = await getMarketTrends();

      if (active) {
        setMarketTrends(trends);
      }
    };

    void loadMarketTrends();

    return () => {
      active = false;
    };
  }, []);

  const insights = generateInsights({ rows: importedRows, trends: marketTrends });

  const filteredInsights = selectedChannel
    ? insights.filter((insight) =>
        insight.channels.some((channel) =>
          channel.toLowerCase().includes(selectedChannel.toLowerCase()),
        ),
      )
    : insights;

  return (
    <section className="screen-container">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <PageHeader
          title="Insights criativos"
          description="Problemas internos e oportunidades externas combinados a partir dos dados importados."
          badge="IA"
        />
      </motion.div>

      {selectedChannel && filteredInsights.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <FilterBanner
            count={filteredInsights.length}
            label="insights"
            value={selectedChannel}
          />
        </motion.div>
      ) : null}

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-start gap-3 rounded-2xl border border-accent/20 bg-accent/5 p-4"
      >
        <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
        <div>
          <p className="text-sm font-medium text-foreground">
            {filteredInsights.length} insights gerados
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            O motor cruza CTR, custo por lead, conversao por canal e tendencias externas reais para sugerir proximos movimentos.
          </p>
        </div>
      </motion.section>

      <div className="space-y-4">
        {filteredInsights.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">
              {hasImportedData
                ? `Nenhum insight encontrado para "${selectedChannel}"`
                : "Nenhum insight gerado porque ainda nao ha dados internos importados."}
            </p>
          </div>
        ) : (
          filteredInsights.map((insight, index) => (
            <InsightCard key={insight.id} insight={insight} index={index} />
          ))
        )}
      </div>
    </section>
  );
};
