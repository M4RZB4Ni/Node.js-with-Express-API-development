
const { json } = require('body-parser');
const { makeGraphQLRequest } = require('../utils/graphqlRequests');

async function createPostService(user_id, title, content)
{
  const createPostMutation = `
    mutation InsertBlogPost($user_id: uuid, $title: String, $content: String) {
        insert_blog_post(objects: {user_id: $user_id, title: $title, content: $content}) {
          affected_rows
          returning {
            post_id
                  user_id
                  title
                  content
                  created_at
                  updated_at
          }
        }
      }      
    `;

  const variables = {
    user_id,
    title,
    content,
  };

  return await makeGraphQLRequest(createPostMutation, 'InsertBlogPost', variables);
}

async function getUserPostsService(user_id)
{
  const getPostsQuery = `
    query GetUserPosts($user_id: uuid) {
        blog_post(where: {user_id: {_eq: $user_id}}) {
          content
          title
          updated_at
          post_id
        }
      }    
    `;

  const variables = {
    user_id,

  };

  return await makeGraphQLRequest(getPostsQuery, 'GetUserPosts', variables);
}


async function updatePostService(post_id, user_id, newTitle, newContent)
{
  const updateQuery = {};


  if (newTitle !== undefined)
  {
    Object.assign(updateQuery, { title: newTitle });
  }

  if (newContent !== undefined)
  {
    Object.assign(updateQuery, { content: newContent });
  }

  // GraphQL mutation to update an existing post
  const editPostMutation = `
      mutation UpdatePost($post_id: uuid!, $user_id: uuid!,$updateQuery: blog_post_set_input) {
        update_blog_post_by_pk(pk_columns: {post_id: $post_id, user_id: $user_id}, _set: $updateQuery) {
            title
            content
            updated_at
          }
      }
    `;
  // Variables for the GraphQL mutation
  const variables = {
    post_id,
    user_id,
    updateQuery
  };

  // Make the GraphQL request to edit the post
  return await makeGraphQLRequest(editPostMutation, 'UpdatePost', variables);
}


async function deletePostByIdService(post_id, user_id)
{
  // GraphQL mutation to delete an existing post
  const deletePostMutation = `
        mutation DeletePost($post_id: uuid!, $user_id: uuid!) {
          delete_blog_post_by_pk(post_id: $post_id, user_id: $user_id) {
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
  return await makeGraphQLRequest(deletePostMutation, 'DeletePost', variables);
}
module.exports = {
  createPostService,
  getUserPostsService,
  updatePostService,
  deletePostByIdService
};