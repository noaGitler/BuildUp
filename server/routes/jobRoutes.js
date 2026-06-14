// server/routes/jobRoutes.js
import { Router } from 'express';
import JobController from '../controllers/jobController.js';
import JobValidation from '../middleware/jobValidator.js';

const router = Router();

router.get('/', JobController.getAllJobs);
router.get('/:id', JobController.getJobById);
router.post('/', JobValidation.create, JobController.createNewJobPost);
router.put('/:id', JobController.updateJob);
router.delete('/:id', JobController.deleteJob);

export default router;