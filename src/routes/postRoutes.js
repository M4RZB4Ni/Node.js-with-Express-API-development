const { verifyToken } = require('../middleware/authentication');
const { createPost, getUserPosts, editPost, deletePost } = require('../controllers/postController');

const express = require('express');
const router = express.Router();


// Blog post routes (protected with token verification)
router.post('/create', verifyToken, createPost);
router.get('/getAll', verifyToken, getUserPosts);
router.put('/:post_id/edit', verifyToken, editPost);
router.delete('/:post_id/delete', verifyToken, deletePost);


module.exports = router;