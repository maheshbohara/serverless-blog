import { Router } from 'express';
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/post.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/').get(getAllPosts).post(verifyJWT, createPost);

router
  .route('/:postId')
  .get(getPostById)
  .patch(verifyJWT, updatePost)
  .delete(verifyJWT, deletePost);

export default router;
