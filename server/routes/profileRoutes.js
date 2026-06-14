import express from 'express';
import ProfileController from '../controllers/profileController.js';
import ProfileValidation from '../middleware/profileValidation.js';

const router = express.Router();

router.get('/', ProfileController.getAllProfessionals);
router.get('/:id', ProfileController.getProfile);
router.patch('/:id', ProfileValidation.update, ProfileController.updateProfile);

export default router;