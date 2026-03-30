import { createContext, useContext, useState, type ReactNode } from "react";

interface FilterContextType {
  selectedChannel: string | null;
  setSelectedChannel: (channel: string | null) => void;
  isDemo: boolean;
  setIsDemo: (demo: boolean) => void;
}

const FilterContext = createContext<FilterContextType>({
  selectedChannel: null,
  setSelectedChannel: () => {},
  isDemo: true,
  setIsDemo: () => {},
});

export const useFilter = () => useContext(FilterContext);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(true);

  return (
    <FilterContext.Provider value={{ selectedChannel, setSelectedChannel, isDemo, setIsDemo }}>
      {children}
    </FilterContext.Provider>
  );
};
