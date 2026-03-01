"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "../ui/Container";
import Section from "../ui/Section";
import Heading from "../ui/Heading";
import Tag from "../ui/Tag";
import Card from "../ui/Card";
import { useProjectsReveal } from "../../hooks/useProjectsReveal";

const fallbackProjects = [
  {
    id: "1",
    title: "SpeedYou Scooter Rental",
    description:
      "A modern web application for scooter rentals with booking system and responsive design.",
    tags: ["React.js", "JavaScript", "Tailwind CSS"],
    demoUrl: "https://speedyou.vercel.app/",
    codeUrl: "https://github.com/hazemezz123/Economic-Project",
    image: "/projects/speedyou.webp",
  },
  {
    id: "2",
    title: "Dern Support Company",
    description:
      "A professional company website for a support service with modern UI/UX design.",
    tags: ["Next.js", "React", "CSS"],
    demoUrl: "https://dern-company.vercel.app/",
    codeUrl: "https://github.com/hazemezz123/dern-Company",
    image: "/projects/dern.webp",
  },
  {
    id: "3",
    title: "API College Tournament Platform",
    description:
      "A comprehensive API system for managing student tournaments with PHP backend.",
    tags: ["PHP", "MySQL", "REST API"],
    codeUrl: "https://github.com/hazemezz123/API-College-Tournament-Platform",
    image: "/projects/tournament.webp",
  },
  {
    id: "4",
    title: "H4ck3r File Organizer",
    description:
      "A Python desktop application that efficiently organizes files by type.",
    tags: ["Python", "Desktop App", "GUI"],
    codeUrl: "https://github.com/hazemezz123/H4ck3r_File_Organizer",
    image: "/projects/h4ck3r.webp",
  },
  {
    id: "5",
    title: "Superhero Battle Simulator",
    description:
      "An interactive Python GUI application that simulates battles between superheroes.",
    tags: ["Python", "OOP", "Tkinter"],
    codeUrl: "https://github.com/hazemezz123/Python-oppSkills",
    image: "/projects/superhero.webp",
  },
];

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  demoUrl?: string;
  codeUrl: string;
  image?: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  const [isLoading, setIsLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);

  if (cardRefs.current.length > projects.length) {
    cardRefs.current.length = projects.length;
  }

  useProjectsReveal(cardRefs, gridRef);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        if (!response.ok) throw new Error("Failed to fetch");

        const data = await response.json();

        if (data && data.length > 0) {
          setProjects(data);
          setUseFallback(false);
        } else {
          setUseFallback(true);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        setUseFallback(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <Section id="projects">
      <Container>
        <Heading className="mb-12">Projects</Heading>

        {isLoading ? (
            <div className="text-center py-12">
              <div className="loading-spinner mx-auto" />
              <p className="mt-4 text-sm text-[var(--muted)]">
                Loading projects...
              </p>
            </div>
        ) : (
            <div
              ref={gridRef}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {projects.map((project, index) => (
                <Card
                  key={project.id}
                  ref={(el) => {
                    if (el) {
                      cardRefs.current[index] = el;
                    }
                  }}
                  className="opacity-0 translate-y-4 motion-reduce:opacity-100 motion-reduce:translate-y-0 will-change-transform"
                >
                {project.image && (
                  <div className="relative w-full aspect-[16/10] overflow-hidden bg-[var(--surface)]">
                    <Image
                      src={project.image}
                      alt={`${project.title} preview`}
                      fill
                      className="object-cover transition-transform duration-200 ease-out hover:scale-[1.02]"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                )}

                <div className="p-5 space-y-3">
                  <h3 className="text-lg font-medium text-[var(--text)]">
                    {project.title}
                  </h3>
                  <p className="line-clamp-2 text-sm text-[var(--muted)]">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag, i) => (
                      <Tag key={i}>{tag}</Tag>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 pt-2 text-sm">
                    {!useFallback && project.id && (
                      <Link
                        href={`/projects/${project.id}`}
                        className="font-medium text-[var(--text)] underline-offset-4 transition-colors duration-150 ease-out hover:underline"
                      >
                        Details
                      </Link>
                    )}
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--text)] underline-offset-4 transition-colors duration-150 ease-out hover:underline"
                      >
                        Live Demo
                      </a>
                    )}
                    {project.codeUrl && (
                      <a
                        href={project.codeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--text)] underline-offset-4 transition-colors duration-150 ease-out hover:underline"
                      >
                        Code
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
