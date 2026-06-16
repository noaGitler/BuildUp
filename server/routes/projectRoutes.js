import express from 'express';
import ProjectController from '../controllers/projectController.js';
import ProjectValidation from '../middleware/projectValidation.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', ProjectController.getProjectsFiles);
router.get('/:id', ProjectController.getProjectById);
router.post('/create', authMiddleware, ProjectValidation.create, ProjectController.createProject);
router.patch('/:id', authMiddleware, ProjectValidation.update, ProjectController.updateProject);
router.delete('/:id', authMiddleware, ProjectController.deleteProject);

export default router;