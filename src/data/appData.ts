import {
  mockCampaignData,
  mockChannelData,
  mockInsights,
  mockTrends,
} from "@/data/mockMarketingData";

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

interface DashboardSourceOptions {
  hasImportedData: boolean;
  isDemo: boolean;
}

export const getDashboardSource = ({
  hasImportedData,
  isDemo,
}: DashboardSourceOptions) => {
  if (isDemo || hasImportedData) {
    return {
      campaignData: mockCampaignData,
      channelData: mockChannelData,
      insights: mockInsights,
      trends: mockTrends,
    };
  }

  return {
    campaignData: emptyCampaignData,
    channelData: emptyChannelData,
    insights: [],
    trends: [],
  };
};
