
const { makeGraphQLRequest } = require('../utils/graphqlRequests');


async function createPostService(user_id, title, content)
{
    console.log(`the userId--> ${user_id}`);
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

module.exports = {
    createPostService
};