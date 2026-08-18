import pg from 'pg';
const { Pool } = pg;
if (!process.env.DATABASE_URL) console.warn('DATABASE_URL is not configured. Authentication requests will not work until it is added to .env.');
export default new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false });
