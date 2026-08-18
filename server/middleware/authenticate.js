import jwt from 'jsonwebtoken';

const tokenSecret = process.env.JWT_SECRET || 'change-this-development-secret';

export default function authenticate(request, response, next) {
  const token = request.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) return response.status(401).json({ message: 'Ou dwe konekte pou kontinye.' });
  try {
    request.auth = jwt.verify(token, tokenSecret);
    return next();
  } catch {
    return response.status(401).json({ message: 'Sesyon ou a ekspire. Tanpri konekte ankò.' });
  }
}
