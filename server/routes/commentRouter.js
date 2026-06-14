import express from 'express';
import CommentController from '../controllers/commentController.js';
import CommentValidation from '../middleware/commentValidation.js';

const router = express.Router();

router.get('/:projectId', CommentValidation.fetch, CommentController.getCommentsByProject);
router.post('/add', CommentValidation.create, CommentController.addComment);
router.put('/:commentId', CommentValidation.update, CommentController.updateComment);
router.delete('/:commentId', CommentValidation.delete, CommentController.deleteComment);

export default router;