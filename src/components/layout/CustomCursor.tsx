import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";

/**
 * Custom cursor luxury 4-mode (desktop only, pas tactile).
 * Pattern Robb Report / portfolio luxury — l'un des détails signature qui rend
 * l'expérience mémorable.
 *
 * Modes :
 * - default  : cercle taupe outline 24px
 * - link     : cercle bronze plein 12px (sur les <a>, <button>, [role=button])
 * - text     : i-beam bronze (sur input, textarea)
 * - image    : cercle taupe agrandi 56px avec texte VOIR  à l'intérieur (sur img + figure)
 *
 * Respecte prefers-reduced-motion (pas d'effet — cursor natif visible).
 */

type CursorMode = "default" | "link" | "text" | "image" | "drag";

export function CustomCursor() {
  const { lang } = useLanguage();
  const dotRef = useRef<HTMLDivElement | null>(null);
  const visibleRef = useRef(false); // BLOCKER fix : ref au lieu de state pour éviter re-mount listeners
  const [mode, setMode] = useState<CursorMode>("default");
  const [enabled, setEnabled] = useState(false);

  // Effect MOUNT-ONLY : attache listeners + raf une seule fois.
  // Fix BLOCKER code-review : avant deps [visible] re-montait tout à chaque transition idle/active.
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Disable sur mobile/tactile et reduced motion
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isCoarse || isReduced) return;
    setEnabled(true);

    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const setVisibility = (v: boolean) => {
      if (visibleRef.current === v) return;
      visibleRef.current = v;
      if (dotRef.current) {
        dotRef.current.style.opacity = v ? "1" : "0";
      }
    };

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!visibleRef.current) setVisibility(true);
    };

    const onLeave = () => setVisibility(false);
    const onEnter = () => setVisibility(true);

    const animate = () => {
      currentX += (targetX - currentX) * 0.22;
      currentY += (targetY - currentY) * 0.22;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    const onOver = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target || !target.closest) return;
      if (target.closest('input[type="range"], .calc-slider')) {
        setMode("drag");
      } else if (target.closest("a, button, [role='button'], label[for]")) {
        setMode("link");
      } else if (target.closest("input, textarea, [contenteditable]")) {
        setMode("text");
      } else if (target.closest("img, figure, picture")) {
        setMode("image");
      } else {
        setMode("default");
      }
    };

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);
    document.addEventListener("pointerover", onOver);
    document.documentElement.style.cursor = "none";

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.style.cursor = "";
    };
  }, []); // mount-only : visibility géré via ref + DOM directement

  if (!enabled) return null;

  // Label i18n FR/EN (fix LOW issue Voir hardcoded)
  const label = mode === "drag" ? "↔" : lang === "fr" ? "Voir" : "View";

  return (
    <div
      ref={dotRef}
      data-cursor-mode={mode}
      aria-hidden="true"
      className="custom-cursor"
      style={{
        opacity: 0, // initial hidden, géré par ref via DOM
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 9998,
        transition: "opacity 200ms ease, width 280ms ease, height 280ms ease, background 280ms ease, border 280ms ease",
      }}
    >
      <span className="custom-cursor__label" aria-hidden="true">
        {label}
      </span>
    </div>
  );
}
