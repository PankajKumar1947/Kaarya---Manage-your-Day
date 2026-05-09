import * as SQLite from 'expo-sqlite';

export const DB_NAME = 'kaarya.db';

export const db = SQLite.openDatabaseSync(DB_NAME);