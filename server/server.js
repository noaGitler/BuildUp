import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js'
import commentRouter from './routes/commentRouter.js';
import jobRoutes from './routes/jobRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import professionalReviewRoutes from './routes/professionalReviewRoutes.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors()); 
app.use(express.json());

// Serve the uploads folder statically so the client can access uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/comments', commentRouter);
app.use('/api/jobs', jobRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/reviews', professionalReviewRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});