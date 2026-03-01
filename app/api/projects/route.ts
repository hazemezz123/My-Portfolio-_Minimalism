import { NextResponse } from "next/server";
import { getProjectsCollection, ObjectId } from "../../lib/mongodb";
import type { Project } from "../../lib/mongodb";

// GET - Fetch all projects
export async function GET() {
  try {
    const collection = await getProjectsCollection();
    const projects = await collection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Transform _id to id for frontend compatibility
    const formattedProjects = projects.map((project) => ({
      ...project,
      id: project._id?.toString(),
      _id: undefined,
    }));

    return NextResponse.json(formattedProjects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 },
    );
  }
}

// POST - Create a new project
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.description) {
      return NextResponse.json(
        { error: "Title, description, and codeUrl are required" },
        { status: 400 },
      );
    }

    const project: Omit<Project, "_id"> = {
      title: body.title,
      description: body.description,
      tags: body.tags || [],
      demoUrl: body.demoUrl || undefined,
      codeUrl: body.codeUrl,
      image: body.image || undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const collection = await getProjectsCollection();
    const result = await collection.insertOne(project as Project);

    return NextResponse.json(
      {
        id: result.insertedId.toString(),
        ...project,
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

// PUT - Update a project
export async function PUT(request: Request) {
  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 },
      );
    }

    const { id, ...updateData } = body;

    const collection = await getProjectsCollection();
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 },
    );
  }
}

// DELETE - Delete a project
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 },
      );
    }

    const collection = await getProjectsCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
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
