const { makeGraphQLRequest } = require('../utils/graphqlRequests');
const { verifyToken } = require('../middleware/authentication');
const { createPostService } = require('../services/postService');

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
      return res.status(500).json({ success: false, message: postCreationResult.error });
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
    // Verify the user's token and extract user_id
    const verificationResult = verifyToken(req, res);

    if (!verificationResult.success)
    {
      // Token verification failed
      return res.status(401).json({ success: false, message: verificationResult.message });
    }

    // Extracted user_id from token
    const { user_id } = req.user;

    // GraphQL query to fetch posts for a specific user
    const getUserPostsQuery = `
        query GetUserPosts($user_id: uuid!) {
          posts(where: { user_id: { _eq: ${user_id} } }) {
            post_id
            title
            content
          }
        }
      `;

    // Variables for the GraphQL query
    const variables = {
      user_id
    };

    // Make the GraphQL request to fetch the user's posts
    const response = await makeGraphQLRequest(getUserPostsQuery, variables);

    // Extract the posts from the response
    const userPosts = response.data.posts;

    res.json({ success: true, userPosts });
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
    // Verify the user's token and extract user_id
    const verificationResult = verifyToken(req, res);

    if (!verificationResult.success)
    {
      // Token verification failed
      return res.status(401).json({ success: false, message: verificationResult.message });
    }

    // Extracted user_id from token
    const { user_id } = req.user;

    // Extract post data from request body
    const { post_id, title, content } = req.body;

    // Check if required fields are provided
    if (!post_id || !title || !content)
    {
      return res.status(400).json({ success: false, message: 'Please provide post_id, title, and content.' });
    }

    // GraphQL mutation to update an existing post
    const editPostMutation = `
        mutation EditPost($post_id: uuid!, $user_id: uuid!, $title: String!, $content: String!) {
          update_posts_by_pk(pk_columns: { post_id: ${post_id}, user_id: ${user_id} }, _set: { title: ${title}, content: ${content} }) {
            post_id
            title
            content
          }
        }
      `;

    // Variables for the GraphQL mutation
    const variables = {
      post_id,
      user_id,
      title,
      content
    };

    // Make the GraphQL request to edit the post
    const response = await makeGraphQLRequest(editPostMutation, variables);

    // Extract the edited post information from the response
    const { post_id: editedPostId, title: editedTitle, content: editedContent } = response.data.update_posts_by_pk;

    res.json({ success: true, post_id: editedPostId, title: editedTitle, content: editedContent });
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
    // Verify the user's token and extract user_id
    const verificationResult = verifyToken(req, res);

    if (!verificationResult.success)
    {
      // Token verification failed
      return res.status(401).json({ success: false, message: verificationResult.message });
    }

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
