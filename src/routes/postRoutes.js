const auth = require('../middleware/authentication');
const { createPost, getUserPosts, editPost, deletePost } = require('../controllers/postController');

const express = require('express');
const router = express.Router();

router.use(auth.initialize);

// Blog post routes (protected with token verification)
router.post('/create', auth.authentication, createPost);
router.get('/getAll', auth.authentication, getUserPosts);
router.put('/:post_id/edit', auth.authentication, editPost);
router.delete('/:post_id/delete', auth.authentication, deletePost);


module.exports = router;