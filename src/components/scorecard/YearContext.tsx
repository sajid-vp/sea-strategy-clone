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
  // Default to the current calendar year if available, otherwise the most
  // recent year for which we have data. Prevents the dashboard from opening
  // on a future plan year (e.g. 2028) when "today" is 2026.
  const [year, setYear] = useState<number>(() => {
    const today = new Date().getFullYear();
    if (availableYears.includes(today)) return today;
    const past = availableYears.filter((y) => y <= today);
    if (past.length > 0) return past[past.length - 1];
    return availableYears[availableYears.length - 1] ?? today;
  });
  return (
    <Ctx.Provider value={{ year, setYear, availableYears }}>{children}</Ctx.Provider>
  );
};

export const useYear = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useYear must be used inside YearProvider");
  return c;
};