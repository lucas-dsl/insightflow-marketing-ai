export const REQUIRED_CSV_COLUMNS = [
  "date",
  "channel",
  "campaign",
  "spend",
  "clicks",
  "leads",
  "conversions",
  "revenue",
] as const;

export type RequiredCsvColumn = (typeof REQUIRED_CSV_COLUMNS)[number];

export interface MarketingCsvRow {
  date: string;
  channel: string;
  campaign: string;
  spend: number;
  clicks: number;
  leads: number;
  conversions: number;
  revenue: number;
}

export interface CsvPreview {
  columns: RequiredCsvColumn[];
  fileName: string;
  rows: MarketingCsvRow[];
}
