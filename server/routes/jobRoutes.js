// server/routes/jobRoutes.js
import { Router } from 'express';
import jobController from '../controllers/jobController.js';
import { validateJobCreation } from '../middleware/jobValidator.js';

const router = Router();

/**
 * Route to fetch all job posts with dynamic filtration parameters
 * GET /api/jobs
 */
router.get('/', jobController.getAllJobs);

/**
 * Route to fetch a specific single job post by its primary ID
 * GET /api/jobs/:id
 */
router.get('/:id', jobController.getJobById);

/**
 * Route to publish and persist a brand new job opportunity
 * POST /api/jobs
 */
router.post('/', validateJobCreation, jobController.createNewJobPost);

/**
 * Route to modify and update an existing job post registry
 * PUT /api/jobs/:id
 */
router.put('/:id', jobController.updateJob);

/**
 * Route to permanently delete a specific job post from the database registry
 * DELETE /api/jobs/:id
 */
router.delete('/:id', jobController.deleteJob);

export default router;