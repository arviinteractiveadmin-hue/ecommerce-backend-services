import {
  useEffect,
  useRef,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
} from "react";

type RevealProps = {
  /** Element to render. Defaults to `div`. Use `as="section"` to keep layout flow. */
  as?: ElementType;
  children: ReactNode;
  /** Extra delay before this block animates in, in ms. */
  delay?: number;
} & ComponentPropsWithoutRef<"div">;

/**
 * Reveals its children with a fade + rise the first time they scroll into view.
 *
 * Performance notes:
 * - Uses a single IntersectionObserver per block (no scroll listeners — those run
 *   on every frame and cause jank). The observer is disconnected after the reveal,
 *   so there is zero ongoing work once an element is visible.
 * - Only `opacity` and `transform` animate — both are compositor-only properties,
 *   so the reveal never triggers layout or paint.
 * - The hidden/animated styles live behind `prefers-reduced-motion: no-preference`
 *   and an `html.reveal-ready` gate (added by a tiny inline script). If JS never
 *   runs, content stays fully visible — no blank sections.
 */
export function Reveal({ as, children, delay, style, ...rest }: RevealProps) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || el.dataset.revealed === "true") return;

    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || typeof IntersectionObserver === "undefined") {
      el.classList.add("is-visible");
      el.dataset.revealed = "true";
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const target = entry.target as HTMLElement;
          target.classList.add("is-visible");
          target.dataset.revealed = "true";
          obs.unobserve(target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-reveal=""
      style={delay ? { ...style, transitionDelay: `${delay}ms` } : style}
      {...rest}
    >
      {children}
    </Tag>
  );
}
