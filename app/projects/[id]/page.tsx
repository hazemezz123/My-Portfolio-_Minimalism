import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectsCollection, ObjectId } from "../../lib/mongodb";
import Button from "../../components/ui/Button";

export const dynamic = "force-dynamic";

interface ProjectDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailsPage({
  params,
}: ProjectDetailsPageProps) {
  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    notFound();
  }

  const collection = await getProjectsCollection();
  const project = await collection.findOne({ _id: new ObjectId(id) });

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen pt-24 pb-16 px-6">
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
