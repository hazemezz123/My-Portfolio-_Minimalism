"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Container from "./Container";
import { gsap } from "../../lib/gsap";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Guestbook", href: "#guestbook" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [activeItem, setActiveItem] = useState("#home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = headerRef.current;
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
      { opacity: 1, duration: 0.4, ease: "power1.out" },
    );
  }, []);

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border)] bg-[var(--bg)] backdrop-blur-sm"
      style={{ opacity: 0 }}
    >
      <Container>
        <div className="flex h-14 items-center justify-between">
          <Link
            href="#home"
            className="text-base font-medium text-[var(--text)] underline-offset-4 transition-colors duration-150 ease-out hover:underline"
            onClick={() => setActiveItem("#home")}
          >
            Hazem Ezz
          </Link>

          {/* Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`relative px-3 py-1.5 text-sm transition-colors duration-150 ease-out ${
                  activeItem === item.href
                    ? "text-[var(--text)]"
                    : "text-[var(--muted)] hover:text-[var(--text)] hover:underline underline-offset-4"
                }`}
                onClick={() => setActiveItem(item.href)}
              >
                {item.name}
                {activeItem === item.href && (
                  <span className="absolute bottom-0 left-3 right-3 h-px bg-[var(--text)]" />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />

          {/* Mobile toggle */}
          <button
            type="button"
            className="md:hidden p-2 text-[var(--muted)] transition-colors duration-150 ease-out hover:text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ring-offset)]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              {mobileMenuOpen ? (
                <>
                  <line x1="4" y1="4" x2="16" y2="16" />
                  <line x1="16" y1="4" x2="4" y2="16" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="17" y2="6" />
                  <line x1="3" y1="10" x2="17" y2="10" />
                  <line x1="3" y1="14" x2="17" y2="14" />
                </>
              )}
            </svg>
          </button>
          </div>
        </div>
      </Container>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--bg)]">
          <Container>
            <nav className="py-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 text-sm rounded-md transition-colors duration-150 ease-out ${
                    activeItem === item.href
                      ? "bg-[var(--surface)] text-[var(--text)]"
                      : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface)] hover:underline underline-offset-4"
                  }`}
                  onClick={() => {
                    setActiveItem(item.href);
                    setMobileMenuOpen(false);
                  }}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}
