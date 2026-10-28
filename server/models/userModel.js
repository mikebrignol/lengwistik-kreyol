import bcrypt from 'bcryptjs';
import pool from '../config/database.js';
export async function createUser({ name, email, password }) {
  const result = await pool.query(
    `INSERT INTO users (name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, role, password_hash AS "passwordHash"`,
    [name.trim(), email.trim().toLowerCase(), await bcrypt.hash(password, 12)],
  );
  return result.rows[0];
}

export async function findUserByEmail(email) {
  const result = await pool.query(
    `SELECT id, name, email, role, password_hash AS "passwordHash"
     FROM users WHERE email = $1 LIMIT 1`,
    [email.trim().toLowerCase()],
  );
  return result.rows[0] || null;
}

export async function findUserById(id) {
  const result = await pool.query(
    `SELECT id, name, email, role
     FROM users WHERE id = $1 LIMIT 1`,
    [id],
  );
  return result.rows[0] || null;
}

export async function findUserByGoogleId(googleId) {
  const result = await pool.query('SELECT id, name, email, role FROM users WHERE google_id = $1 LIMIT 1', [googleId]);
  return result.rows[0] || null;
}

export async function findOrCreateGoogleUser({ googleId, name, email }) {
  const existingGoogleUser = await findUserByGoogleId(googleId);
  if (existingGoogleUser) return existingGoogleUser;
  const existingEmailUser = await findUserByEmail(email);
  if (existingEmailUser) {
    const result = await pool.query('UPDATE users SET google_id = $1 WHERE id = $2 RETURNING id, name, email, role', [googleId, existingEmailUser.id]);
    return result.rows[0];
  }
  const result = await pool.query('INSERT INTO users (name, email, google_id) VALUES ($1, $2, $3) RETURNING id, name, email, role', [name, email.toLowerCase(), googleId]);
  return result.rows[0];
}

export function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}
