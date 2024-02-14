import { Router } from 'express';
import {
  addComment,
  deleteComment,
  getPostComments,
  updateComment,
} from '../controllers/comment.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route('/:postId').get(getPostComments).post(verifyJWT, addComment);
router
  .route('/c/:commentId')
  .patch(verifyJWT, updateComment)
  .delete(verifyJWT, deleteComment);

export default router;
