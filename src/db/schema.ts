import { db } from './index';

export const initDatabase = async () => {
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
        date TEXT,
        created_at TEXT
      );
    `);

    // Migration: Add date column to todos if it doesn't exist
    const todoTableInfo = await db.getAllAsync<{ name: string }>('PRAGMA table_info(todos)');
    const hasDate = todoTableInfo.some(col => col.name === 'date');
    if (!hasDate) {
      await db.execAsync('ALTER TABLE todos ADD COLUMN date TEXT');
    }

    // Migration: Add created_at to users
    const userTableInfo = await db.getAllAsync<{ name: string }>('PRAGMA table_info(users)');
    const hasUserCreatedAt = userTableInfo.some(col => col.name === 'created_at');
    if (!hasUserCreatedAt) {
      await db.execAsync('ALTER TABLE users ADD COLUMN created_at TEXT');
    }

    // Migration: Add created_at to todos
    const hasTodoCreatedAt = todoTableInfo.some(col => col.name === 'created_at');
    if (!hasTodoCreatedAt) {
      await db.execAsync('ALTER TABLE todos ADD COLUMN created_at TEXT');
    }
  } catch (error) {
    console.error("Database initialization error:", error);
  }
};
