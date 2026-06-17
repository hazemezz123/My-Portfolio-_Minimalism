import Script from "next/script";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Skills from "./components/sections/Skills";
import Projects from "./components/sections/Projects";
import Experience from "./components/sections/Experience";
import Contact from "./components/sections/Contact";
import Footer from "./components/ui/Footer";
import Guestbook from "./components/sections/Guestbook";
import PageTransition from "./components/ui/PageTransition";
import { SITE_URL, SITE_DESCRIPTION } from "@/lib/site-config";

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: "Hazem Ezz",
    url: SITE_URL,
    image: `${SITE_URL}/images/Hazem.jpg`,
    jobTitle: "Full Stack Developer",
    description: SITE_DESCRIPTION,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Suez",
      addressRegion: "As Suways",
      addressCountry: "EG",
    },
    sameAs: [
      "https://github.com/hazemezz123",
      "https://www.linkedin.com/in/hazem-ezz-424498285/",
      "https://www.instagram.com/hazem_ezz_1/",
      "https://www.facebook.com/profile.php?id=61557867570271",
    ],
    knowsAbout: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Laravel",
      "GSAP",
      "Node.js",
      "MongoDB",
      "Testing",
      "Web Performance",
      "UI/UX",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "Hazem Ezz Portfolio",
    url: SITE_URL,
    inLanguage: "en",
    description: SITE_DESCRIPTION,
  },
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/#webpage`,
    url: SITE_URL,
    name: "Hazem Ezz | Full Stack Developer",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#person` },
    inLanguage: "en",
    description: SITE_DESCRIPTION,
  },
];

export default function Home() {
  return (
    <>
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageTransition>
        <main id="main-content" className="pb-20 md:pb-0">
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Experience />
          <Guestbook />
          <Contact />
          <Footer />
        </main>
      </PageTransition>
    </>
  );
}
