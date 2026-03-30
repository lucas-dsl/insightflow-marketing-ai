export const mockCampaignData = [
  { month: "Jan", leads: 320, conversions: 48, spend: 4200, revenue: 12800 },
  { month: "Fev", leads: 410, conversions: 62, spend: 5100, revenue: 18600 },
  { month: "Mar", leads: 380, conversions: 55, spend: 4800, revenue: 15400 },
  { month: "Abr", leads: 520, conversions: 78, spend: 6200, revenue: 23400 },
  { month: "Mai", leads: 490, conversions: 71, spend: 5800, revenue: 21200 },
  { month: "Jun", leads: 610, conversions: 95, spend: 7100, revenue: 28500 },
];

export const mockChannelData = [
  { name: "Google Ads", value: 35, color: "hsl(var(--chart-1))" },
  { name: "Meta Ads", value: 28, color: "hsl(var(--chart-2))" },
  { name: "Email", value: 20, color: "hsl(var(--chart-3))" },
  { name: "Orgânico", value: 12, color: "hsl(var(--chart-4))" },
  { name: "Outros", value: 5, color: "hsl(var(--chart-5))" },
];

export const mockTrends = [
  { keyword: "IA generativa marketing", interest: 92, change: +34, status: "rising" as const },
  { keyword: "short-form video ads", interest: 87, change: +21, status: "rising" as const },
  { keyword: "personalização em escala", interest: 78, change: +15, status: "rising" as const },
  { keyword: "cookieless targeting", interest: 71, change: +8, status: "stable" as const },
  { keyword: "social commerce", interest: 65, change: -3, status: "stable" as const },
  { keyword: "influencer micro", interest: 59, change: +12, status: "rising" as const },
];

export interface InsightItem {
  id: number;
  problem: string;
  trend: string;
  action: string;
  creative: string;
  impact: "Alto" | "Médio" | "Baixo";
  channels: string[];
}

export const mockInsights: InsightItem[] = [
  {
    id: 1,
    problem: "CTR do Meta Ads caiu 18% no último mês",
    trend: "\"UGC creator\" crescendo +34% no mercado",
    action: "Testar 3 creators com vídeos curtos de 15s",
    creative: "Criativo estilo rotina matinal + prova social com depoimento real",
    impact: "Alto",
    channels: ["Meta Ads", "Instagram"],
  },
  {
    id: 2,
    problem: "Taxa de abertura de email caiu para 19%",
    trend: "IA generativa para personalização em alta (+28%)",
    action: "Implementar assuntos dinâmicos gerados por IA",
    creative: "Série \"Seu resumo semanal\" com dados personalizados do lead",
    impact: "Alto",
    channels: ["Email", "Automação"],
  },
  {
    id: 3,
    problem: "CPA do Google Ads subiu 22% em 3 meses",
    trend: "SEO com conteúdo long-form ganhando tração (+15%)",
    action: "Realocar 15% do budget para conteúdo orgânico",
    creative: "Hub de conteúdo \"Guia definitivo\" com captura de lead integrada",
    impact: "Médio",
    channels: ["Google Ads", "SEO", "Content"],
  },
  {
    id: 4,
    problem: "Conversão de landing page estagnada em 2.1%",
    trend: "Social commerce com checkout nativo crescendo (+21%)",
    action: "Ativar Instagram Shopping + micro influenciadores",
    creative: "Campanha \"Compre direto do feed\" com unboxing de creators",
    impact: "Alto",
    channels: ["Instagram", "TikTok"],
  },
  {
    id: 5,
    problem: "Leads frios representam 60% do pipeline",
    trend: "Automação com scoring preditivo em alta (+18%)",
    action: "Implementar lead scoring com base em engajamento",
    creative: "Fluxo \"Reativação VIP\" com oferta exclusiva e countdown",
    impact: "Médio",
    channels: ["Email", "WhatsApp"],
  },
];

export type CampaignRow = typeof mockCampaignData[0];
