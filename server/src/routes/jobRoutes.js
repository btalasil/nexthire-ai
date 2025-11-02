import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { listJobs, createJob, updateJob, deleteJob } from '../controllers/jobController.js';

const router = Router();
router.use(protect);
router.get('/', listJobs);
router.post('/', createJob);
router.patch('/:id', updateJob);
router.delete('/:id', deleteJob);

export default router;
