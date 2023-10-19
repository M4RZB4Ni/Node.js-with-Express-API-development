const { makeGraphQLRequest } = require('../utils/graphqlRequests');
const { verifyToken } = require('../middleware/authentication');
const { createPostService, getUserPostsService, updatePostService } = require('../services/postService');

const createPost = async (req, res) =>
{
  try
  {
    // Extracted user_id from token
    const { user_id } = req.user;

    // Extract post data from request body
    const { title, content } = req.body;

    if (!title || !content)
    {
      return res.status(400).json({ success: false, message: 'Please provide title and content.' });
    }

    const postCreationResult = await createPostService(user_id, title, content);

    if (postCreationResult.errors)
    {
      // Handle GraphQL errors
      console.error('GraphQL errors:', postCreationResult.errors);
      return res.status(500).json({ success: false, message: postCreationResult.errors });
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
      return res.json(response);
    }

    return res.json({ success: false });
  } catch (error)
  {
    console.error('Error creating post:', error);
    res.status(500).json({ success: false, message: 'Error creating post.' });
  }
};

const getUserPosts = async (req, res) =>
{
  try
  {

    // Extracted user_id from token
    const { user_id } = req.user;

    const getPostsResult = await getUserPostsService(user_id);

    if (getPostsResult.errors)
    {
      // Handle GraphQL errors
      return res.status(500).json({ success: false, message: getPostsResult.errors });
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
      return res.json(response);
    }

    res.json({ success: false });
  } catch (error)
  {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ success: false, message: 'Error fetching user posts.' });
  }
};

const editPost = async (req, res) =>
{
  try
  {

    // Extracted user_id from token
    const { user_id } = req.user;

    // Extract post data from request body
    const { title, content } = req.body;
    const post_id = req.params.post_id;



    // Check if required fields are provided
    if (!post_id || !title || !content)
    {
      return res.status(400).json({ success: false, message: 'Please provide post_id, title, and content.' });
    }

    const result = await updatePostService(post_id, user_id, title, content);

    if (result.errors)
    {
      // Handle GraphQL errors
      console.error('GraphQL errors:', result.errors);
      return res.status(500).json({ success: false, message: result.errors });
    }

    if (result.data)
    {
      return res.status(200).json({ success: true, message: result.data });
    }

  } catch (error)
  {
    console.error('Error editing post:', error);
    res.status(500).json({ success: false, message: 'Error editing post.' });
  }
};

const deletePost = async (req, res) =>
{
  try
  {


    // Extracted user_id from token
    const { user_id } = req.user;

    // Extract post_id from the request parameters
    const { post_id } = req.params;

    // Check if post_id is provided
    if (!post_id)
    {
      return res.status(400).json({ success: false, message: 'Please provide post_id.' });
    }

    // GraphQL mutation to delete an existing post
    const deletePostMutation = `
        mutation DeletePost($post_id: uuid!, $user_id: uuid!) {
          delete_posts_by_pk(post_id: ${post_id}, user_id: ${user_id}) {
            post_id
            title
            content
          }
        }
      `;

    // Variables for the GraphQL mutation
    const variables = {
      post_id,
      user_id
    };

    // Make the GraphQL request to delete the post
    const response = await makeGraphQLRequest(deletePostMutation, variables);

    // Extract the deleted post information from the response
    const { post_id: deletedPostId, title: deletedTitle, content: deletedContent } = response.data.delete_posts_by_pk;

    res.json({ success: true, post_id: deletedPostId, title: deletedTitle, content: deletedContent });
  } catch (error)
  {
    console.error('Error deleting post:', error);
    res.status(500).json({ success: false, message: 'Error deleting post.' });
  }
};

module.exports = {
  createPost,
  getUserPosts,
  editPost,
  deletePost
};
