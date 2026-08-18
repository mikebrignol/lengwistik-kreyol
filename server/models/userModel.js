import bcrypt from 'bcryptjs';
import pool from '../config/database.js';
export async function createUser({ name, email, password }) { const result = await pool.query(`INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, password_hash AS "passwordHash"`, [name.trim(), email.trim().toLowerCase(), await bcrypt.hash(password, 12)]); return result.rows[0]; }
export async function findUserByEmail(email) { const result = await pool.query(`SELECT id, name, email, password_hash AS "passwordHash" FROM users WHERE email = $1 LIMIT 1`, [email.trim().toLowerCase()]); return result.rows[0] || null; }
export async function findUserById(id) { const result = await pool.query('SELECT id, name, email FROM users WHERE id = $1 LIMIT 1', [id]); return result.rows[0] || null; }
export function publicUser(user) { return { id: user.id, name: user.name, email: user.email }; }
