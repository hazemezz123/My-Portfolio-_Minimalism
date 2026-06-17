import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// --- Rate limiting (in-memory, resets on cold start) ---
const CONTACT_COOLDOWN_MS = 60_000; // 1 minute between messages
type RateLimitStore = Map<string, number>;

const globalForContact = globalThis as typeof globalThis & {
  _contactRateLimit?: RateLimitStore;
};

const rateLimitStore = globalForContact._contactRateLimit || new Map();
if (!globalForContact._contactRateLimit) {
  globalForContact._contactRateLimit = rateLimitStore;
}

function getRequesterKey(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for") || "";
  const ip =
    forwardedFor.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "";
  const ua = request.headers.get("user-agent") || "";
  return ip || ua;
}

function isRateLimited(key: string): boolean {
  if (!key) return false;
  const now = Date.now();
  const last = rateLimitStore.get(key);
  if (last && now - last < CONTACT_COOLDOWN_MS) return true;
  rateLimitStore.set(key, now);

  // Evict stale entries when store grows large
  if (rateLimitStore.size > 2000) {
    for (const [entryKey, ts] of rateLimitStore.entries()) {
      if (now - ts > CONTACT_COOLDOWN_MS * 4) {
        rateLimitStore.delete(entryKey);
      }
    }
  }
  return false;
}

// --- HTML escaping to prevent XSS in email HTML ---
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  try {
    // Rate limiting
    const requesterKey = getRequesterKey(request);
    if (isRateLimited(requesterKey)) {
      return NextResponse.json(
        { error: "Please wait before sending another message" },
        { status: 429 },
      );
    }

    const { from_name, from_email, message } = await request.json();

    if (!from_name || !from_email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 },
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
      // TLS verification is enabled by default (rejectUnauthorized defaults to true)
    });

    const safeName = escapeHtml(from_name);
    const safeEmail = escapeHtml(from_email);
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

    const mailOptions = {
      from: `"${safeName}" <${process.env.SMTP_EMAIL}>`,
      to: process.env.SMTP_EMAIL,
      replyTo: from_email,
      subject: `Portfolio Contact: Message from ${safeName}`,
      text: `Name: ${from_name}\nEmail: ${from_email}\nMessage:\n${message}`,
      html: `
        <h3>New Contact Message</h3>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <br>
        <p><strong>Message:</strong></p>
        <p>${safeMessage}</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 },
    );
  }
}
