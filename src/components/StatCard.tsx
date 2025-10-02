import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  children,
  className,
}: StatCardProps) => {
  return (
    <Card className={cn("p-6 hover:shadow-md transition-shadow", className)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          {icon}
          {title}
        </div>
        {subtitle && (
          <span className="text-xs text-muted-foreground">{subtitle}</span>
        )}
      </div>
      <div className="text-3xl font-bold text-foreground mb-2">{value}</div>
      {children}
    </Card>
  );
};
