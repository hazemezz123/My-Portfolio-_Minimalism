import { NextResponse } from "next/server";
import { setAdminCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json(
        { error: "Admin password not configured" },
        { status: 500 },
      );
    }

    if (!password || password !== adminPassword) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 },
      );
    }

    await setAdminCookie();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 },
    );
  }
}

/** DELETE — logout */
export async function DELETE() {
  const { clearAdminCookie } = await import("@/lib/auth");
  await clearAdminCookie();
  return NextResponse.json({ success: true });
}
