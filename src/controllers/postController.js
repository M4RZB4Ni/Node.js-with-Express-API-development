const { createPostService, getUserPostsService, updatePostService, deletePostByIdService } = require('../services/postService');
const { sendEmailNotification } = require('../services/emailService');
const { AppError } = require('../utils/appError');

const createPost = async (req, res,next) =>
{
  try
  {
    // Extracted user_id from token
    const { user_id, email } = req.user;
    // Extract post data from request body
    const { title, content } = req.body;

    if (!title || !content)
    {
      next(new AppError('Please provide title and content.', 400));
    }

    const postCreationResult = await createPostService(user_id, title, content);

    if (postCreationResult.errors)
    {
      // Handle GraphQL errors
      console.error('GraphQL errors:', postCreationResult.errors);
      next(new AppError(postCreationResult.errors[0].message, 500));

    }

    if (postCreationResult.data)
    {
      const post = postCreationResult.data.insert_blog_post.returning[0];
      const response = {
        success: true,
        post_id: post.post_id,
        title: post.title,
        content: post.content,
      };
      sendEmailNotification(email, post.post_id);
      return res.status(200).json(response);
    }


  } catch (error)
  {
    console.error('Error creating post:', error);
    next(new AppError('Error creating post.', 500));
  }
};

const getUserPosts = async (req, res,next) =>
{
  try
  {

    // Extracted user_id from token
    const { user_id } = req.user;

    const getPostsResult = await getUserPostsService(user_id);

    if (getPostsResult.errors)
    {
      // Handle GraphQL errors
      next(new AppError(getPostsResult.errors[0].message, 500));

    }

    if (getPostsResult.data)
    {

      const rawPosts = getPostsResult.data.blog_post;
      const posts = [];
      rawPosts.forEach((post) =>
      {
        posts.push({ title: post.title, content: post.content, id: post.post_id, lastUpdateDate: post.updated_at });
      });
      const response = {
        success: true,
        posts: posts,
      };
      return res.status(200).json(response);
    }

  } catch (error)
  {
    console.error('Error fetching user posts:', error);
    next(new AppError('Error fetching user posts.', 500));
  }
};

const editPost = async (req, res,next) =>
{
  try
  {

    // Extracted user_id from token
    const { user_id } = req.user;

    // Extract post data from request body
    const { title, content } = req.body;
    const post_id = req.params.post_id;



    // Check if required fields are provided
    if (!post_id)
    {
      next(new AppError('Please provide post_id', 400));
    }

    const result = await updatePostService(post_id, user_id, title, content);

    if (result.errors)
    {
      // Handle GraphQL errors
      console.error('GraphQL errors:', result.errors);
      next(new AppError(result.errors[0].message, 500));
    }

    if (result.data)
    {
      return res.status(200).json({ success: true, message: result.data });
    }

  } catch (error)
  {
    console.error('Error editing post:', error);
    next(new AppError('Error editing post.', 500));
  }
};

const deletePost = async (req, res,next) =>
{
  try
  {


    // Extracted user_id from token
    const { user_id } = req.user;

    // Extract post_id from the request parameters
    const post_id = req.params.post_id;

    // Check if post_id is provided
    if (!post_id)
    {
      next(new AppError('Please provide post_id.', 400));
    }
    const result = await deletePostByIdService(post_id, user_id);

    if (result.errors)
    {
      // Handle GraphQL errors
      console.error('GraphQL errors:', result.errors);
      next(new AppError(result.errors[0].message, 500));
    }

    if (result.data)
    {
      return res.status(200).json({ success: true, message: result.data });
    }

  } catch (error)
  {
    console.error('Error deleting post:', error);
    next(new AppError('Error deleting post.', 500));
  }
};

module.exports = {
  createPost,
  getUserPosts,
  editPost,
  deletePost
};
