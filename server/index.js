import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import authRoutes from './routes/authRoutes.js';
import fs from 'fs';
import path from 'path';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);


// Serve built frontend if present (production), otherwise keep root redirect to health
const distPath = path.resolve(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
	app.use(express.static(distPath));
	app.get('/api/health', (_request, response) => response.json({ message: 'Lengwistik Kreyòl server is ready.' }));
	// fallback to index.html for client-side routing
	app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));
	console.log('Serving static frontend from', distPath);
} else {
	app.get('/', (_request, response) => response.redirect('/api/health'));
	app.get('/api/health', (_request, response) => response.json({ message: 'Lengwistik Kreyòl server is ready.' }));
}

app.listen(port, () => console.log(`API running at http://localhost:${port}`));
