import sqlite3 from "sqlite3";
import { logger } from "./index.mjs";

const db = new sqlite3.Database(
  "../data/db.sqlite",
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      return logger.error(err.message);
    }
    logger.info("SQlite: connected to database.");
  }
);

db.serialize(() => {
  // Create `users`
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT
    )`
  );

  // Create `items`
  db.run(
    `CREATE TABLE IF NOT EXISTS items (
      userId TEXT,
      itemId TEXT,
      episodeId TEXT,
      type TEXT,
      author TEXT,
      title TEXT,
      subtitle TEXT,
      progress NUMERIC,
      updatedAt TEXT
    )`
  );
});

export default db;
