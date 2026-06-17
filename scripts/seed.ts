/**
 * Seeds the database with initial project data if the projects table is empty.
 *
 * Usage:  npm run seed
 *
 * Environment variables required:
 *   TURSO_DATABASE_URL  — e.g. "file:local.db" or "libsql://your-db.turso.io"
 *   TURSO_AUTH_TOKEN    — (only needed for remote Turso databases)
 */
import "dotenv/config";
import { createClient } from "@libsql/client";

const SEED_PROJECTS = [
  {
    title: "SpeedYou Scooter Rental",
    description:
      "A modern web application for scooter rentals with booking system and responsive design.",
    tags: ["React.js", "JavaScript", "Tailwind CSS"],
    demoUrl: "https://speedyou.vercel.app/",
    codeUrl: "https://github.com/hazemezz123/Economic-Project",
  },
  {
    title: "Dern Support Company",
    description:
      "A professional company website for a support service with modern UI/UX design.",
    tags: ["Next.js", "React", "CSS"],
    demoUrl: "https://dern-company.vercel.app/",
    codeUrl: "https://github.com/hazemezz123/dern-Company",
  },
  {
    title: "API College Tournament Platform",
    description:
      "A comprehensive API system for managing student tournaments with PHP backend.",
    tags: ["PHP", "MySQL", "REST API"],
    demoUrl: null,
    codeUrl: "https://github.com/hazemezz123/API-College-Tournament-Platform",
  },
  {
    title: "H4ck3r File Organizer",
    description:
      "A Python desktop application that efficiently organizes files by type.",
    tags: ["Python", "Desktop App", "GUI"],
    demoUrl: null,
    codeUrl: "https://github.com/hazemezz123/H4ck3r_File_Organizer",
  },
  {
    title: "Superhero Battle Simulator",
    description:
      "An interactive Python GUI application that simulates battles between superheroes.",
    tags: ["Python", "OOP", "Tkinter"],
    demoUrl: null,
    codeUrl: "https://github.com/hazemezz123/Python-oppSkills",
  },
];

async function main() {
  const url = process.env.TURSO_DATABASE_URL;
  if (!url) {
    console.error("Error: TURSO_DATABASE_URL is not set.");
    console.error('Set it to "file:local.db" for local development.');
    process.exit(1);
  }

  const db = createClient({
    url,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  // Create tables if they don't exist
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS projects (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       TEXT    NOT NULL,
      description TEXT    NOT NULL,
      tags        TEXT    DEFAULT '[]',
      demo_url    TEXT,
      code_url    TEXT    NOT NULL DEFAULT '',
      created_at  TEXT    DEFAULT (datetime('now')),
      updated_at  TEXT    DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS guestbook (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT    NOT NULL,
      message    TEXT    NOT NULL,
      website    TEXT,
      social     TEXT,
      created_at TEXT    DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS site_config (
      key        TEXT    PRIMARY KEY,
      value      TEXT    NOT NULL,
      updated_at TEXT    DEFAULT (datetime('now'))
    );
  `);

  // Check if already seeded
  const existing = await db.execute("SELECT COUNT(*) as count FROM projects");
  const count = (existing.rows[0] as unknown as Record<string, number>).count;

  if (count > 0) {
    console.log(`Database already has ${count} project(s). Skipping seed.`);
    process.exit(0);
  }

  // Insert seed data
  for (const project of SEED_PROJECTS) {
    await db.execute({
      sql: `INSERT INTO projects (title, description, tags, demo_url, code_url)
            VALUES (?, ?, ?, ?, ?)`,
      args: [
        project.title,
        project.description,
        JSON.stringify(project.tags),
        project.demoUrl,
        project.codeUrl,
      ],
    });
    console.log(`  ✓ Inserted: ${project.title}`);
  }

  console.log(`\nSeeded ${SEED_PROJECTS.length} projects successfully.`);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
