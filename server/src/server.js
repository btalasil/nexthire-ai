import "./loadEnv.js";

import app from "./app.js";
import { connectDB } from "./config/db.js";
import { startScheduler } from "./scheduler.js";

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB();

    // IMPORTANT FIX: Bind to 0.0.0.0 for Render deployment
    app.listen(PORT, "0.0.0.0", () => {
      startScheduler();
      console.log(`[✅] API running on 0.0.0.0:${PORT}`);
      console.log(`[🔑] GOOGLE_API_KEY loaded:`, !!process.env.GOOGLE_API_KEY);
    });

  } catch (error) {
    console.error("Server failed to start:", error);
    process.exit(1);
  }
})();
