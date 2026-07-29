import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { openDb, exec } from './sqlite.js';

/** Load environment variables for DB initialization. */
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Initialize the SQLite database by executing schema and seed SQL scripts.
 * This is intended for local development.
 */
async function initDb() {
  const dbPath = process.env.DB_PATH || '../database/accommodations.db';
  const schemaPath = path.resolve(__dirname, '../../../database/schema.sql');
  const seedPath = path.resolve(__dirname, '../../../database/seed.sql');

  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  const seedSql = fs.readFileSync(seedPath, 'utf8');

  const db = openDb(dbPath);

  try {
    await exec(db, schemaSql);
    await exec(db, seedSql);
    // eslint-disable-next-line no-console
    console.log('Database initialized successfully.');
  } finally {
    db.close();
  }
}

initDb().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('DB init failed:', err);
  process.exit(1);
});
