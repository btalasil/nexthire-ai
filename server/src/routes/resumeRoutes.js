import { Router } from "express";
import multer from "multer";
import { uploadResume, compareWithJD } from "../controllers/resumeController.js";

const router = Router();

// use in-memory storage; limit to 5MB
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/upload", upload.single("file"), uploadResume);
router.post("/compare", compareWithJD);

export default router;
