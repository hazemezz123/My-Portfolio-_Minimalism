import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectsCollection, ObjectId } from "../../lib/mongodb";
import Button from "../../components/ui/Button";

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
        <Link
          href="/#projects"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--text)] underline-offset-4 transition-colors duration-150 ease-out hover:underline mb-8"
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
          Back to Projects
        </Link>

        <article className="space-y-8">
          {project.image && (
            <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden bg-[var(--surface)]">
              <Image
                src={project.image}
                alt={`${project.title} screenshot`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 75ch"
                priority
              />
            </div>
          )}

          <div>
            <h1 className="text-3xl font-medium tracking-tight text-[var(--text)] mb-3">
              {project.title}
            </h1>
            <p className="text-[var(--muted)] leading-relaxed">
              {project.description}
            </p>
          </div>

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
