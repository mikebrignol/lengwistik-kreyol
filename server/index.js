import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import authRoutes from './routes/authRoutes.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

// Redirect the root path to the health endpoint so GET / returns a useful response
app.get('/', (_request, response) => response.redirect('/api/health'));

app.get('/api/health', (_request, response) => response.json({ message: 'Lengwistik Kreyòl server is ready.' }));

app.listen(port, () => console.log(`API running at http://localhost:${port}`));
