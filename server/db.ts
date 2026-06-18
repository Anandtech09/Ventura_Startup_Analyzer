import Database from "better-sqlite3";
import path from "path";

const dbPath = process.env.VERCEL ? "/tmp/ventura.db" : "ventura.db";
const db = new Database(dbPath);
db.pragma("foreign_keys = ON");

// Initialize DB
db.exec(`
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
`);

export default db;
