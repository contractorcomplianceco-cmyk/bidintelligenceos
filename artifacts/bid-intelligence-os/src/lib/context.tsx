import { createContext, useContext, useState, ReactNode } from "react";
import { VerticalId, DEFAULT_VERTICAL, getVertical, VerticalConfig } from "./verticals";

type Mode = "standalone" | "addon";

interface AppContextType {
  mode: Mode;
  setMode: (mode: Mode) => void;
  vertical: VerticalId;
  setVertical: (vertical: VerticalId) => void;
  verticalConfig: VerticalConfig;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>("standalone");
  const [vertical, setVerticalState] = useState<VerticalId>(() => {
    const saved = sessionStorage.getItem("bios-vertical") as VerticalId | null;
    return saved ?? DEFAULT_VERTICAL;
  });

  const setVertical = (v: VerticalId) => {
    sessionStorage.setItem("bios-vertical", v);
    setVerticalState(v);
  };

  return (
    <AppContext.Provider
      value={{ mode, setMode, vertical, setVertical, verticalConfig: getVertical(vertical) }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
