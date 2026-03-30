import type { MarketingCsvRow } from "@/types/marketing";
import type { Trend } from "@/services/trendsService";

interface ChannelPerformance {
  channel: string;
  clicks: number;
  conversionRate: number;
  conversions: number;
  costPerLead: number;
  ctr: number;
  leads: number;
  revenue: number;
  spend: number;
}

export interface GeneratedInsight {
  id: string;
  problem: string;
  opportunity: string;
  action: string;
  creativeIdea: string;
  priority: "Alta" | "Media" | "Baixa";
  channels: string[];
}

interface InsightsEngineInput {
  rows: MarketingCsvRow[];
  trends: Trend[];
}

const normalizePriority = (score: number): GeneratedInsight["priority"] => {
  if (score >= 80) return "Alta";
  if (score >= 60) return "Media";
  return "Baixa";
};

const buildChannelPerformance = (rows: MarketingCsvRow[]): ChannelPerformance[] => {
  const channelsMap = new Map<string, ChannelPerformance>();

  rows.forEach((row) => {
    const current = channelsMap.get(row.channel) ?? {
      channel: row.channel,
      clicks: 0,
      conversionRate: 0,
      conversions: 0,
      costPerLead: 0,
      ctr: 0,
      leads: 0,
      revenue: 0,
      spend: 0,
    };

    current.clicks += row.clicks;
    current.conversions += row.conversions;
    current.leads += row.leads;
    current.revenue += row.revenue;
    current.spend += row.spend;

    channelsMap.set(row.channel, current);
  });

  return Array.from(channelsMap.values()).map((channel) => ({
    ...channel,
    conversionRate: channel.leads === 0 ? 0 : (channel.conversions / channel.leads) * 100,
    costPerLead: channel.leads === 0 ? 0 : channel.spend / channel.leads,
    ctr: channel.clicks === 0 ? 0 : (channel.leads / channel.clicks) * 100,
  }));
};

export const generateInsights = ({ rows, trends }: InsightsEngineInput): GeneratedInsight[] => {
  if (!rows.length) {
    return [];
  }

  const performance = buildChannelPerformance(rows);
  const overallCostPerLead =
    rows.reduce((sum, row) => sum + row.spend, 0) /
    Math.max(rows.reduce((sum, row) => sum + row.leads, 0), 1);
  const bestChannel = [...performance].sort(
    (left, right) => right.conversionRate - left.conversionRate,
  )[0];
  const lowestCtrChannel = [...performance].sort((left, right) => left.ctr - right.ctr)[0];
  const highestCplChannel = [...performance].sort(
    (left, right) => right.costPerLead - left.costPerLead,
  )[0];
  const hottestTrend = [...trends].sort(
    (left, right) => right.traffic - left.traffic,
  )[0];

  const insights: GeneratedInsight[] = [];

  if (lowestCtrChannel && lowestCtrChannel.ctr < 12) {
    insights.push({
      id: "low-ctr",
      problem: `CTR baixo em ${lowestCtrChannel.channel} (${lowestCtrChannel.ctr.toFixed(1)}% de clique para lead).`,
      opportunity: hottestTrend
        ? `A tendencia externa "${hottestTrend.keyword}" esta em alta com ${new Intl.NumberFormat("pt-BR").format(hottestTrend.traffic)} buscas e pode renovar a mensagem desse canal.`
        : "Existe espaco para reposicionar a proposta de valor e recuperar resposta do publico.",
      action: `Revisar segmentacao, oferta e criativos de ${lowestCtrChannel.channel} com um novo teste A/B por 7 dias.`,
      creativeIdea: hottestTrend
        ? `Criar uma campanha conectando a promessa principal com "${hottestTrend.keyword}" em formato de prova social e ganho rapido.`
        : `Criar uma nova versao do anuncio com angulo de dor, prova social e CTA unico para ${lowestCtrChannel.channel}.`,
      priority: normalizePriority(86),
      channels: [lowestCtrChannel.channel],
    });
  }

  if (highestCplChannel && highestCplChannel.costPerLead > overallCostPerLead * 1.15) {
    insights.push({
      id: "high-cpl",
      problem: `Custo por lead alto em ${highestCplChannel.channel} (R$ ${highestCplChannel.costPerLead.toFixed(2)}).`,
      opportunity: "Uma redistribuicao parcial de verba pode reduzir aquisicao cara sem perder volume total.",
      action: `Reduzir 10% da verba de ${highestCplChannel.channel} e mover para campanhas com melhor eficiencia nas proximas 2 semanas.`,
      creativeIdea: `Montar um criativo comparativo com oferta objetiva, callout de beneficio e CTA direto para captacao mais qualificada.`,
      priority: normalizePriority(82),
      channels: [highestCplChannel.channel],
    });
  }

  if (hottestTrend) {
    insights.push({
      id: "external-trend",
      problem: `A alta de "${hottestTrend.keyword}" ainda nao aparece nas campanhas internas da operacao.`,
      opportunity: `O mercado brasileiro ja demonstra ${new Intl.NumberFormat("pt-BR").format(hottestTrend.traffic)} buscas em torno desse tema.`,
      action: `Lancar um teste rapido dessa narrativa no canal com melhor eficiencia comercial para validar aderencia.`,
      creativeIdea: `Desenvolver uma peca de oportunidade imediata com headline de tendencia, caso de uso pratico e CTA curto.`,
      priority: normalizePriority(74),
      channels: bestChannel ? [bestChannel.channel] : [lowestCtrChannel?.channel ?? "Mercado"],
    });
  }

  if (bestChannel) {
    insights.push({
      id: "best-conversion-channel",
      problem: `O melhor canal por conversao ainda nao esta sendo usado como playbook do restante da operacao.`,
      opportunity: `${bestChannel.channel} lidera a conversao com ${bestChannel.conversionRate.toFixed(1)}% e pode servir de referencia para os outros canais.`,
      action: `Replicar estrutura de campanha, copy e oferta de ${bestChannel.channel} nos canais com menor resposta.`,
      creativeIdea: `Criar um kit criativo inspirado em ${bestChannel.channel} com headline, prova social, CTA e variacoes por publico.`,
      priority: normalizePriority(68),
      channels: [bestChannel.channel],
    });
  }

  return insights.slice(0, 4);
};
