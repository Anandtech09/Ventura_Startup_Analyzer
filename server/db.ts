import { createClient, type Client, type InValue } from "@libsql/client";
import Database from "better-sqlite3";

// --- Detect Environment ---
const isTurso = !!(process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN);

// --- Turso (Production) Client ---
let tursoClient: Client | null = null;
if (isTurso) {
  tursoClient = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });
  console.log("🗄️  Using Turso (cloud SQLite) for database");
}

// --- Local SQLite (Development) Client ---
let localDb: InstanceType<typeof Database> | null = null;
if (!isTurso) {
  localDb = new Database("ventura.db");
  localDb.pragma("foreign_keys = ON");
  console.log("🗄️  Using local SQLite (ventura.db) for database");
}

// --- Schema ---
const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS startups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    idea TEXT,
    analysis TEXT,
    logo_url TEXT,
    website_html TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS website_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    startup_id INTEGER,
    html TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(startup_id) REFERENCES startups(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS analysis_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    startup_id INTEGER,
    analysis TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(startup_id) REFERENCES startups(id) ON DELETE CASCADE
  );
`;

// --- Initialize DB (must be called on startup) ---
export async function initDb(): Promise<void> {
  if (isTurso && tursoClient) {
    // Turso requires executing statements individually
    const statements = SCHEMA_SQL
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    for (const stmt of statements) {
      await tursoClient.execute(stmt);
    }
    console.log("✅ Turso database tables initialized");
  } else if (localDb) {
    localDb.exec(SCHEMA_SQL);
    console.log("✅ Local database tables initialized");
  }
}

// --- Unified Async DB Functions ---

/**
 * Execute a write query (INSERT, UPDATE, DELETE).
 * Returns lastInsertRowid and changes count.
 */
export async function dbRun(
  sql: string,
  params: InValue[] = []
): Promise<{ lastInsertRowid: number; changes: number }> {
  if (isTurso && tursoClient) {
    const result = await tursoClient.execute({ sql, args: params });
    return {
      lastInsertRowid: Number(result.lastInsertRowid),
      changes: result.rowsAffected,
    };
  } else {
    const stmt = localDb!.prepare(sql);
    const result = stmt.run(...params);
    return {
      lastInsertRowid: result.lastInsertRowid as number,
      changes: result.changes,
    };
  }
}

/**
 * Execute a read query and return a single row (or undefined).
 */
export async function dbGet(
  sql: string,
  params: InValue[] = []
): Promise<any | undefined> {
  if (isTurso && tursoClient) {
    const result = await tursoClient.execute({ sql, args: params });
    if (result.rows.length === 0) return undefined;
    // Convert Row to plain object
    const row = result.rows[0];
    const obj: any = {};
    for (const col of result.columns) {
      obj[col] = row[col];
    }
    return obj;
  } else {
    return localDb!.prepare(sql).get(...params);
  }
}

/**
 * Execute a read query and return all matching rows.
 */
export async function dbAll(
  sql: string,
  params: InValue[] = []
): Promise<any[]> {
  if (isTurso && tursoClient) {
    const result = await tursoClient.execute({ sql, args: params });
    return result.rows.map((row) => {
      const obj: any = {};
      for (const col of result.columns) {
        obj[col] = row[col];
      }
      return obj;
    });
  } else {
    return localDb!.prepare(sql).all(...params);
  }
}
