const { makeGraphQLRequest } = require('../utils/graphqlRequests');

async function createUser(username, email, password)
{
    const operationsDoc = `
      mutation InsertUser($username: String, $password: String, $email: String) {
        insert_User(objects: {username: $username, password: $password, email: $email}) {
          affected_rows
          returning {
            user_id
            username
            password
            email
          }
        }
      }
    `;

    const variables = {
        username,
        email,
        password,
    };

    return await makeGraphQLRequest(operationsDoc, 'InsertUser', variables);
}

async function loginUserQuery(email)
{

    // GraphQL query to fetch the user's hashed password based on the provided email
    const getUserQuery = `
        query GetUser($email: String) {
            User(where: {email: {_eq: $email}}) {
            user_id
            password
            }
        }
      `;

    // Variables for the GraphQL query
    const variables = { email };

    // Make the GraphQL request to fetch the user's hashed password
    return await makeGraphQLRequest(getUserQuery, 'GetUser', variables);
}
module.exports = {
    createUser,
    loginUserQuery
};