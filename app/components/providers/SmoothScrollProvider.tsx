"use client";

import { useLayoutEffect, type ReactNode } from "react";
import { gsap, ScrollSmoother } from "../../lib/gsap";

interface SmoothScrollProviderProps {
  children: ReactNode;
}

export default function SmoothScrollProvider({
  children,
}: SmoothScrollProviderProps) {
  useLayoutEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        return;
      }

      ScrollSmoother.get()?.kill();

      ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1.15,
        effects: false,
        smoothTouch: 0,
        normalizeScroll: true,
      });
    });

    return () => {
      ScrollSmoother.get()?.kill();
      ctx.revert();
    };
  }, []);

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">{children}</div>
    </div>
  );
}
