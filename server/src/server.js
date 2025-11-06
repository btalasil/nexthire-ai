import app from './app.js';
import { connectDB } from './config/db.js';
import { startScheduler } from './scheduler.js';



const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      startScheduler();
      console.log(`API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server failed to start:", error);
    process.exit(1);
  }
})();
