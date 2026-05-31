import { Router } from 'express';
import CategoryController from '../controllers/CategoryController.js';

const router = Router();

// Get all categories
router.get('/', CategoryController.getAllCategories);

export default router;