import Link from "next/link";
import { getDb } from "@/lib/db";
import type { Project } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Projects | Hazem Ezz",
  description: "All projects by Hazem Ezz — full stack developer.",
};

function rowToProject(row: Record<string, unknown>): Project {
  const tags = (() => {
    try {
      return JSON.parse((row.tags as string) || "[]") as string[];
    } catch {
      return [];
    }
  })();

  return {
    id: row.id as number,
    title: row.title as string,
    description: row.description as string,
    tags,
    demoUrl: (row.demo_url as string) || undefined,
    codeUrl: (row.code_url as string) || "",
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export default async function ProjectsPage() {
  const db = await getDb();
  const result = await db.execute(
    "SELECT * FROM projects ORDER BY created_at DESC",
  );

  const projects = result.rows.map((row) =>
    rowToProject(row as unknown as Record<string, unknown>),
  );

  return (
    <main id="main-content" className="min-h-screen pt-24 pb-16 px-6">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] transition-colors hover:text-[var(--text)] mb-6"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 12L6 8l4-4" />
            </svg>
            Back to Home
          </Link>

          <h1 className="text-3xl font-medium tracking-tight text-[var(--text)]">
            All Projects
          </h1>
          <p className="mt-2 text-[var(--muted)]">
            A collection of everything I&apos;ve built.
          </p>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <p className="text-center text-[var(--muted)] py-20">
            No projects yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="group block rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden transition-all duration-300 hover:border-[var(--muted)] hover:shadow-lg hover:shadow-black/20 hover:-translate-y-1"
              >
                <div className="p-4 space-y-2">
                  <h2 className="text-base font-medium text-[var(--text)] group-hover:text-white transition-colors">
                    {project.title}
                  </h2>
                  <p className="text-sm text-[var(--muted)] line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.tags?.slice(0, 3).map((tag: string, i: number) => (
                      <span
                        key={i}
                        className="text-xs text-[var(--muted)] border border-[var(--border)] px-2 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags && project.tags.length > 3 && (
                      <span className="text-xs text-[var(--muted)]">
                        +{project.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
