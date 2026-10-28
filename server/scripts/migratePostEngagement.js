import 'dotenv/config';
import fs from 'node:fs/promises';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false });
try {
  await pool.query(await fs.readFile(new URL('../database/migrations/004_add_post_engagement.sql', import.meta.url), 'utf8'));
  console.log('Post engagement migration applied.');
} finally { await pool.end(); }
