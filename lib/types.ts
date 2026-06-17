/** Shared Project type used across server and client code. */
export interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  demoUrl?: string;
  codeUrl: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GuestbookEntry {
  id: number;
  name: string;
  message: string;
  website?: string;
  social?: string;
  createdAt?: string;
}

export interface SiteConfig {
  key: string;
  value: string;
  updatedAt?: string;
}
