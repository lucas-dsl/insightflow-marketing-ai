import { createContext } from "react";
import type { MarketingCsvRow } from "@/types/marketing";

export interface AppStateValue {
  hasImportedData: boolean;
  importedFileName: string | null;
  importedRows: MarketingCsvRow[];
  isDemo: boolean;
  selectedChannel: string | null;
  clearImportedData: () => void;
  setImportedData: (rows: MarketingCsvRow[], fileName: string, isDemo?: boolean) => void;
  setIsDemo: (value: boolean) => void;
  setSelectedChannel: (value: string | null) => void;
}

export const AppStateContext = createContext<AppStateValue | undefined>(undefined);
