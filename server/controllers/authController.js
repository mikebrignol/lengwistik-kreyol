import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, findOrCreateGoogleUser, findUserByEmail, findUserById, publicUser } from '../models/userModel.js';

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

const googleCallbackUrl = () => process.env.GOOGLE_CALLBACK_URL || `http://localhost:${process.env.PORT || 3001}/api/auth/google/callback`;
export function startGoogleLogin(_request, response) {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) return response.status(503).send('Google login is not configured yet.');
  const state = jwt.sign({ provider: 'google' }, tokenSecret, { expiresIn: '10m' });
  const params = new URLSearchParams({ client_id: process.env.GOOGLE_CLIENT_ID, redirect_uri: googleCallbackUrl(), response_type: 'code', scope: 'openid email profile', state, prompt: 'select_account' });
  return response.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
}

export async function completeGoogleLogin(request, response) {
  try {
    const state = jwt.verify(request.query.state, tokenSecret);
    if (state.provider !== 'google' || !request.query.code) throw new Error('Invalid Google sign-in response');
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ code: request.query.code, client_id: process.env.GOOGLE_CLIENT_ID, client_secret: process.env.GOOGLE_CLIENT_SECRET, redirect_uri: googleCallbackUrl(), grant_type: 'authorization_code' }) });
    if (!tokenResponse.ok) throw new Error('Google token exchange failed');
    const tokens = await tokenResponse.json();
    const profileResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', { headers: { Authorization: `Bearer ${tokens.access_token}` } });
    if (!profileResponse.ok) throw new Error('Google profile lookup failed');
    const profile = await profileResponse.json();
    if (!profile.sub || !profile.email || !profile.email_verified) throw new Error('Google account email is not verified');
    const user = await findOrCreateGoogleUser({ googleId: profile.sub, name: profile.name || profile.email.split('@')[0], email: profile.email });
    const token = makeToken(user); const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    return response.redirect(`${clientUrl}/?authToken=${encodeURIComponent(token)}`);
  } catch (error) { console.error('Google login failed:', error); return response.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/?authError=google`); }
}
