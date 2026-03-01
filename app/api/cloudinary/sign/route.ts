import { createHash } from "crypto";
import { NextResponse } from "next/server";

export async function POST() {
  const cloudName = process.env.CLOUDE_NAME;
  const apiKey = process.env.API_KEY;
  const apiSecret = process.env.API_SECRECT;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      { error: "Missing Cloudinary environment variables" },
      { status: 500 },
    );
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "portfolio-projects";
  const signatureBase = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = createHash("sha1").update(signatureBase).digest("hex");

  return NextResponse.json({
    cloudName,
    apiKey,
    timestamp,
    folder,
    signature,
  });
}
