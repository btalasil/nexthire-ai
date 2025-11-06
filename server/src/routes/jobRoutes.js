import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { listJobs, createJob, updateJob, deleteJob } from '../controllers/jobController.js';

const router = Router();

router.use(protect);

router.get('/', listJobs);
router.post('/', createJob);
router.put('/:id', updateJob);   // ✅ change to PUT
router.delete('/:id', deleteJob);

export default router;
