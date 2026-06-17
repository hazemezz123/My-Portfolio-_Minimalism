/** Canonical site URL — single source of truth. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"
).replace(/\/$/, "");

export const SITE_NAME = "Hazem Ezz Portfolio";
export const SITE_DESCRIPTION =
  "Full stack developer and AI student building scalable web solutions with Next.js, React, Tailwind CSS, and Laravel.";
