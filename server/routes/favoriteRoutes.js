import express from 'express';
import FavoriteController from '../controllers/favoriteController.js';
import FavoriteValidation from '../middleware/favoriteValidation.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, FavoriteController.getFavoriteProjects);
router.post('/add', authMiddleware, FavoriteValidation.validateActionBody, FavoriteController.addFavorite);
router.delete('/remove', authMiddleware, FavoriteValidation.validateActionBody, FavoriteController.removeFavorite);

export default router;