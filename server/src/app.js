import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import jobRoutes from "./routes/jobRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";

const app = express();

app.use(express.json());

// ✅ Correct & safe CORS setup
app.use(
  cors({
    origin: [
      "http://localhost:5173",            // local dev
      "https://nexthire-ai.onrender.com"  // your deployed frontend
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/resume", resumeRoutes);

export default app;
