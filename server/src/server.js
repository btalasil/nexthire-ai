import dotenv from "dotenv";
dotenv.config();  // ✅ loads .env at the very start

import app from './app.js';
import { connectDB } from './config/db.js';
import { startScheduler } from './scheduler.js';

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      startScheduler();
      console.log(`[✅] API running on http://localhost:${PORT}`);
      console.log(`[✅] GOOGLE_API_KEY: `, !!process.env.GOOGLE_API_KEY);
      console.log(`[✅] GEMINI_API_KEY: `, !!process.env.GEMINI_API_KEY);
    });
  } catch (error) {
    console.error("Server failed to start:", error);
    process.exit(1);
  }
})();
