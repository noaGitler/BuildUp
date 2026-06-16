import express from 'express';
import ProfileController from '../controllers/profileController.js';
import ProfileValidation from '../middleware/profileValidation.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', ProfileController.getAllProfessionals);
router.get('/:id', ProfileController.getProfile);
router.patch('/:id', authMiddleware, ProfileValidation.update, ProfileController.updateProfile);

export default router;