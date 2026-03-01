import { NextResponse } from "next/server";
import { getSiteConfigCollection } from "@/app/lib/mongodb";

export async function GET() {
  try {
    const collection = await getSiteConfigCollection();
    const config = await collection.findOne({ key: "resumeUrl" });

    return NextResponse.json({
      url: config?.value || "/Hazem-cv.pdf", // Default fallback
    });
  } catch (error) {
    console.error("Error fetching resume config:", error);
    return NextResponse.json(
      { error: "Failed to fetch resume configuration" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const collection = await getSiteConfigCollection();

    await collection.updateOne(
      { key: "resumeUrl" },
      {
        $set: {
          key: "resumeUrl",
          value: url,
          updatedAt: new Date(),
        },
      },
      { upsert: true },
    );

    return NextResponse.json({ success: true, url }, { status: 200 });
  } catch (error) {
    console.error("Error updating resume config:", error);
    return NextResponse.json(
      { error: "Failed to update resume configuration" },
      { status: 500 },
    );
  }
}
