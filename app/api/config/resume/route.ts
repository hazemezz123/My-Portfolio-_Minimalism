import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { checkAdminAuth } from "@/lib/auth";

export const revalidate = 60;

export async function GET() {
  try {
    const db = await getDb();
    const result = await db.execute({
      sql: "SELECT value FROM site_config WHERE key = ?",
      args: ["resumeUrl"],
    });

    const url =
      result.rows.length > 0
        ? (result.rows[0] as unknown as Record<string, string>).value
        : "/Hazem-cv.pdf";

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Error fetching resume config:", error);
    return NextResponse.json(
      { error: "Failed to fetch resume configuration" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 },
      );
    }

    const db = await getDb();

    await db.execute({
      sql: `INSERT INTO site_config (key, value, updated_at)
            VALUES (?, ?, datetime('now'))
            ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')`,
      args: ["resumeUrl", url],
    });

    return NextResponse.json({ success: true, url }, { status: 200 });
  } catch (error) {
    console.error("Error updating resume config:", error);
    return NextResponse.json(
      { error: "Failed to update resume configuration" },
      { status: 500 },
    );
  }
}
