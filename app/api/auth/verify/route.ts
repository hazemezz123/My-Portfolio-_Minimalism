import { NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/auth";

/** GET — returns whether the current session is authenticated. */
export async function GET() {
  const isAuth = await checkAdminAuth();
  return NextResponse.json({ authenticated: isAuth });
}
