import { Button } from "@/components/ui/button";
import { useYear } from "./YearContext";
import { Calendar } from "lucide-react";

export const YearSelector = () => {
  const { year, setYear, availableYears } = useYear();
  return (
    <div className="inline-flex items-center gap-2">
      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
        <Calendar className="h-3.5 w-3.5" />
        Year
      </span>
      <div className="inline-flex rounded-md border bg-card p-0.5">
        {availableYears.map((y) => (
          <Button
            key={y}
            size="sm"
            variant={y === year ? "default" : "ghost"}
            className="h-7 px-3 text-xs"
            onClick={() => setYear(y)}
          >
            {y}
          </Button>
        ))}
      </div>
    </div>
  );
};