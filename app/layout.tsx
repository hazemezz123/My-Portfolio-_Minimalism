import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "./components/providers/SmoothScrollProvider";
import ThemeProvider from "./components/providers/ThemeProvider";
import Navbar from "./components/ui/Navbar";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site-config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = SITE_URL;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Hazem Ezz | Full Stack Developer",
    template: "%s | Hazem Ezz",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "Hazem Ezz" }],
  creator: "Hazem Ezz",
  keywords: [
    "Hazem Ezz",
    "full stack developer",
    "Next.js developer",
    "React developer",
    "web developer portfolio",
    "Tailwind CSS",
    "Laravel",
    "GSAP",
    "TypeScript",
    "frontend developer",
    "AI student",
    "Suez",
    "Egypt",
    "HITU",
  ],
  alternates: {
    canonical: "/",
  },
    openGraph: {
      title: "Hazem Ezz | Full Stack Developer",
      description: SITE_DESCRIPTION,
      url: "/",
      siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/Hazem.jpg",
        alt: "Hazem Ezz portrait",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hazem Ezz | Full Stack Developer",
    description: SITE_DESCRIPTION,
    images: ["/images/Hazem.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[var(--bg)] font-sans text-[var(--text)] antialiased`}
        suppressHydrationWarning
      >
        <noscript>
          <style>{`
            /* Show all GSAP-animated sections when JS is disabled */
            [style*="opacity: 0"] { opacity: 1 !important; transform: none !important; }
            /* Hide loading spinners */
            .loading-spinner { display: none !important; }
          `}</style>
        </noscript>
        <ThemeProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-[var(--text)] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-[var(--bg)]"
          >
            Skip to content
          </a>
          <Navbar />
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
