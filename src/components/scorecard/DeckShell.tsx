import { useEffect, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface DeckSlide {
  id: string;
  title: string;
  subtitle?: string;
  content: ReactNode;
}

interface Props {
  slides: DeckSlide[];
}

/**
 * Lightweight in-page deck. Shows one slide at a time, with arrow buttons,
 * keyboard ←/→ nav, dots, and horizontal swipe support. No fullscreen — the
 * page header and YearSelector remain visible above the deck.
 */
export const DeckShell = ({ slides }: Props) => {
  const [index, setIndex] = useState(0);
  const total = slides.length;

  const go = (next: number) =>
    setIndex(Math.max(0, Math.min(total - 1, next)));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement) {
        const tag = e.target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || e.target.isContentEditable)
          return;
      }
      if (e.key === "ArrowRight") go(index + 1);
      if (e.key === "ArrowLeft") go(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, total]);

  // Touch swipe
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) =>
    setTouchStart(e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const dx = e.changedTouches[0].clientX - touchStart;
    if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
    setTouchStart(null);
  };

  const slide = slides[index];

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-3">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Slide {index + 1} of {total}
          </div>
          <h2 className="text-lg font-semibold text-foreground truncate">
            {slide.title}
          </h2>
          {slide.subtitle && (
            <p className="text-xs text-muted-foreground truncate">
              {slide.subtitle}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="icon"
            onClick={() => go(index - 1)}
            disabled={index === 0}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => go(index + 1)}
            disabled={index === total - 1}
            aria-label="Next slide"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        className="rounded-xl border bg-card p-5 shadow-sm min-h-[60vh]"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {slide.content}
      </div>

      <div className="flex items-center justify-center gap-1.5 mt-4">
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}: ${s.title}`}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-8 bg-primary" : "w-2 bg-muted hover:bg-muted-foreground/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
};