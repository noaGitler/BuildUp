import express from 'express';
import ProjectController from '../controllers/projectController.js';
import { validateProjectCreation } from '../middleware/projectValidation.js';

const router = express.Router();

router.get('/', ProjectController.getProjectsFiles);
router.get('/:id', ProjectController.getProjectById);
router.post('/create', validateProjectCreation, ProjectController.createProject);
router.delete('/:id', ProjectController.deleteProject);

export default router;