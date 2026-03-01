import { NextResponse } from "next/server";
import { getProjectsCollection, ObjectId } from "../../../lib/mongodb";

export async function GET(request: Request) {
  try {
    const { pathname } = new URL(request.url);
    const id = pathname.split("/").filter(Boolean).pop();

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
    }

    const collection = await getProjectsCollection();
    const project = await collection.findOne({ _id: new ObjectId(id) });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...project,
      id: project._id?.toString(),
      _id: undefined,
    });
  } catch (error) {
    console.error("Error fetching project by id:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 },
    );
  }
}
