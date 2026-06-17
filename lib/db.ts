import { createClient, type Client } from "@libsql/client";

const globalForDb = globalThis as typeof globalThis & {
  _db?: Client;
  _schemaReady?: Promise<void>;
};

function getDbUrl(): string {
  const url = process.env.TURSO_DATABASE_URL;
  if (!url) {
    throw new Error("Missing required environment variable: TURSO_DATABASE_URL");
  }
  return url;
}

/** Returns the singleton database client (synchronous). */
function getClient(): Client {
  if (!globalForDb._db) {
    const url = getDbUrl();
    globalForDb._db = createClient({
      url,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }
  return globalForDb._db;
}

/** Creates tables if they don't exist (idempotent). */
function initSchema(): Promise<void> {
  if (!globalForDb._schemaReady) {
    const db = getClient();
    globalForDb._schemaReady = db
      .executeMultiple(`
        CREATE TABLE IF NOT EXISTS projects (
          id          INTEGER PRIMARY KEY AUTOINCREMENT,
          title       TEXT    NOT NULL,
          description TEXT    NOT NULL,
          tags        TEXT    DEFAULT '[]',
          demo_url    TEXT,
          code_url    TEXT    NOT NULL DEFAULT '',
          created_at  TEXT    DEFAULT (datetime('now')),
          updated_at  TEXT    DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS guestbook (
          id         INTEGER PRIMARY KEY AUTOINCREMENT,
          name       TEXT    NOT NULL,
          message    TEXT    NOT NULL,
          website    TEXT,
          social     TEXT,
          created_at TEXT    DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS site_config (
          key        TEXT    PRIMARY KEY,
          value      TEXT    NOT NULL,
          updated_at TEXT    DEFAULT (datetime('now'))
        );
      `)
      .then(() => {})
      .catch((err) => {
        // Reset so next call can retry
        globalForDb._schemaReady = undefined;
        throw err;
      });
  }
  return globalForDb._schemaReady;
}

/**
 * Returns the DB client after ensuring the schema is ready.
 * Always `await` this in API routes: `const db = await getDb();`
 */
export async function getDb(): Promise<Client> {
  await initSchema();
  return getClient();
}
