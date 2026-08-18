import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail, findUserById, publicUser } from '../models/userModel.js';

const tokenSecret = process.env.JWT_SECRET || 'change-this-development-secret';
const makeToken = (user) => jwt.sign({ sub: user.id, email: user.email }, tokenSecret, { expiresIn: '7d' });

export async function register(request, response) {
  const { name, email, password } = request.body;
  if (!name?.trim() || !email?.trim() || !password || password.length < 8) return response.status(400).json({ message: 'Non, imèl, ak yon modpas ki gen omwen 8 karaktè obligatwa.' });
  try { const user = await createUser({ name, email, password }); return response.status(201).json({ user: publicUser(user), token: makeToken(user) }); }
  catch (error) { if (error.code === '23505') return response.status(409).json({ message: 'Gen yon kont ki deja sèvi ak imèl sa a.' }); console.error('Registration failed:', error); return response.status(500).json({ message: 'Nou pa ka kreye kont ou kounye a.' }); }
}

export async function login(request, response) {
  const { email, password } = request.body;
  if (!email || !password) return response.status(400).json({ message: 'Imèl ak modpas obligatwa.' });
  try { const user = await findUserByEmail(email); if (!user || !(await bcrypt.compare(password, user.passwordHash))) return response.status(401).json({ message: 'Imèl oswa modpas pa kòrèk.' }); return response.json({ user: publicUser(user), token: makeToken(user) }); }
  catch (error) { console.error('Login failed:', error); return response.status(500).json({ message: 'Nou pa ka konekte ou kounye a.' }); }
}

export async function getCurrentUser(request, response) {
  try { const user = await findUserById(request.auth.sub); if (!user) return response.status(404).json({ message: 'Itilizatè a pa jwenn.' }); return response.json({ user }); }
  catch (error) { console.error('Current user lookup failed:', error); return response.status(500).json({ message: 'Nou pa ka jwenn kont ou kounye a.' }); }
}

export function logout(_request, response) { return response.status(204).end(); }
