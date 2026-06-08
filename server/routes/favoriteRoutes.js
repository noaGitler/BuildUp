import express from 'express';
import favoriteController from '../controllers/favoriteController.js';
import favoriteValidation from'../middleware/FavoriteValidation.js';

const router = express.Router();

router.get('/', favoriteValidation.validateFetchQuery, favoriteController.getFavoriteProjects);
router.post('/add', favoriteValidation.validateActionBody, favoriteController.addFavorite);
router.delete('/remove', favoriteValidation.validateActionBody, favoriteController.removeFavorite);

export default router;