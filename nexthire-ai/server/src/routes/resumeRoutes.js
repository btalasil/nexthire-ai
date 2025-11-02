import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/upload.js';
import { uploadResume, compareWithJD } from '../controllers/resumeController.js';

const router = Router();
router.use(protect);
router.post('/upload', upload.single('file'), uploadResume);
router.post('/compare', compareWithJD);

export default router;
