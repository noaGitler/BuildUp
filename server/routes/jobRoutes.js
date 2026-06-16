import { Router } from 'express';
import JobController from '../controllers/jobController.js';
import JobValidation from '../middleware/jobValidator.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', JobController.getAllJobs);
router.get('/:id', JobController.getJobById);
router.post('/', authMiddleware, JobValidation.create, JobController.createJob);
router.put('/:id', authMiddleware, JobController.updateJob);
router.delete('/:id', authMiddleware, JobController.deleteJob);

export default router;