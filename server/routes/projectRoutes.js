import express from 'express';
import ProjectController from '../controllers/projectController.js';
import { validateProjectCreation } from '../middleware/projectValidation.js';

const router = express.Router();

router.post('/create', validateProjectCreation, ProjectController.createProject);
router.get('/:id', ProjectController.getProjectById);
router.get('/', ProjectController.getProjectsFiles);

export default router;