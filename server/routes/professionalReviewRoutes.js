import express from 'express';
import ProfessionalReviewController from '../controllers/professionalReviewController.js';
import ProfessionalReviewValidation from '../middleware/professionalReviewValidation.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/professional/:professionalId', ProfessionalReviewController.getProfessionalReviews);
router.post('/professional/:professionalId', authMiddleware, ProfessionalReviewValidation.create, ProfessionalReviewController.addReview);
router.put('/:reviewId', authMiddleware, ProfessionalReviewValidation.update, ProfessionalReviewController.editReview);
router.delete('/:reviewId', authMiddleware, ProfessionalReviewController.deleteReview);

export default router;