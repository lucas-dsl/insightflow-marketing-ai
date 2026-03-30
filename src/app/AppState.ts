import { createContext } from "react";

export interface AppStateValue {
  hasImportedData: boolean;
  isDemo: boolean;
  selectedChannel: string | null;
  setHasImportedData: (value: boolean) => void;
  setIsDemo: (value: boolean) => void;
  setSelectedChannel: (value: string | null) => void;
}

export const AppStateContext = createContext<AppStateValue | undefined>(undefined);
