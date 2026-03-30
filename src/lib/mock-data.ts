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

export const mockInsights = [
  {
    id: 1,
    type: "opportunity" as const,
    title: "Aproveitar IA generativa em campanhas de email",
    description: "Seus dados mostram alta taxa de abertura em emails personalizados (42%). Combine com a tendência de IA generativa para criar variações de copy automatizadas.",
    impact: "Alto",
    effort: "Médio",
    channels: ["Email", "Automação"],
    actions: ["Implementar geração de assuntos com IA", "Teste A/B com 5 variações por segmento", "Personalizar CTAs por comportamento"],
  },
  {
    id: 2,
    type: "test" as const,
    title: "Teste A/B: Short-form video vs. carrossel no Meta",
    description: "A tendência de short-form video está em alta (+21%). Seu CPL no Meta Ads pode reduzir 15-25% testando Reels vs. carrossel estático.",
    impact: "Alto",
    effort: "Baixo",
    channels: ["Meta Ads", "Instagram"],
    actions: ["Criar 3 vídeos de 15s com gancho forte", "Manter carrossel como controle", "Rodar por 14 dias com budget igual"],
  },
  {
    id: 3,
    type: "optimization" as const,
    title: "Realocação de budget: Google → Orgânico",
    description: "Seu CPA em Google Ads subiu 18% nos últimos 3 meses. O tráfego orgânico tem CPA 3x menor. Invista em SEO + conteúdo.",
    impact: "Médio",
    effort: "Alto",
    channels: ["SEO", "Content"],
    actions: ["Reduzir 15% do budget de Google Ads", "Criar 8 artigos otimizados/mês", "Focar em long-tail keywords do setor"],
  },
  {
    id: 4,
    type: "campaign" as const,
    title: "Campanha de social commerce com micro influenciadores",
    description: "Tendência de social commerce + micro influenciadores convergem. Teste uma campanha integrada com checkout direto no Instagram.",
    impact: "Alto",
    effort: "Médio",
    channels: ["Instagram", "TikTok"],
    actions: ["Selecionar 10 micro influenciadores do nicho", "Criar códigos de desconto exclusivos", "Ativar Instagram Shopping"],
  },
];

export type CampaignRow = typeof mockCampaignData[0];
export type InsightItem = typeof mockInsights[0];
