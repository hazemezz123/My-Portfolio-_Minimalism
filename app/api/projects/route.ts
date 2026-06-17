import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import type { Project } from "@/lib/types";
import { checkAdminAuth } from "@/lib/auth";

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

// GET — Fetch all projects (public, cached)
export async function GET() {
  try {
    const db = await getDb();
    const result = await db.execute(
      "SELECT * FROM projects ORDER BY created_at DESC",
    );

    const projects = result.rows.map((row) =>
      rowToProject(row as unknown as Record<string, unknown>),
    );

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 },
    );
  }
}

// POST — Create a new project (admin only)
export async function POST(request: Request) {
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (!body.title || !body.description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 },
      );
    }

    const db = await getDb();
    const result = await db.execute({
      sql: `INSERT INTO projects (title, description, tags, demo_url, code_url)
            VALUES (?, ?, ?, ?, ?)`,
      args: [
        body.title,
        body.description,
        JSON.stringify(body.tags || []),
        body.demoUrl || null,
        body.codeUrl || "",
      ],
    });

    const id = Number(result.lastInsertRowid);

    return NextResponse.json(
      {
        id,
        title: body.title,
        description: body.description,
        tags: body.tags || [],
        demoUrl: body.demoUrl || undefined,
        codeUrl: body.codeUrl || "",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 },
    );
  }
}

// PUT — Update a project (admin only)
export async function PUT(request: Request) {
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 },
      );
    }

    const db = await getDb();
    const result = await db.execute({
      sql: `UPDATE projects
            SET title = ?, description = ?, tags = ?, demo_url = ?, code_url = ?, updated_at = datetime('now')
            WHERE id = ?`,
      args: [
        body.title,
        body.description,
        JSON.stringify(body.tags || []),
        body.demoUrl || null,
        body.codeUrl || "",
        Number(body.id),
      ],
    });

    if (result.rowsAffected === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, id: body.id });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 },
    );
  }
}

// DELETE — Delete a project (admin only)
export async function DELETE(request: Request) {
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 },
      );
    }

    const db = await getDb();
    const result = await db.execute({
      sql: "DELETE FROM projects WHERE id = ?",
      args: [Number(id)],
    });

    if (result.rowsAffected === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 },
    );
  }
}
