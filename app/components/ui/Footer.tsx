"use client";

import { useRef } from "react";
import { Github, Linkedin, Instagram, Facebook } from "lucide-react";
import Container from "./Container";
import { useFadeInOnScroll } from "../../hooks/useFadeInOnScroll";

const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com/hazemezz123",
    icon: Github,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/hazem-ezz-424498285/",
    icon: Linkedin,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/hazem_ezz_1/",
    icon: Instagram,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61557867570271",
    icon: Facebook,
  },
];

export default function Footer() {
  const contentRef = useRef<HTMLDivElement>(null);
  useFadeInOnScroll(contentRef);

  return (
    <footer className="border-t border-[var(--border)]">
      <Container>
        <div
          ref={contentRef}
          className="py-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ opacity: 0 }}
        >
          <p className="text-sm text-[var(--muted)]">
            &copy; {new Date().getFullYear()} Hazem Ezz
          </p>

          <nav className="flex items-center gap-4">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--muted)] transition-colors duration-150 ease-out hover:text-[var(--text)]"
                  aria-label={link.name}
                >
                  <Icon size={20} />
                </a>
              );
            })}
          </nav>
        </div>
      </Container>
    </footer>
  );
}
