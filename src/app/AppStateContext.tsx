import { useState, type ReactNode } from "react";
import { AppStateContext } from "@/app/AppState";

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const [hasImportedData, setHasImportedData] = useState(
    () => Boolean(sessionStorage.getItem("csv_data")),
  );
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  return (
    <AppStateContext.Provider
      value={{
        hasImportedData,
        isDemo,
        selectedChannel,
        setHasImportedData,
        setIsDemo,
        setSelectedChannel,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};
