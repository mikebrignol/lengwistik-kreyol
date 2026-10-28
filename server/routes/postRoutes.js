import { Router } from 'express';
import { addPost, createComment, editPost, getComments, getPost, likePost, listPosts, removePost } from '../controllers/postController.js';
import authenticate from '../middleware/authenticate.js';
import requireAdmin from '../middleware/requireAdmin.js';

const router = Router();
router.get('/', listPosts);
router.get('/:slug/comments', getComments);
router.post('/:slug/comments', authenticate, createComment);
router.post('/:slug/like', authenticate, likePost);
router.get('/:slug', getPost);
router.post('/', authenticate, requireAdmin, addPost);
router.put('/:id', authenticate, requireAdmin, editPost);
router.delete('/:id', authenticate, requireAdmin, removePost);
export default router;
