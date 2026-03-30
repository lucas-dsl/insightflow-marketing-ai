import type { CampaignRow } from "@/data/mockMarketingData";

type TrendItem = {
  change: number;
  channels: string[];
  interest: number;
  keyword: string;
  status: "rising" | "stable";
};

type ChannelItem = {
  color: string;
  name: string;
  value: number;
};

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
  campaignData: CampaignRow[];
  channelData: ChannelItem[];
  trends: TrendItem[];
}

interface ChannelPerformance {
  channel: string;
  clicks: number;
  conversionRate: number;
  conversions: number;
  costPerLead: number;
  ctr: number;
  leads: number;
  share: number;
}

const channelPerformanceProfiles: Record<
  string,
  { clickShare: number; conversionBoost: number; ctrBase: number; leadBoost: number; spendBoost: number }
> = {
  Email: {
    clickShare: 0.16,
    conversionBoost: 1.35,
    ctrBase: 3.8,
    leadBoost: 0.9,
    spendBoost: 0.55,
  },
  "Google Ads": {
    clickShare: 0.18,
    conversionBoost: 1.08,
    ctrBase: 2.4,
    leadBoost: 1,
    spendBoost: 1.15,
  },
  Instagram: {
    clickShare: 0.13,
    conversionBoost: 0.88,
    ctrBase: 1.7,
    leadBoost: 0.86,
    spendBoost: 0.9,
  },
  "Meta Ads": {
    clickShare: 0.15,
    conversionBoost: 0.94,
    ctrBase: 1.5,
    leadBoost: 0.95,
    spendBoost: 1.02,
  },
  Organico: {
    clickShare: 0.11,
    conversionBoost: 1.18,
    ctrBase: 3.2,
    leadBoost: 0.72,
    spendBoost: 0.25,
  },
};

const normalizePriority = (score: number): GeneratedInsight["priority"] => {
  if (score >= 80) return "Alta";
  if (score >= 60) return "Media";
  return "Baixa";
};

const buildChannelPerformance = (
  campaignData: CampaignRow[],
  channelData: ChannelItem[],
): ChannelPerformance[] => {
  const latest = campaignData[campaignData.length - 1];

  return channelData.map((channel) => {
    const share = channel.value / 100;
    const profile = channelPerformanceProfiles[channel.name] ?? {
      clickShare: 0.14,
      conversionBoost: 1,
      ctrBase: 2,
      leadBoost: 1,
      spendBoost: 1,
    };
    const leads = latest.leads * share * profile.leadBoost;
    const conversions = latest.conversions * share * profile.conversionBoost;
    const clicks = Math.max(leads / 0.28, latest.leads * share * profile.clickShare);
    const impressions = clicks / (profile.ctrBase / 100);
    const ctr = impressions === 0 ? 0 : (clicks / impressions) * 100;
    const spend = latest.spend * share * profile.spendBoost;
    const costPerLead = leads === 0 ? 0 : spend / leads;
    const conversionRate = leads === 0 ? 0 : (conversions / leads) * 100;

    return {
      channel: channel.name,
      clicks,
      conversionRate,
      conversions,
      costPerLead,
      ctr,
      leads,
      share: channel.value,
    };
  });
};

export const generateInsights = ({
  campaignData,
  channelData,
  trends,
}: InsightsEngineInput): GeneratedInsight[] => {
  if (!campaignData.length || !channelData.length || !trends.length) {
    return [];
  }

  const performance = buildChannelPerformance(campaignData, channelData);
  const latest = campaignData[campaignData.length - 1];
  const previous = campaignData[campaignData.length - 2] ?? campaignData[campaignData.length - 1];
  const overallCostPerLead = latest.leads === 0 ? 0 : latest.spend / latest.leads;
  const bestChannel = [...performance].sort(
    (left, right) => right.conversionRate - left.conversionRate,
  )[0];
  const worstCtrChannel = [...performance].sort((left, right) => left.ctr - right.ctr)[0];
  const highestCplChannel = [...performance].sort(
    (left, right) => right.costPerLead - left.costPerLead,
  )[0];
  const hottestTrend = [...trends].sort((left, right) => right.change - left.change)[0];
  const leadsGrowth =
    previous.leads === 0 ? 0 : ((latest.leads - previous.leads) / previous.leads) * 100;

  const insights: GeneratedInsight[] = [];

  if (worstCtrChannel && worstCtrChannel.ctr < 2.2) {
    insights.push({
      id: "low-ctr",
      problem: `CTR abaixo do ideal em ${worstCtrChannel.channel} (${worstCtrChannel.ctr.toFixed(1)}%).`,
      opportunity: `A tendencia "${hottestTrend.keyword}" cresce ${hottestTrend.change}% e conversa com esse canal.`,
      action: `Testar novas aberturas, criativos e segmentacoes em ${worstCtrChannel.channel} por 7 dias.`,
      creativeIdea: `Criar uma serie com gancho forte nos 3 primeiros segundos conectando a oferta com "${hottestTrend.keyword}".`,
      priority: normalizePriority(88),
      channels: Array.from(new Set([worstCtrChannel.channel, ...hottestTrend.channels])),
    });
  }

  if (highestCplChannel && highestCplChannel.costPerLead > overallCostPerLead * 1.1) {
    insights.push({
      id: "high-cpl",
      problem: `Custo por lead elevado em ${highestCplChannel.channel} (R$ ${highestCplChannel.costPerLead.toFixed(2)}).`,
      opportunity: `Existe margem para reduzir CPL redistribuindo verba para jornadas e formatos mais eficientes.`,
      action: `Diminuir 10% da verba de ${highestCplChannel.channel} e testar segmentacoes de maior intencao.`,
      creativeIdea: `Montar uma campanha comparativa com prova social, oferta direta e CTA unico para reduzir friccao.`,
      priority: normalizePriority(82),
      channels: [highestCplChannel.channel],
    });
  }

  if (hottestTrend && hottestTrend.change > 15) {
    insights.push({
      id: "rising-trend",
      problem: `O time ainda nao transformou a alta de "${hottestTrend.keyword}" em campanha aplicada.`,
      opportunity: `A busca externa esta acelerando ${hottestTrend.change}% com interesse ${hottestTrend.interest}/100.`,
      action: `Subir um teste rapido alinhado a "${hottestTrend.keyword}" nos canais mais aderentes desta tendencia.`,
      creativeIdea: `Publicar uma campanha com linguagem de oportunidade imediata, benchmark do mercado e CTA de resposta curta.`,
      priority: normalizePriority(76),
      channels: hottestTrend.channels,
    });
  }

  if (bestChannel) {
    insights.push({
      id: "best-conversion-channel",
      problem: `O melhor canal por conversao ainda nao esta sendo usado como referencia operacional.`,
      opportunity: `${bestChannel.channel} lidera com taxa de conversao estimada de ${bestChannel.conversionRate.toFixed(1)}%.`,
      action: `Replicar a estrutura de copy, oferta e audiencia de ${bestChannel.channel} nos canais com menor eficiencia.`,
      creativeIdea: `Criar um kit de criativos inspirado no canal campeao: headline, prova social, CTA e variacoes por publico.`,
      priority: normalizePriority(leadsGrowth >= 10 ? 72 : 64),
      channels: [bestChannel.channel],
    });
  }

  return insights.slice(0, 4);
};
