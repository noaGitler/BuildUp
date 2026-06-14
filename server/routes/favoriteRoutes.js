import express from 'express';
import FavoriteController from '../controllers/favoriteController.js';
import FavoriteValidation from'../middleware/favoriteValidation.js';

const router = express.Router();

router.get('/', FavoriteValidation.validateFetchQuery, FavoriteController.getFavoriteProjects);
router.post('/add', FavoriteValidation.validateActionBody, FavoriteController.addFavorite);
router.delete('/remove', FavoriteValidation.validateActionBody, FavoriteController.removeFavorite);

export default router;