import { useEffect, type RefObject } from "react";
import { gsap } from "../lib/gsap";

interface HeroRefs {
  name: RefObject<HTMLElement | null>;
  subtitle: RefObject<HTMLElement | null>;
  description: RefObject<HTMLElement | null>;
  buttons: RefObject<HTMLElement | null>;
}

export function useHeroAnimation(refs: HeroRefs) {
  useEffect(() => {
    const elements = [
      refs.name.current,
      refs.subtitle.current,
      refs.description.current,
      refs.buttons.current,
    ];

    if (elements.some((el) => !el)) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      elements.forEach((el) => gsap.set(el, { opacity: 1, y: 0 }));
      return;
    }

    elements.forEach((el) => gsap.set(el, { opacity: 0, y: 20 }));

    const tl = gsap.timeline();

    tl.to(refs.name.current, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "power2.out",
    })
      .to(
        refs.subtitle.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
        },
        "-=0.3",
      )
      .to(
        refs.description.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
        },
        "-=0.25",
      )
      .to(
        refs.buttons.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
        },
        "-=0.2",
      );

    return () => {
      tl.kill();
    };
  }, [refs]);
}
