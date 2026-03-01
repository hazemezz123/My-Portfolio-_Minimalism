"use client";

import { useRef, useEffect, type ReactNode } from "react";
import { gsap } from "../../lib/gsap";

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(el, { opacity: 1 });
      return;
    }

    gsap.fromTo(
      el,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: "power1.out" },
    );
  }, []);

  return (
    <div ref={ref} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
