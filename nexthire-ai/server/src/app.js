import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());
app.use(morgan('dev'));

app.get('/', (_req, res) => res.json({ ok: true, name: 'CareerPilot API' }));

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/resume', resumeRoutes);

// centralized error
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

export default app;
