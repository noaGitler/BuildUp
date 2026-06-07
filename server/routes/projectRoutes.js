import express from 'express';
import ProjectController from '../controllers/projectController.js';
//import { create, update } from '../middleware/projectValidation.js';
import ProjectValidation from '../middleware/projectValidation.js';

const router = express.Router();

router.get('/', ProjectController.getProjectsFiles);
router.get('/:id', ProjectController.getProjectById);
router.post('/create', ProjectValidation.create, ProjectController.createProject);
router.patch('/:id', ProjectValidation.update, ProjectController.updateProject);
router.delete('/:id', ProjectController.deleteProject);

export default router;