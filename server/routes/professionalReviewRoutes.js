import express from 'express';
import ProfessionalReviewController from '../controllers/professionalReviewController.js';
import ProfessionalReviewValidation from '../middleware/professionalReviewValidation.js';

const router = express.Router();

router.get('/professional/:professionalId', ProfessionalReviewController.getProfessionalReviews);
router.post('/professional/:professionalId', ProfessionalReviewValidation.create, ProfessionalReviewController.addReview);
router.put('/:reviewId', ProfessionalReviewValidation.update, ProfessionalReviewController.editReview);
router.delete('/:reviewId', ProfessionalReviewController.deleteReview);

export default router;