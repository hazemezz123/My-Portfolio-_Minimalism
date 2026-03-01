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

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"
).replace(/\/$/, "");

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: "Hazem Ezz",
    url: siteUrl,
    image: `${siteUrl}/images/Hazem.jpg`,
    jobTitle: "Full Stack Developer",
    description:
      "Full stack developer and AI student building scalable web solutions",
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
    "@id": `${siteUrl}/#website`,
    name: "Hazem Ezz Portfolio",
    url: siteUrl,
    inLanguage: "en",
    description:
      "Full stack developer and AI student building scalable web solutions with Next.js, React, Tailwind CSS, and Laravel.",
  },
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteUrl}/#webpage`,
    url: siteUrl,
    name: "Hazem Ezz | Full Stack Developer",
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: { "@id": `${siteUrl}/#person` },
    inLanguage: "en",
    description:
      "Full stack developer and AI student building scalable web solutions with Next.js, React, Tailwind CSS, and Laravel.",
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
        <main className="pb-20 md:pb-0">
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
