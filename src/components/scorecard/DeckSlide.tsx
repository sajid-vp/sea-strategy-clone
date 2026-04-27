import type { ReactNode } from "react";

interface Props {
  n: number;
  title: string;
  subtitle?: string;
  eyebrow?: string;
  children: ReactNode;
}

/**
 * Presentation-grade slide frame. Each section is wrapped in this so the page
 * reads like a polished deck — large numeric chapter mark, bold title, ruled
 * divider and generous internal padding. Single scrollable page, no nav.
 */
export const DeckSlide = ({ n, title, subtitle, eyebrow, children }: Props) => {
  return (
    <section className="relative rounded-3xl border bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.12)] overflow-hidden">
      {/* Top gradient accent rail */}
      <div className="h-1 w-full bg-gradient-to-r from-primary via-primary/60 to-transparent" />

      <div className="px-8 md:px-10 pt-7 md:pt-9 pb-4 flex items-start gap-5 md:gap-6">
        {/* Big slide number */}
        <div className="hidden sm:flex flex-col items-end shrink-0 pt-1">
          <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Slide
          </span>
          <span className="text-4xl md:text-5xl font-black leading-none tabular-nums bg-gradient-to-br from-primary to-primary/50 bg-clip-text text-transparent">
            {String(n).padStart(2, "0")}
          </span>
        </div>

        {/* Vertical divider */}
        <div className="hidden sm:block w-px self-stretch bg-border" />

        {/* Title block */}
        <div className="min-w-0 flex-1">
          {eyebrow && (
            <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold mb-1">
              {eyebrow}
            </div>
          )}
          <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-tight tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm md:text-base text-muted-foreground mt-1.5 max-w-3xl">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="px-8 md:px-10 pb-8 md:pb-10 pt-3">
        <div className="border-t border-border/60 pt-6">{children}</div>
      </div>
    </section>
  );
};