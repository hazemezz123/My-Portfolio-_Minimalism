import Link from "next/link";
import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import Button from "@/app/components/ui/Button";
import type { Project } from "@/lib/types";

export const dynamic = "force-dynamic";

interface ProjectDetailsPageProps {
  params: Promise<{ id: string }>;
}

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

export default async function ProjectDetailsPage({
  params,
}: ProjectDetailsPageProps) {
  const { id } = await params;
  const numericId = Number(id);

  if (!numericId || Number.isNaN(numericId)) {
    notFound();
  }

  const db = await getDb();
  const result = await db.execute({
    sql: "SELECT * FROM projects WHERE id = ?",
    args: [numericId],
  });

  if (result.rows.length === 0) {
    notFound();
  }

  const project = rowToProject(
    result.rows[0] as unknown as Record<string, unknown>,
  );

  return (
    <main id="main-content" className="min-h-screen pt-24 pb-16 px-6">
      <div className="mx-auto max-w-[75ch]">
        {/* Navigation */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] transition-colors hover:text-[var(--text)]"
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
            All Projects
          </Link>
        </div>

        <article className="space-y-8">
          {/* Title & Description */}
          <div>
            <h1 className="text-3xl font-medium tracking-tight text-[var(--text)] mb-3">
              {project.title}
            </h1>
            <p className="text-[var(--muted)] leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Tags */}
          {project.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, index) => (
                <span
                  key={`${tag}-${index}`}
                  className="inline-block text-xs font-medium border border-[var(--border)] px-2.5 py-0.5 rounded-full text-[var(--muted)] bg-[var(--surface)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-2">
            {project.demoUrl && (
              <Button
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
              >
                Live Demo
              </Button>
            )}
            {project.codeUrl && (
              <Button
                href={project.codeUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
              >
                View Code
              </Button>
            )}
          </div>
        </article>
      </div>
    </main>
  );
}
