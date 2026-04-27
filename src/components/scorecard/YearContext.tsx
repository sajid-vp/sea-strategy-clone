import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import { strategicInitiatives } from "@/data/scorecardData";

interface YearCtx {
  year: number;
  setYear: (y: number) => void;
  availableYears: number[];
}

const Ctx = createContext<YearCtx | null>(null);

export const YearProvider = ({ children }: { children: ReactNode }) => {
  const availableYears = useMemo(() => {
    const ys = new Set<number>();
    for (const init of strategicInitiatives) {
      for (const k of init.kpis) for (const p of k.trend) ys.add(p.year);
    }
    return Array.from(ys).sort();
  }, []);
  const [year, setYear] = useState<number>(
    availableYears[availableYears.length - 1] ?? new Date().getFullYear(),
  );
  return (
    <Ctx.Provider value={{ year, setYear, availableYears }}>{children}</Ctx.Provider>
  );
};

export const useYear = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useYear must be used inside YearProvider");
  return c;
};