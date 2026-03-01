"use client";

import { useRef } from "react";
import Container from "../ui/Container";
import Section from "../ui/Section";
import Heading from "../ui/Heading";
import Tag from "../ui/Tag";
import { useFadeInOnScroll } from "../../hooks/useFadeInOnScroll";

export default function About() {
  const contentRef = useRef<HTMLDivElement>(null);
  useFadeInOnScroll(contentRef);

  return (
    <Section id="about">
      <Container>
        <div ref={contentRef} style={{ opacity: 0 }}>
          <Heading className="mb-12">About Me</Heading>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Bio */}
            <div className="md:col-span-2 space-y-4">
              <p className="text-[var(--muted)] leading-relaxed">
                I&apos;m a Computer Science student at HITU, specializing in
                Artificial Intelligence. I build modern, responsive web
                applications with clean code and intuitive user experiences.
              </p>
              <p className="text-[var(--muted)] leading-relaxed">
                I enjoy working across the full stack, from crafting pixel-perfect
                frontends with React and Next.js to building robust backends with
                Laravel and Node.js. Always exploring new technologies and pushing
                the boundaries of what&apos;s possible on the web.
              </p>
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-medium uppercase tracking-wider text-[var(--muted)] mb-2">
                  Location
                </h3>
                <p className="text-[var(--text)] text-sm">Suez, Egypt</p>
              </div>
              <div>
                <h3 className="text-xs font-medium uppercase tracking-wider text-[var(--muted)] mb-2">
                  Education
                </h3>
                <p className="text-[var(--text)] text-sm">
                  HITU &mdash; AI Department
                </p>
              </div>
              <div>
                <h3 className="text-xs font-medium uppercase tracking-wider text-[var(--muted)] mb-2">
                  Interests
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "Web Development",
                    "AI/ML",
                    "Open Source",
                    "UI/UX Design",
                  ].map((interest) => (
                    <Tag key={interest}>{interest}</Tag>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
