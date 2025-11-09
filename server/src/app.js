import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();  // ✅ important

import jobRoutes from "./routes/jobRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";  // ✅ if you have this

const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

// ✅ Only if resume routes exist
app.use("/api/resume", resumeRoutes);

export default app;
