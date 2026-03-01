import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db";

// Type definitions
export interface Project {
  _id?: ObjectId;
  id?: number;
  title: string;
  description: string;
  tags: string[];
  demoUrl?: string;
  codeUrl: string;
  image?: string;
  photos?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SiteConfig {
  _id?: ObjectId;
  key: string;
  value: string;
  updatedAt: Date;
}

export interface GuestbookEntry {
  _id?: ObjectId;
  id?: string;
  name: string;
  message: string;
  website?: string;
  social?: string;
  createdAt: Date;
}

// Get the database instance
export async function getDatabase() {
  return getDb();
}

// Get the projects collection
export async function getProjectsCollection() {
  const db = await getDatabase();
  return db.collection<Project>("projects");
}

// Get the guestbook collection
export async function getGuestbookCollection() {
  const db = await getDatabase();
  return db.collection<GuestbookEntry>("guestbook");
}

// Get the site config collection
export async function getSiteConfigCollection() {
  const db = await getDatabase();
  return db.collection<SiteConfig>("site_config");
}

// Export ObjectId for use in other files
export { ObjectId };
