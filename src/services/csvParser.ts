import Papa from "papaparse";
import {
  REQUIRED_CSV_COLUMNS,
  type CsvPreview,
  type MarketingCsvRow,
  type RequiredCsvColumn,
} from "@/types/marketing";

type RawCsvRow = Record<string, string>;

export interface CsvParseSuccess {
  columns: RequiredCsvColumn[];
  fileName: string;
  rows: MarketingCsvRow[];
}

export interface CsvParseFailure {
  error: string;
}

export type CsvParseResult = CsvParseSuccess | CsvParseFailure;

const parseCsvString = (csvText: string): Promise<Papa.ParseResult<RawCsvRow>> =>
  new Promise((resolve, reject) => {
    Papa.parse<RawCsvRow>(csvText, {
      complete: resolve,
      error: reject,
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim().toLowerCase(),
    });
  });

const validateHeaders = (fields: string[] | undefined): fields is RequiredCsvColumn[] => {
  if (!fields) {
    return false;
  }

  return REQUIRED_CSV_COLUMNS.every((column) => fields.includes(column));
};

const formatMissingColumnsMessage = (fields: string[] | undefined) => {
  const missingColumns = REQUIRED_CSV_COLUMNS.filter(
    (column) => !fields?.includes(column),
  );

  return `O CSV precisa conter as colunas: ${REQUIRED_CSV_COLUMNS.join(
    ", ",
  )}. Faltando: ${missingColumns.join(", ")}.`;
};

const parseNumberField = (
  row: RawCsvRow,
  rowIndex: number,
  field: "spend" | "clicks" | "leads" | "conversions" | "revenue",
) => {
  const rawValue = row[field]?.trim();

  if (!rawValue) {
    throw new Error(`Linha ${rowIndex + 2}: o campo "${field}" esta vazio.`);
  }

  const normalizedValue = rawValue.replace(",", ".");
  const parsedValue = Number(normalizedValue);

  if (Number.isNaN(parsedValue)) {
    throw new Error(
      `Linha ${rowIndex + 2}: o campo "${field}" precisa ser numerico.`,
    );
  }

  return parsedValue;
};

const validateDate = (value: string, rowIndex: number) => {
  if (!value.trim()) {
    throw new Error(`Linha ${rowIndex + 2}: o campo "date" esta vazio.`);
  }

  if (Number.isNaN(Date.parse(value))) {
    throw new Error(
      `Linha ${rowIndex + 2}: o campo "date" precisa ter uma data valida.`,
    );
  }
};

const mapRow = (row: RawCsvRow, rowIndex: number): MarketingCsvRow => {
  validateDate(row.date ?? "", rowIndex);

  const channel = row.channel?.trim();
  const campaign = row.campaign?.trim();

  if (!channel) {
    throw new Error(`Linha ${rowIndex + 2}: o campo "channel" esta vazio.`);
  }

  if (!campaign) {
    throw new Error(`Linha ${rowIndex + 2}: o campo "campaign" esta vazio.`);
  }

  return {
    campaign,
    channel,
    clicks: parseNumberField(row, rowIndex, "clicks"),
    conversions: parseNumberField(row, rowIndex, "conversions"),
    date: row.date.trim(),
    leads: parseNumberField(row, rowIndex, "leads"),
    revenue: parseNumberField(row, rowIndex, "revenue"),
    spend: parseNumberField(row, rowIndex, "spend"),
  };
};

export const parseCsvText = async (
  csvText: string,
  fileName: string,
): Promise<CsvParseResult> => {
  try {
    const result = await parseCsvString(csvText);

    if (!validateHeaders(result.meta.fields)) {
      return { error: formatMissingColumnsMessage(result.meta.fields) };
    }

    const rows = result.data.map(mapRow);

    if (!rows.length) {
      return { error: "O arquivo CSV esta vazio ou nao possui linhas validas." };
    }

    return {
      columns: REQUIRED_CSV_COLUMNS,
      fileName,
      rows,
    };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Nao foi possivel processar o CSV. Tente novamente com um arquivo valido.",
    };
  }
};

export const parseCsvFile = async (file: File): Promise<CsvParseResult> => {
  const csvText = await file.text();
  return parseCsvText(csvText, file.name);
};

export const buildCsvPreview = (
  parsed: CsvParseSuccess,
  limit = 5,
): CsvPreview => ({
  columns: parsed.columns,
  fileName: parsed.fileName,
  rows: parsed.rows.slice(0, limit),
});
