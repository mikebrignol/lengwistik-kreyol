import { findUserById } from '../models/userModel.js';

export default async function requireAdmin(request, response, next) {
  try {
    const user = await findUserById(request.auth.sub);
    if (!user || user.role !== 'admin') return response.status(403).json({ message: 'Se administratè sèlman ki ka fè sa.' });
    request.user = user;
    return next();
  } catch (error) {
    console.error('Admin authorization failed:', error);
    return response.status(500).json({ message: 'Nou pa ka verifye dwa administratè yo kounye a.' });
  }
}
