"use client";

import { useState, useEffect, useCallback } from "react";
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

  // Track which section is in view via ScrollTrigger-compatible polling
  useEffect(() => {
    // Small delay to ensure ScrollSmoother is initialized
    const timeout = setTimeout(() => {
      const sectionIds = navItems.map((item) => item.href.replace("#", ""));

      const checkActive = () => {
        const smoother = ScrollSmoother.get();
        const scrollY = smoother ? smoother.scrollTop() : window.scrollY;
        const viewportMiddle = scrollY + window.innerHeight / 2;

        let currentSection = "#home";
        for (const id of sectionIds) {
          const el = document.getElementById(id);
          if (el) {
            const top = el.offsetTop;
            if (top <= viewportMiddle) {
              currentSection = `#${id}`;
            }
          }
        }
        setActiveItem(currentSection);
      };

      // Use GSAP ticker for smooth, frame-synced updates
      gsap.ticker.add(checkActive);

      return () => {
        gsap.ticker.remove(checkActive);
      };
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  // Scroll to section using GSAP ScrollSmoother
  const scrollToSection = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();

      const smoother = ScrollSmoother.get();
      if (smoother) {
        // Use ScrollSmoother's built-in scrollTo — works perfectly with normalizeScroll
        smoother.scrollTo(href, true, "top top");
      } else {
        // Fallback: use GSAP ScrollToPlugin for non-smooth-scroll environments
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
