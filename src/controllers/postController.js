const {
  createPostService,
  getUserPostsService,
  updatePostService,
  deletePostByIdService,
} = require('../services/postService');
const { sendEmailNotification } = require('../services/emailService');
const { AppError } = require('../utils/appError');

const handleServiceResponse = (res, serviceResult, successStatus = 200) =>
{
  if (serviceResult.errors)
  {
    // Handle GraphQL errors
    console.error('GraphQL errors:', serviceResult.errors);
    throw new AppError(serviceResult.errors[0].message, 500);
  }

  if (serviceResult.data)
  {
    if (res)
    {
      res.status(successStatus).json(serviceResult.data);
    }
    return serviceResult.data;
  }

  throw new AppError('Operation failed.', 500);
};

const createPost = async (req, res, next) =>
{
  try
  {
    const { user_id, email } = req.user;
    const { title, content } = req.body;

    if (!title || !content)
    {
      throw new AppError('Please provide title and content.', 400);
    }

    const postCreationResult = await createPostService(user_id, title, content);
    const post = handleServiceResponse(res, postCreationResult);

    sendEmailNotification(email, post.post_id);

    res.status(200).json({
      success: true,
      post_id: post.post_id,
      title: post.title,
      content: post.content,
    });
  } catch (error)
  {
    next(error);
  }
};

const getUserPosts = async (req, res, next) =>
{
  try
  {
    const { user_id } = req.user;
    const getPostsResult = await getUserPostsService(user_id);
    const rawPosts = handleServiceResponse(res, getPostsResult);

    const posts = rawPosts.map((post) => ({
      title: post.title,
      content: post.content,
      id: post.post_id,
      lastUpdateDate: post.updated_at,
    }));

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error)
  {
    next(error);
  }
};

const editPost = async (req, res, next) =>
{
  try
  {
    const { user_id } = req.user;
    const { title, content } = req.body;
    const post_id = req.params.post_id;

    if (!post_id)
    {
      throw new AppError('Please provide post_id', 400);
    }

    const result = await updatePostService(post_id, user_id, title, content);
    handleServiceResponse(res, result);

    res.status(200).json({ success: true, message: result.data });
  } catch (error)
  {
    next(error);
  }
};

const deletePost = async (req, res, next) =>
{
  try
  {
    const { user_id } = req.user;
    const post_id = req.params.post_id;

    if (!post_id)
    {
      throw new AppError('Please provide post_id.', 400);
    }

    const result = await deletePostByIdService(post_id, user_id);
    handleServiceResponse(res, result);

    res.status(200).json({ success: true, message: result.data });
  } catch (error)
  {
    next(error);
  }
};

module.exports = {
  createPost,
  getUserPosts,
  editPost,
  deletePost,
};