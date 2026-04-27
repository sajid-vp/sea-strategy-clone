import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

/**
 * Lightweight, presentable section header used across the dashboard.
 * Icon chip on the left, eyebrow + title + subtitle stacked, optional
 * action slot on the right.
 */
export const SectionHeader = ({
  icon: Icon,
  eyebrow,
  title,
  subtitle,
  actions,
}: Props) => {
  return (
    <div className="flex items-start justify-between gap-4 mb-2.5">
      <div className="flex items-start gap-3 min-w-0">
        <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          {eyebrow && (
            <div className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold">
              {eyebrow}
            </div>
          )}
          <h2 className="text-lg font-semibold text-foreground leading-tight tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
};