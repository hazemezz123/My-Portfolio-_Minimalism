"use client";

import { useState, useEffect, useRef } from "react";
import Container from "../ui/Container";
import Section from "../ui/Section";
import Heading from "../ui/Heading";
import Button from "../ui/Button";
import { gsap, ScrollTrigger } from "../../lib/gsap";

const experiences = [
  {
    title: "Full Stack Developer",
    company: "Freelance",
    period: "2024 - Present",
    description:
      "Building modern web applications with Next.js, React, and Laravel for various clients.",
    skills: ["Next.js", "React", "Laravel", "Tailwind CSS"],
  },
  {
    title: "Frontend Developer",
    company: "University Projects",
    period: "2023 - 2024",
    description:
      "Developed multiple web applications as part of university coursework and personal projects.",
    skills: ["React", "JavaScript", "CSS", "Python"],
  },
  {
    title: "AI Student",
    company: "HITU",
    period: "2022 - Present",
    description:
      "Studying Computer Science with a focus on Artificial Intelligence and Machine Learning.",
    skills: ["Python", "Machine Learning", "Data Science"],
  },
  {
    title: "Self-taught Developer",
    company: "Independent",
    period: "2021 - 2022",
    description:
      "Started learning web development through online courses and building personal projects.",
    skills: ["HTML", "CSS", "JavaScript", "PHP"],
  },
];

export default function Experience() {
  const [resumeUrl, setResumeUrl] = useState("/Hazem-cv.pdf");
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchResumeUrl = async () => {
      try {
        const response = await fetch("/api/config/resume");
        if (response.ok) {
          const data = await response.json();
          if (data.url) setResumeUrl(data.url);
        }
      } catch (error) {
        console.error("Error fetching resume URL:", error);
      }
    };
    fetchResumeUrl();
  }, []);

  // Stagger animation for timeline entries
  useEffect(() => {
    const el = timelineRef.current;
    if (!el) return;

    const entries = el.querySelectorAll(":scope > div");
    if (!entries.length) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(entries, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(entries, { opacity: 0, y: 20 });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(entries, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <Section id="experience">
      <Container>
        <Heading className="mb-12">Experience</Heading>

        <div
          ref={timelineRef}
          className="relative border-l-2 border-[var(--border)] ml-3 space-y-10"
        >
          {experiences.map((exp, index) => (
            <div key={index} className="relative pl-8">
              {/* Dot */}
              <div className="absolute left-[-9px] top-1.5 w-4 h-4 rounded-full bg-[var(--bg)] border-2 border-[var(--border)]" />

              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <h3 className="text-base font-medium text-[var(--text)]">
                    {exp.title}
                  </h3>
                  <span className="text-xs text-[var(--muted)] font-medium">
                    {exp.period}
                  </span>
                </div>

                <p className="text-sm text-[var(--muted)]">{exp.company}</p>
                <p className="text-sm text-[var(--muted)] leading-relaxed">
                  {exp.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {exp.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs text-[var(--muted)] border border-[var(--border)] px-2 py-0.5 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button
            href={resumeUrl}
            variant="outline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download Resume
          </Button>
        </div>
      </Container>
    </Section>
  );
}
