import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RefreshCcw, Sparkles } from "lucide-react";
import { useAppState } from "@/app/useAppState";
import { FilterBanner } from "@/components/common/FilterBanner";
import { PageHeader } from "@/components/common/PageHeader";
import {
  getMarketTrends,
  refreshMarketTrends,
  type Trend,
} from "@/services/trendsService";

const trafficFormatter = new Intl.NumberFormat("pt-BR");
const PAGE_SIZE = 10;

export const TrendsPage = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [trends, setTrends] = useState<Trend[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const loadTrends = async (forceRefresh = false) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const nextTrends = forceRefresh
        ? await refreshMarketTrends()
        : await getMarketTrends();
      setTrends(nextTrends);
      setVisibleCount(PAGE_SIZE);
    } catch {
      setErrorMessage("Nao foi possivel atualizar as tendencias agora.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadTrends();
  }, []);

  const visibleTrends = trends.slice(0, visibleCount);
  const hasMoreTrends = visibleCount < trends.length;

  return (
    <section className="screen-container">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <PageHeader
          title="Tendencias de mercado"
          description="Sinais e movimentos relevantes para orientar decisao e canal."
        />
      </motion.div>

      <button
        type="button"
        onClick={() => void loadTrends(true)}
        className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
      >
        <RefreshCcw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
        Atualizar tendencias
      </button>

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
            Tendencias externas consolidadas via SerpApi, com fallback controlado quando a fonte nao responder.
          </p>
        </div>
      </motion.section>

      <div className="space-y-3">
        {isLoading ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">Buscando tendencias do mercado...</p>
          </div>
        ) : null}

        {!isLoading && errorMessage ? (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-center">
            <p className="text-sm text-destructive">{errorMessage}</p>
          </div>
        ) : null}

        {!isLoading && trends.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">
              Nenhuma tendencia disponivel no momento.
            </p>
          </div>
        ) : (
          visibleTrends.map((trend, index) => (
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
                <span className="rounded-full border border-success/20 bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
                  Em alta
                </span>
              </div>

              <p className="text-sm text-muted-foreground">
                {trafficFormatter.format(trend.traffic)} buscas
              </p>
            </motion.article>
          ))
        )}
      </div>

      {!isLoading && hasMoreTrends ? (
        <button
          type="button"
          onClick={() => setVisibleCount((current) => current + PAGE_SIZE)}
          className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        >
          Ver mais
        </button>
      ) : null}
    </section>
  );
};
