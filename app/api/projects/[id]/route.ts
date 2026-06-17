import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import type { Project } from "@/lib/types";

export const revalidate = 60;

/** Map a raw SQLite row to a Project object. */
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

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const numericId = Number(id);

    if (!numericId || Number.isNaN(numericId)) {
      return NextResponse.json(
        { error: "Invalid project ID" },
        { status: 400 },
      );
    }

    const db = await getDb();
    const result = await db.execute({
      sql: "SELECT * FROM projects WHERE id = ?",
      args: [numericId],
    });

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 },
      );
    }

    const project = rowToProject(
      result.rows[0] as unknown as Record<string, unknown>,
    );

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error fetching project by id:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 },
    );
  }
}
