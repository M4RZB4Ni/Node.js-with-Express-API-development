
const express = require('express');
const bodyParser = require('body-parser');
const { verifyToken } = require('./middleware/authentication');
const { createPost, getUserPosts, editPost, deletePost } = require('./controllers/postController');
const { registerUser, loginUser } = require('./controllers/authController');

const app = express();
app.use(bodyParser.json());


// Register and login routes
app.post('/api/register', registerUser);
app.post('/api/login', loginUser);
app.use(verifyToken);

// Blog post routes (protected with token verification)
app.post('/api/posts/create', verifyToken, createPost);
app.get('/api/posts/getAll', verifyToken, getUserPosts);
app.put('/api/posts/:post_id/edit', verifyToken, editPost);
app.delete('/api/posts/:post_id/delete', verifyToken, deletePost);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
{
  console.log(`Server is running on port ${PORT}`);
});
