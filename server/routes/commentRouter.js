import express from 'express';
import CommentController from '../controllers/commentController.js';
import CommentValidation from '../middleware/commentValidation.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:projectId', CommentValidation.fetch, CommentController.getCommentsByProject);
router.post('/add', authMiddleware, CommentValidation.create, CommentController.addComment);
router.put('/:commentId', authMiddleware, CommentValidation.update, CommentController.updateComment);
router.delete('/:commentId', authMiddleware, CommentValidation.delete, CommentController.deleteComment);

export default router;