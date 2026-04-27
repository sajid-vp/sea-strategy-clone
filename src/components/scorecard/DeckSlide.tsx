import type { ReactNode } from "react";

interface Props {
  n: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

/**
 * Single-page "slide" frame. Each section on the dashboard is wrapped in this
 * component so the page reads like a deck while still being a normal scrollable
 * page (no next/prev navigation).
 *
 * Visual cues:
 *  - Slide number chip in the top-left
 *  - Generous padding / rounded card
 *  - Soft shadow to lift each slide off the muted page background
 *  - Subtle accent strip on the left edge
 */
export const DeckSlide = ({ n, title, subtitle, children }: Props) => {
  return (
    <section className="relative rounded-2xl border bg-card shadow-sm overflow-hidden">
      <div className="absolute inset-y-0 left-0 w-1 bg-primary/60" />
      <div className="px-8 pt-6 pb-3 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center justify-center h-5 min-w-[1.25rem] px-1.5 rounded-md bg-primary/10 text-primary text-[10px] font-semibold tabular-nums">
              {String(n).padStart(2, "0")}
            </span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Slide
            </span>
          </div>
          <h2 className="text-xl font-bold text-foreground leading-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="px-8 pb-8 pt-2">{children}</div>
    </section>
  );
};