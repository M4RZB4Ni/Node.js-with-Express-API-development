
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
        }
      }    
    `;

    const variables = {
        user_id,

    };

    return await makeGraphQLRequest(getPostsQuery, 'GetUserPosts', variables);
}

module.exports = {
    createPostService,
    getUserPostsService
};