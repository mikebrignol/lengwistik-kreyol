import 'dotenv/config';
import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

try {
  const databaseResult = await pool.query('SELECT current_database() AS database');
  const columnsResult = await pool.query(
    'SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_schema = $1 AND table_name = $2 ORDER BY ordinal_position',
    ['public', 'users'],
  );
  console.log(JSON.stringify({ connected: true, database: databaseResult.rows[0].database, userColumns: columnsResult.rows }, null, 2));
} catch (error) {
  console.error(JSON.stringify({ connected: false, code: error.code, message: error.message }, null, 2));
  process.exitCode = 1;
} finally {
  await pool.end();
}
