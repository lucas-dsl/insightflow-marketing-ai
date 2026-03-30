import { useState, type ReactNode } from "react";
import { AppStateContext } from "@/app/AppState";
import type { MarketingCsvRow } from "@/types/marketing";

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const [importedRows, setImportedRows] = useState<MarketingCsvRow[]>(() => {
    const storedRows = sessionStorage.getItem("csv_data");
    return storedRows ? (JSON.parse(storedRows) as MarketingCsvRow[]) : [];
  });
  const [importedFileName, setImportedFileName] = useState<string | null>(
    () => sessionStorage.getItem("csv_file_name"),
  );
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(
    () => sessionStorage.getItem("csv_source_type") === "demo",
  );
  const hasImportedData = importedRows.length > 0;

  const handleSetImportedData = (
    rows: MarketingCsvRow[],
    fileName: string,
    demo = false,
  ) => {
    setImportedRows(rows);
    setImportedFileName(fileName);
    setIsDemo(demo);
    sessionStorage.setItem("csv_data", JSON.stringify(rows));
    sessionStorage.setItem("csv_file_name", fileName);
    sessionStorage.setItem("csv_source_type", demo ? "demo" : "upload");
  };

  const handleClearImportedData = () => {
    setImportedRows([]);
    setImportedFileName(null);
    setIsDemo(false);
    sessionStorage.removeItem("csv_data");
    sessionStorage.removeItem("csv_file_name");
    sessionStorage.removeItem("csv_source_type");
  };

  return (
    <AppStateContext.Provider
      value={{
        clearImportedData: handleClearImportedData,
        hasImportedData,
        importedFileName,
        importedRows,
        isDemo,
        selectedChannel,
        setImportedData: handleSetImportedData,
        setIsDemo,
        setSelectedChannel,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};
