"use client";

import { useLayoutEffect, type MutableRefObject, type RefObject } from "react";
import { gsap, ScrollTrigger } from "../lib/gsap";

export function useProjectsReveal(
  refs: MutableRefObject<HTMLDivElement[]>,
  triggerRef: RefObject<HTMLDivElement | null>,
) {
  useLayoutEffect(() => {
    const triggerEl = triggerRef.current;
    const cards = refs.current.filter(Boolean);

    if (!triggerEl || cards.length === 0) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(cards, { opacity: 1, y: 0, clearProps: "willChange" });
        return;
      }

      gsap.set(cards, { opacity: 0, y: 18, willChange: "transform,opacity" });

      const revealTween = gsap.to(cards, {
        opacity: 1,
        y: 0,
        duration: 0.55,
        stagger: 0.06,
        ease: "power2.out",
        clearProps: "willChange",
        paused: true,
      });

      ScrollTrigger.create({
        trigger: triggerEl,
        start: "top 82%",
        once: true,
        onEnter: () => revealTween.play(),
      });
    }, triggerEl);

    return () => {
      ctx.revert();
    };
  });
}
