import { NextResponse } from "next/server";
import { getGuestbookCollection, type GuestbookEntry } from "../../lib/mongodb";

const COOLDOWN_MS = 30_000;
const MAX_NAME_LENGTH = 40;
const MAX_MESSAGE_LENGTH = 280;
const MAX_LINK_LENGTH = 120;

type RateLimitStore = Map<string, number>;

const globalForGuestbook = globalThis as typeof globalThis & {
  _guestbookRateLimit?: RateLimitStore;
};

const rateLimitStore = globalForGuestbook._guestbookRateLimit || new Map();

if (!globalForGuestbook._guestbookRateLimit) {
  globalForGuestbook._guestbookRateLimit = rateLimitStore;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizeText(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ");
}

function getRequesterKey(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for") || "";
  const ip = forwardedFor.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "";
  const ua = request.headers.get("user-agent") || "";
  return ip || ua;
}

function isRateLimited(key: string) {
  if (!key) return false;

  const now = Date.now();
  const lastPostedAt = rateLimitStore.get(key);

  if (lastPostedAt && now - lastPostedAt < COOLDOWN_MS) {
    return true;
  }

  rateLimitStore.set(key, now);

  if (rateLimitStore.size > 2000) {
    for (const [entryKey, timestamp] of rateLimitStore.entries()) {
      if (now - timestamp > COOLDOWN_MS * 4) {
        rateLimitStore.delete(entryKey);
      }
    }
  }

  return false;
}

function toResponseEntry(entry: GuestbookEntry & { _id?: { toString(): string } }) {
  return {
    id: entry._id?.toString() || "",
    name: escapeHtml(entry.name),
    message: escapeHtml(entry.message),
    website: entry.website ? escapeHtml(entry.website) : "",
    social: entry.social ? escapeHtml(entry.social) : "",
    createdAt: (entry.createdAt || new Date()).toISOString(),
  };
}

export async function GET() {
  try {
    const collection = await getGuestbookCollection();
    const entries = await collection
      .find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    return NextResponse.json(entries.map((entry) => toResponseEntry(entry)));
  } catch (error) {
    console.error("Error fetching guestbook entries:", error);
    return NextResponse.json(
      { error: "Failed to fetch guestbook entries" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (normalizeText(body?.company || body?.websiteHp)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const name = normalizeText(body?.name);
    const message = normalizeText(body?.message);
    const website = normalizeText(body?.website);
    const social = normalizeText(body?.social);

    if (!name || !message) {
      return NextResponse.json(
        { error: "Name and message are required" },
        { status: 400 },
      );
    }

    if (name.length > MAX_NAME_LENGTH || message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        {
          error: `Name must be <= ${MAX_NAME_LENGTH} chars and message <= ${MAX_MESSAGE_LENGTH} chars`,
        },
        { status: 400 },
      );
    }

    if (website.length > MAX_LINK_LENGTH || social.length > MAX_LINK_LENGTH) {
      return NextResponse.json(
        { error: `Optional links must be <= ${MAX_LINK_LENGTH} chars` },
        { status: 400 },
      );
    }

    const requesterKey = getRequesterKey(request);
    if (isRateLimited(requesterKey)) {
      return NextResponse.json(
        { error: "Please wait before posting again" },
        { status: 429 },
      );
    }

    const entry: GuestbookEntry = {
      name,
      message,
      website: website || undefined,
      social: social || undefined,
      createdAt: new Date(),
    };

    const collection = await getGuestbookCollection();
    const result = await collection.insertOne(entry);

    return NextResponse.json(
      toResponseEntry({ ...entry, _id: result.insertedId }),
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating guestbook entry:", error);
    return NextResponse.json(
      { error: "Failed to create guestbook entry" },
      { status: 500 },
    );
  }
}
