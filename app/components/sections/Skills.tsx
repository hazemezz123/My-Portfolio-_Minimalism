"use client";

import { useState, useRef, memo } from "react";
import Container from "../ui/Container";
import Section from "../ui/Section";
import Heading from "../ui/Heading";
import Tag from "../ui/Tag";
import { useFadeInOnScroll } from "../../hooks/useFadeInOnScroll";

const skillsData: Record<string, string[]> = {
  Frontend: [
    "React.js",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "Tailwind CSS",
    "HTML5",
    "CSS3",
    "GSAP",
  ],
  Backend: [
    "Node.js",
    "Laravel",
    "PHP",
    "Python",
    "REST APIs",
    "MongoDB",
    "MySQL",
    "PostgreSQL",
  ],
  Tools: [
    "Git",
    "GitHub",
    "VS Code",
    "Vercel",
    "Figma",
    "Postman",
    "Docker",
    "Linux",
  ],
  Other: [
    "Responsive Design",
    "SEO",
    "Testing",
    "Agile",
    "UI/UX",
    "Performance",
    "Accessibility",
    "CI/CD",
  ],
};

const categories = Object.keys(skillsData);

const CategoryButton = memo(function CategoryButton({
  name,
  active,
  onClick,
}: {
  name: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ring-offset)] ${
        active
          ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950"
          : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface)]"
      }`}
    >
      {name}
    </button>
  );
});

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const contentRef = useRef<HTMLDivElement>(null);
  useFadeInOnScroll(contentRef);

  return (
    <Section id="skills">
      <Container>
        <div ref={contentRef} style={{ opacity: 0 }}>
          <Heading className="mb-12">Skills</Heading>

          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <CategoryButton
                key={category}
                name={category}
                active={activeCategory === category}
                onClick={() => setActiveCategory(category)}
              />
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {skillsData[activeCategory].map((skill) => (
              <Tag key={skill} className="text-sm px-3 py-1.5">
                {skill}
              </Tag>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
