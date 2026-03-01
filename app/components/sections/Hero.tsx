"use client";

import { useRef } from "react";
import { TypeAnimation } from "react-type-animation";
import Container from "../ui/Container";
import Button from "../ui/Button";
import { useHeroAnimation } from "../../hooks/useHeroAnimation";

export default function Hero() {
  const nameRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useHeroAnimation({
    name: nameRef,
    subtitle: subtitleRef,
    description: descRef,
    buttons: buttonsRef,
  });

  return (
    <section id="home" className="min-h-[85vh] flex items-center">
      <Container>
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h1
            ref={nameRef}
            className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[var(--text)]"
            style={{ opacity: 0 }}
          >
            Hazem Ezz
          </h1>

          <div
            ref={subtitleRef}
            className="text-lg sm:text-xl text-[var(--muted)] h-8"
            style={{ opacity: 0 }}
          >
            <TypeAnimation
              sequence={[
                "Full Stack Developer",
                3000,
                "HITU AI Student",
                3000,
                "Building Scalable Web Solutions",
                3000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </div>

          <p
            ref={descRef}
            className="text-[var(--muted)] leading-relaxed max-w-lg mx-auto"
            style={{ opacity: 0 }}
          >
            Full stack developer and AI student building scalable web solutions
            with Next.js, React, Tailwind CSS, and Laravel.
          </p>

          <div
            ref={buttonsRef}
            className="flex items-center justify-center gap-3 pt-2"
            style={{ opacity: 0 }}
          >
            <Button href="#contact" variant="outline">
              Get in Touch
            </Button>
            <Button href="#projects" variant="primary">
              View Projects
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
