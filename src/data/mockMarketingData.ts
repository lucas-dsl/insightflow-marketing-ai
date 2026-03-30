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
  { name: "Instagram", value: 10, color: "hsl(var(--chart-4))" },
  { name: "Organico", value: 7, color: "hsl(var(--chart-5))" },
];

export const allChannels = mockChannelData.map((channel) => channel.name);

export type CampaignRow = (typeof mockCampaignData)[number];

export const mockTrends = [
  {
    keyword: "IA generativa marketing",
    interest: 92,
    change: 34,
    status: "rising" as const,
    channels: ["Google Ads", "Meta Ads", "Email"],
  },
  {
    keyword: "short-form video ads",
    interest: 87,
    change: 21,
    status: "rising" as const,
    channels: ["Meta Ads", "Instagram", "TikTok"],
  },
  {
    keyword: "personalizacao em escala",
    interest: 78,
    change: 15,
    status: "rising" as const,
    channels: ["Email", "Automacao"],
  },
  {
    keyword: "cookieless targeting",
    interest: 71,
    change: 8,
    status: "stable" as const,
    channels: ["Google Ads", "Meta Ads"],
  },
  {
    keyword: "social commerce",
    interest: 65,
    change: -3,
    status: "stable" as const,
    channels: ["Instagram", "TikTok"],
  },
  {
    keyword: "influencer micro",
    interest: 59,
    change: 12,
    status: "rising" as const,
    channels: ["Instagram", "TikTok"],
  },
  {
    keyword: "UGC creator ads",
    interest: 82,
    change: 28,
    status: "rising" as const,
    channels: ["Instagram", "Meta Ads", "TikTok"],
  },
  {
    keyword: "email automation AI",
    interest: 74,
    change: 19,
    status: "rising" as const,
    channels: ["Email", "Automacao"],
  },
];

export interface InsightItem {
  id: number;
  problem: string;
  trend: string;
  action: string;
  creative: string;
  impact: "Alto" | "Medio" | "Baixo";
  channels: string[];
}

export const mockInsights: InsightItem[] = [
  {
    id: 1,
    problem: "CTR do Meta Ads caiu 18% no ultimo mes",
    trend: '"UGC creator" crescendo +34% no mercado',
    action: "Testar 3 creators com videos curtos de 15s",
    creative: "Criativo estilo rotina matinal com prova social",
    impact: "Alto",
    channels: ["Meta Ads", "Instagram"],
  },
  {
    id: 2,
    problem: "Taxa de abertura de email caiu para 19%",
    trend: "IA generativa para personalizacao em alta (+28%)",
    action: "Implementar assuntos dinamicos gerados por IA",
    creative: 'Serie "Seu resumo semanal" com dados do lead',
    impact: "Alto",
    channels: ["Email", "Automacao"],
  },
  {
    id: 3,
    problem: "CPA do Google Ads subiu 22% em 3 meses",
    trend: "SEO com conteudo long-form ganhando tracao (+15%)",
    action: "Realocar 15% do budget para conteudo organico",
    creative: 'Hub de conteudo "Guia definitivo" com captura de lead',
    impact: "Medio",
    channels: ["Google Ads", "Organico"],
  },
  {
    id: 4,
    problem: "Conversao de landing page estagnada em 2.1%",
    trend: "Social commerce com checkout nativo crescendo (+21%)",
    action: "Ativar Instagram Shopping e micro influenciadores",
    creative: 'Campanha "Compre direto do feed" com unboxing',
    impact: "Alto",
    channels: ["Instagram", "TikTok"],
  },
  {
    id: 5,
    problem: "Leads frios representam 60% do pipeline",
    trend: "Automacao com scoring preditivo em alta (+18%)",
    action: "Implementar lead scoring com base em engajamento",
    creative: 'Fluxo "Reativacao VIP" com oferta exclusiva',
    impact: "Medio",
    channels: ["Email", "WhatsApp"],
  },
  {
    id: 6,
    problem: "Alcance organico do Instagram caiu 25%",
    trend: "Reels e short-form dominam o algoritmo (+31%)",
    action: "Criar 5 Reels por semana com hooks fortes",
    creative: 'Serie "Bastidores em 15s" do dia a dia da marca',
    impact: "Alto",
    channels: ["Instagram"],
  },
];
