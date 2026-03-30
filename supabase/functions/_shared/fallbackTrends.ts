export interface MarketTrend {
  keyword: string;
  traffic: number;
  source: "serpapi";
}

export const fallbackTrends: MarketTrend[] = [
  { keyword: "IA generativa marketing", traffic: 92000, source: "serpapi" },
  { keyword: "short-form video ads", traffic: 87000, source: "serpapi" },
  { keyword: "personalizacao em escala", traffic: 78000, source: "serpapi" },
  { keyword: "cookieless targeting", traffic: 71000, source: "serpapi" },
  { keyword: "social commerce", traffic: 65000, source: "serpapi" },
  { keyword: "UGC creator ads", traffic: 82000, source: "serpapi" },
];
