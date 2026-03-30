import { mockTrends } from "@/data/mockMarketingData";

export interface Trend {
  keyword: string;
  traffic: number;
  source: "serpapi";
}

const fallbackTrends: Trend[] = mockTrends.map((trend) => ({
  keyword: trend.keyword,
  traffic: trend.interest * 1000,
  source: "serpapi",
}));

let cachedTrends: Trend[] | null = null;
let cachedAt = 0;

const CACHE_TTL_MS = 15 * 60 * 1000;

const getSupabaseUrl = () => import.meta.env.VITE_SUPABASE_URL?.trim() ?? "";
const getSupabaseAnonKey = () => import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? "";

const getMarketTrendsFunctionUrl = () => {
  const supabaseUrl = getSupabaseUrl();

  if (!supabaseUrl) {
    return "";
  }

  return `${supabaseUrl}/functions/v1/market-trends`;
};

const fetchMarketTrends = async (): Promise<Trend[]> => {
  const functionUrl = getMarketTrendsFunctionUrl();
  const anonKey = getSupabaseAnonKey();

  if (!functionUrl || !anonKey) {
    console.warn(
      "[trendsService] Supabase nao configurado. Usando fallback local de tendencias.",
    );
    return fallbackTrends;
  }

  let response: Response;

  try {
    response = await fetch(functionUrl, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
    });
  } catch (error) {
    console.warn("[trendsService] Erro de rede ao chamar a Edge Function.", error);
    return fallbackTrends;
  }

  if (!response.ok) {
    console.warn("[trendsService] Edge Function respondeu com erro.", {
      status: response.status,
      statusText: response.statusText,
    });
    return fallbackTrends;
  }

  const payload = (await response.json()) as Trend[];
  const trends = payload?.filter(
    (trend) => trend.keyword?.trim() && Number.isFinite(trend.traffic) && trend.traffic > 0,
  );

  if (!trends?.length) {
    console.warn(
      "[trendsService] Edge Function nao retornou tendencias validas. Usando fallback local.",
      {
        cached: response.headers.get("X-Market-Trends-Cached"),
        fallback: response.headers.get("X-Market-Trends-Fallback"),
        source: response.headers.get("X-Market-Trends-Source"),
      },
    );
    return fallbackTrends;
  }

  if (response.headers.get("X-Market-Trends-Fallback") === "true") {
    console.info("[trendsService] Edge Function retornou fallback controlado.", {
      cached: response.headers.get("X-Market-Trends-Cached"),
      source: response.headers.get("X-Market-Trends-Source"),
    });
  }

  return trends;
};

export const getMarketTrends = async (): Promise<Trend[]> => {
  if (cachedTrends && Date.now() - cachedAt < CACHE_TTL_MS) {
    return cachedTrends;
  }

  const trends = await fetchMarketTrends();
  cachedTrends = trends;
  cachedAt = Date.now();
  return trends;
};

export const refreshMarketTrends = async () => {
  cachedTrends = null;
  cachedAt = 0;
  return getMarketTrends();
};

