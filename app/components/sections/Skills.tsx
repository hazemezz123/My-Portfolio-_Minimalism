"use client";

import { useRef } from "react";
import Container from "../ui/Container";
import Section from "../ui/Section";
import Heading from "../ui/Heading";
import LogoLoop from "../ui/LogoLoop";
import { useFadeInOnScroll } from "../../hooks/useFadeInOnScroll";

import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiHtml5,
  SiCss3,
  SiNodedotjs,
  SiLaravel,
  SiPhp,
  SiPython,
  SiMongodb,
  SiMysql,
  SiPostgresql,
  SiGit,
  SiGithub,
  SiVercel,
  SiFigma,
  SiPostman,
  SiDocker,
  SiLinux,
  SiGreensock,
} from "react-icons/si";
import { VscCode } from "react-icons/vsc";

const frontendLogos = [
  { node: <SiReact />, title: "React.js" },
  { node: <SiNextdotjs />, title: "Next.js" },
  { node: <SiTypescript />, title: "TypeScript" },
  { node: <SiJavascript />, title: "JavaScript" },
  { node: <SiTailwindcss />, title: "Tailwind CSS" },
  { node: <SiHtml5 />, title: "HTML5" },
  { node: <SiCss3 />, title: "CSS3" },
  { node: <SiGreensock />, title: "GSAP" },
];

const backendLogos = [
  { node: <SiNodedotjs />, title: "Node.js" },
  { node: <SiLaravel />, title: "Laravel" },
  { node: <SiPhp />, title: "PHP" },
  { node: <SiPython />, title: "Python" },
  { node: <SiMongodb />, title: "MongoDB" },
  { node: <SiMysql />, title: "MySQL" },
  { node: <SiPostgresql />, title: "PostgreSQL" },
];

const toolsLogos = [
  { node: <SiGit />, title: "Git" },
  { node: <SiGithub />, title: "GitHub" },
  { node: <VscCode />, title: "VS Code" },
  { node: <SiVercel />, title: "Vercel" },
  { node: <SiFigma />, title: "Figma" },
  { node: <SiPostman />, title: "Postman" },
  { node: <SiDocker />, title: "Docker" },
  { node: <SiLinux />, title: "Linux" },
];

export default function Skills() {
  const contentRef = useRef<HTMLDivElement>(null);
  useFadeInOnScroll(contentRef);

  return (
    <Section id="skills">
      <Container>
        <div ref={contentRef} style={{ opacity: 0 }}>
          <Heading className="mb-12">Skills</Heading>

          <div className="space-y-8">
            {/* Frontend Row — scrolls left */}
            <div className="relative h-[80px] overflow-hidden">
              <LogoLoop
                logos={frontendLogos}
                speed={80}
                direction="left"
                logoHeight={40}
                gap={60}
                hoverSpeed={0}
                scaleOnHover
                fadeOut
                fadeOutColor="#0a0a0a"
                ariaLabel="Frontend skills"
              />
            </div>

            {/* Backend Row — scrolls right */}
            <div className="relative h-[80px] overflow-hidden">
              <LogoLoop
                logos={backendLogos}
                speed={60}
                direction="right"
                logoHeight={40}
                gap={60}
                hoverSpeed={0}
                scaleOnHover
                fadeOut
                fadeOutColor="#0a0a0a"
                ariaLabel="Backend skills"
              />
            </div>

            {/* Tools Row — scrolls left */}
            <div className="relative h-[80px] overflow-hidden">
              <LogoLoop
                logos={toolsLogos}
                speed={70}
                direction="left"
                logoHeight={40}
                gap={60}
                hoverSpeed={0}
                scaleOnHover
                fadeOut
                fadeOutColor="#0a0a0a"
                ariaLabel="Developer tools"
              />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
