"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Home,
  User,
  Wrench,
  FolderDot,
  Briefcase,
  MessageSquare,
  Mail,
} from "lucide-react";
import { gsap, ScrollSmoother } from "../../lib/gsap";

const navItems = [
  { name: "Home", href: "#home", icon: Home },
  { name: "About", href: "#about", icon: User },
  { name: "Skills", href: "#skills", icon: Wrench },
  { name: "Projects", href: "#projects", icon: FolderDot },
  { name: "Experience", href: "#experience", icon: Briefcase },
  { name: "Guestbook", href: "#guestbook", icon: MessageSquare },
  { name: "Contact", href: "#contact", icon: Mail },
];

export default function Navbar() {
  const [activeItem, setActiveItem] = useState("#home");
  // Store section element refs to avoid per-frame DOM queries
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

  // Track active section using IntersectionObserver (GPU-accelerated, no layout thrashing)
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const sectionIds = navItems.map((item) => item.href.replace("#", ""));

    // Cache DOM references once
    const map = new Map<string, HTMLElement>();
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) map.set(id, el);
    }
    sectionRefs.current = map;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the topmost visible section
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveItem(`#${entry.target.id}`);
            break;
          }
        }
      },
      {
        // Observe when section enters the middle 60% of the viewport
        rootMargin: "-20% 0px -40% 0px",
        threshold: 0,
      },
    );

    // Small delay to let the DOM settle after initial render
    const timeout = setTimeout(() => {
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      }
    }, prefersReducedMotion ? 0 : 500);

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, []);

  // Scroll to section using GSAP ScrollSmoother
  const scrollToSection = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();

      const smoother = ScrollSmoother.get();
      if (smoother) {
        smoother.scrollTo(href, true, "top top");
      } else {
        const target = document.querySelector(href);
        if (target) {
          gsap.to(window, {
            duration: 1,
            scrollTo: { y: href, offsetY: 0 },
            ease: "power2.inOut",
          });
        }
      }

      setActiveItem(href);
    },
    [],
  );

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex flex-col items-center justify-center fixed left-0 top-0 bottom-0 z-50 pointer-events-none group/sidebar">
        <div className="flex flex-col items-center gap-6 py-6 px-3 bg-[var(--surface)]/60 backdrop-blur-md border border-[var(--border)] rounded-r-3xl shadow-lg pointer-events-auto transition-transform duration-500 ease-out -translate-x-[75%] group-hover/sidebar:translate-x-0 h-fit my-auto">
          <nav className="flex flex-col items-center gap-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.href;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => scrollToSection(e, item.href)}
                  className={`group relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 active:scale-90 ${
                    isActive
                      ? "bg-[var(--text)] text-[var(--bg)] shadow-md translate-x-1"
                      : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--border)]"
                  }`}
                  aria-label={item.name}
                >
                  <Icon size={20} />
                  <span className="absolute left-14 px-2 py-1 bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-md">
                    {item.name}
                  </span>
                </a>
              );
            })}
          </nav>

          {/* Grab handle hint */}
          <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1 h-12 bg-[var(--muted)]/30 rounded-full group-hover/sidebar:opacity-0 transition-opacity duration-300" />
        </div>
      </aside>

      {/* ── Mobile Bottom Dock ── */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 z-50 bg-[var(--surface)]/80 backdrop-blur-md border border-[var(--border)] rounded-2xl shadow-xl">
        <div className="flex items-center justify-between px-4 py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.href;
            return (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className={`relative flex flex-col items-center justify-center w-10 h-10 transition-colors active:scale-90 ${
                  isActive
                    ? "text-[var(--text)]"
                    : "text-[var(--muted)] hover:text-[var(--text)]"
                }`}
                aria-label={item.name}
              >
                <div
                  className={`absolute inset-0 bg-[var(--border)] rounded-xl transition-transform scale-0 ${isActive ? "scale-100" : ""}`}
                />
                <Icon size={20} className="relative z-10" />
              </a>
            );
          })}
        </div>
      </nav>
    </>
  );
}
