import { motion } from "framer-motion";
import { ArrowUpRight, Minus, Sparkles } from "lucide-react";
import { useAppState } from "@/app/useAppState";
import { FilterBanner } from "@/components/common/FilterBanner";
import { PageHeader } from "@/components/common/PageHeader";
import { getDashboardSource } from "@/data/appData";

export const TrendsPage = () => {
  const { hasImportedData, isDemo, selectedChannel } = useAppState();
  const { trends } = getDashboardSource({ hasImportedData, isDemo });

  const filteredTrends = selectedChannel
    ? trends.filter((trend) =>
        trend.channels.some((channel) =>
          channel.toLowerCase().includes(selectedChannel.toLowerCase()),
        ),
      )
    : trends;

  return (
    <section className="screen-container">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <PageHeader
          title="Tendencias de mercado"
          description="Sinais e movimentos relevantes para orientar decisao e canal."
        />
      </motion.div>

      {selectedChannel && filteredTrends.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <FilterBanner
            count={filteredTrends.length}
            label="tendencias"
            value={selectedChannel}
          />
        </motion.div>
      ) : null}

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4"
      >
        <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <div>
          <p className="text-sm font-medium text-foreground">Leitura assistida</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            A tela segue pronta para trocar mocks por uma fonte externa depois, sem
            alterar a composicao visual.
          </p>
        </div>
      </motion.section>

      <div className="space-y-3">
        {filteredTrends.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">
              {isDemo || hasImportedData
                ? `Nenhuma tendencia encontrada para "${selectedChannel}"`
                : "Nenhuma tendencia disponivel enquanto nao houver dados."}
            </p>
          </div>
        ) : (
          filteredTrends.map((trend, index) => (
            <motion.article
              key={trend.keyword}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + index * 0.08 }}
              className="surface-card p-4"
            >
              <div className="mb-3 flex items-start justify-between">
                <h2 className="flex-1 text-sm font-semibold leading-snug text-foreground">
                  {trend.keyword}
                </h2>
                <div
                  className={`flex items-center gap-1 text-xs font-medium ${
                    trend.change > 0
                      ? "text-success"
                      : trend.change < 0
                        ? "text-destructive"
                        : "text-muted-foreground"
                  }`}
                >
                  {trend.change > 0 ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <Minus className="h-3 w-3" />
                  )}
                  {trend.change > 0 ? "+" : ""}
                  {trend.change}%
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${trend.interest}%` }}
                    transition={{ delay: 0.3 + index * 0.08, duration: 0.6 }}
                    className="h-full rounded-full gradient-primary"
                  />
                </div>
                <span className="w-8 text-right font-mono text-xs text-muted-foreground">
                  {trend.interest}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    trend.status === "rising"
                      ? "border border-success/20 bg-success/10 text-success"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {trend.status === "rising" ? "Em alta" : "Estavel"}
                </span>
                {trend.channels.map((channel) => (
                  <span
                    key={channel}
                    className="rounded bg-secondary px-1.5 py-0.5 text-[10px] text-secondary-foreground"
                  >
                    {channel}
                  </span>
                ))}
              </div>
            </motion.article>
          ))
        )}
      </div>
    </section>
  );
};
