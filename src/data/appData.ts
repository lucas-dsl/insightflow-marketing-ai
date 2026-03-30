import { mockChannelData, mockTrends } from "@/data/mockMarketingData";
import type { MarketingCsvRow } from "@/types/marketing";

export const emptyCampaignData = [
  { month: "Jan", leads: 0, conversions: 0, spend: 0, revenue: 0 },
  { month: "Fev", leads: 0, conversions: 0, spend: 0, revenue: 0 },
  { month: "Mar", leads: 0, conversions: 0, spend: 0, revenue: 0 },
  { month: "Abr", leads: 0, conversions: 0, spend: 0, revenue: 0 },
  { month: "Mai", leads: 0, conversions: 0, spend: 0, revenue: 0 },
  { month: "Jun", leads: 0, conversions: 0, spend: 0, revenue: 0 },
];

export const emptyChannelData = mockChannelData.map((channel) => ({
  ...channel,
  value: 0,
}));

const monthFormatter = new Intl.DateTimeFormat("pt-BR", { month: "short" });

const normalizeMonthLabel = (date: string) => {
  const label = monthFormatter.format(new Date(date));
  return label.charAt(0).toUpperCase() + label.slice(1, 3);
};

const groupByMonth = (rows: MarketingCsvRow[]) => {
  const monthlyMap = new Map<
    string,
    { leads: number; conversions: number; revenue: number; spend: number }
  >();

  rows.forEach((row) => {
    const month = normalizeMonthLabel(row.date);
    const current = monthlyMap.get(month) ?? {
      conversions: 0,
      leads: 0,
      revenue: 0,
      spend: 0,
    };

    current.leads += row.leads;
    current.conversions += row.conversions;
    current.revenue += row.revenue;
    current.spend += row.spend;

    monthlyMap.set(month, current);
  });

  return Array.from(monthlyMap.entries()).map(([month, values]) => ({
    month,
    ...values,
  }));
};

const groupByChannel = (rows: MarketingCsvRow[]) => {
  const totalLeads = rows.reduce((sum, row) => sum + row.leads, 0);
  const channelsMap = new Map<string, number>();

  rows.forEach((row) => {
    const current = channelsMap.get(row.channel) ?? 0;
    channelsMap.set(row.channel, current + row.leads);
  });

  return Array.from(channelsMap.entries()).map(([name, leads], index) => ({
    color: mockChannelData[index % mockChannelData.length]?.color ?? "hsl(var(--chart-1))",
    name,
    value: totalLeads === 0 ? 0 : Number(((leads / totalLeads) * 100).toFixed(1)),
  }));
};

export const getDashboardSource = (importedRows: MarketingCsvRow[]) => {
  if (!importedRows.length) {
    return {
      availableChannels: [],
      campaignData: emptyCampaignData,
      channelData: emptyChannelData,
      trends: mockTrends,
    };
  }

  const campaignData = groupByMonth(importedRows);
  const channelData = groupByChannel(importedRows);

  return {
    availableChannels: channelData.map((channel) => channel.name),
    campaignData:
      campaignData.length >= 2
        ? campaignData
        : [...emptyCampaignData.slice(0, 5), campaignData[0]].filter(Boolean),
    channelData,
    trends: mockTrends,
  };
};
