import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase;

export async function getDb() {
  if (!db) {
    db = await SQLite.openDatabaseAsync('expense-tracker.db');
    
    // Initialize tables
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        name TEXT
      );
    `);
  }
  return db;
}