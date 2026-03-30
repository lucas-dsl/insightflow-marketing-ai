import { corsHeaders } from "../_shared/cors.ts";
import {
  fallbackTrends,
  type MarketTrend,
} from "../_shared/fallbackTrends.ts";

const SERPAPI_URL = "https://serpapi.com/search.json";

interface SerpApiTrendingSearch {
  query?: string;
  search_volume?: number;
}

interface SerpApiResponse {
  error?: string;
  trending_searches?: SerpApiTrendingSearch[];
}

const buildResponseHeaders = (meta?: {
  cached?: boolean;
  fallback?: boolean;
  source?: string;
}) => ({
  ...corsHeaders,
  "X-Market-Trends-Cached": String(Boolean(meta?.cached)),
  "X-Market-Trends-Fallback": String(Boolean(meta?.fallback)),
  "X-Market-Trends-Source": meta?.source ?? "unknown",
});

const jsonResponse = (
  body: unknown,
  status = 200,
  meta?: {
    cached?: boolean;
    fallback?: boolean;
    source?: string;
  },
) =>
  new Response(JSON.stringify(body), {
    headers: buildResponseHeaders(meta),
    status,
  });

const mapSerpApiResponseToTrends = (payload: SerpApiResponse): MarketTrend[] => {
  const items = payload.trending_searches ?? [];

  return items
    .map((item) => ({
      keyword: item.query?.trim() ?? "",
      traffic: Number(item.search_volume ?? 0),
      source: "serpapi" as const,
    }))
    .filter((trend) => trend.keyword.length > 0 && trend.traffic > 0);
};

const fetchSerpApiTrends = async (): Promise<MarketTrend[]> => {
  const serpApiKey = Deno.env.get("SERPAPI_KEY");

  if (!serpApiKey) {
    throw new Error("SERPAPI_KEY nao configurada na Edge Function.");
  }

  const url = new URL(SERPAPI_URL);
  url.searchParams.set("engine", "google_trends_trending_now");
  url.searchParams.set("geo", "BR");
  url.searchParams.set("hours", "24");
  url.searchParams.set("hl", "pt-BR");
  url.searchParams.set("api_key", serpApiKey);

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Falha ao buscar tendencias na SerpApi: ${response.status}`);
  }

  const payload = (await response.json()) as SerpApiResponse;

  if (payload.error) {
    throw new Error(`SerpApi respondeu com erro: ${payload.error}`);
  }

  return mapSerpApiResponseToTrends(payload);
};

// Preparado para um cache futuro em tabela `market_trends`.
// Exemplo de proximo passo:
// 1. Ler cache valido do banco antes do fetch externo.
// 2. Persistir as tendencias novas apos parse bem-sucedido.
const getFutureCachedTrends = async (): Promise<MarketTrend[] | null> => null;
const persistFutureCachedTrends = async (_trends: MarketTrend[]) => {};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (!["GET", "POST"].includes(request.method)) {
    return jsonResponse({ error: "Metodo nao permitido." }, 405);
  }

  try {
    const cachedTrends = await getFutureCachedTrends();

    if (cachedTrends?.length) {
      return jsonResponse(cachedTrends, 200, {
        cached: true,
        fallback: false,
        source: "supabase-cache",
      });
    }

    const trends = await fetchSerpApiTrends();

    if (!trends.length) {
      console.warn("[market-trends] SerpApi retornou sem itens validos. Aplicando fallback.");

      return jsonResponse(fallbackTrends, 200, {
        cached: false,
        fallback: true,
        source: "fallback",
      });
    }

    await persistFutureCachedTrends(trends);

    return jsonResponse(trends, 200, {
      cached: false,
      fallback: false,
      source: "serpapi",
    });
  } catch (error) {
    console.error("[market-trends] Erro ao buscar tendencias externas.", error);

    return jsonResponse(fallbackTrends, 200, {
      cached: false,
      fallback: true,
      source: "fallback",
    });
  }
});
