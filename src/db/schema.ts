import { db } from './index';

export const initDatabase = async () => {
  // First, ensure the tables have the correct columns
  // In a real app, you'd use migrations. For now, we'll check and add if missing.
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT,
        name TEXT,
        created_at TEXT
      );

      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        title TEXT,
        completed INTEGER DEFAULT 0,
        created_at TEXT
      );
    `);

    // Migration: Add created_at if it doesn't exist (handles existing databases)
    const tableInfo = await db.getAllAsync<{ name: string }>('PRAGMA table_info(users)');
    const hasCreatedAt = tableInfo.some(col => col.name === 'created_at');
    
    if (!hasCreatedAt) {
      await db.execAsync('ALTER TABLE users ADD COLUMN created_at TEXT');
      await db.execAsync('ALTER TABLE todos ADD COLUMN created_at TEXT');
    }
  } catch (error) {
    console.error("Database initialization error:", error);
  }
};
