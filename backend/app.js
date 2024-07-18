// backend/app.js
import express from 'express';
import cors from 'cors';
import path from 'path';
import compression from 'compression';
import { fileURLToPath } from 'url';
import userRoutes from './src/routes/userRoutes.js';
import quizRoutes from './src/routes/quizRoutes.js';
import adminRoutes from "./src/routes/adminRoutes.js";

// Define __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(compression());

// Serve static files from the "public" directory
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/profile_photos', express.static(path.join(__dirname, 'profile_photos')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/admin', adminRoutes);

export default app;
