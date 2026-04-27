import { Button } from "@/components/ui/button";
import { useYear } from "./YearContext";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface YearSelectorProps {
  /** Use 'onPrimary' when rendered on top of a primary-colored banner. */
  variant?: "default" | "onPrimary";
}

export const YearSelector = ({ variant = "default" }: YearSelectorProps) => {
  const { year, setYear, availableYears } = useYear();
  const onPrimary = variant === "onPrimary";
  return (
    <div className="inline-flex items-center gap-2">
      <span
        className={cn(
          "inline-flex items-center gap-1.5 text-xs",
          onPrimary
            ? "text-primary-foreground/80"
            : "text-muted-foreground",
        )}
      >
        <Calendar className="h-3.5 w-3.5" />
        Year
      </span>
      <div
        className={cn(
          "inline-flex rounded-md p-0.5 border",
          onPrimary
            ? "bg-primary-foreground/10 border-primary-foreground/25 backdrop-blur-sm"
            : "bg-card",
        )}
      >
        {availableYears.map((y) => {
          const active = y === year;
          return (
            <button
              key={y}
              type="button"
              onClick={() => setYear(y)}
              className={cn(
                "h-7 px-3 text-xs font-medium rounded-[4px] transition-colors",
                onPrimary
                  ? active
                    ? "bg-primary-foreground text-primary shadow-sm"
                    : "text-primary-foreground/90 hover:bg-primary-foreground/15"
                  : active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground/70 hover:bg-muted",
              )}
              aria-pressed={active}
            >
              {y}
            </button>
          );
        })}
      </div>
    </div>
  );
};