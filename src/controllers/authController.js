
const axios = require('axios');
const { makeGraphQLRequest } = require('../utils/graphqlRequests');
const { hashPassword } = require('../utils/hashHelper');

const registerUser = async (req, res) =>
{
    try
    {
        // Extract username, email, and password from request body
        const { username, email, password } = req.body;

        // Check if required fields are provided
        if (!username || !email || !password)
        {
            return res.status(400).json({ success: false, message: 'Please provide username, email, and password.' });
        }

        // Hash the password (you should use a secure hashing algorithm)
        const hashedPassword = await hashPassword(password);

        // GraphQL mutation to create a new user
        const createUserMutation = `
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

        // Variables for the GraphQL mutation
        const variables = {
            username,
            email,
            password: hashedPassword // Store the hashed password
        };

        // Make the GraphQL request to create a new user
        const response = await makeGraphQLRequest(createUserMutation, variables);

        // Extract the user information from the response
        const { user_id, username: responseUsername, email: responseEmail } = response.data.insert_users_one;

        res.json({ success: true, user_id, username: responseUsername, email: responseEmail });
    } catch (error)
    {
        console.error('Error registering user:', error);
        res.status(500).json({ success: false, message: 'Error registering user.' });
    }
};


const loginUser = async (req, res) =>
{
    try
    {
        // Extract email and password from request body
        const { email, password } = req.body;

        // Check if required fields are provided
        if (!email || !password)
        {
            return res.status(400).json({ success: false, message: 'Please provide email and password.' });
        }

        // GraphQL query to fetch the user's hashed password based on the provided email
        const getUserQuery = `
        query GetUser($email: String!) {
          users(where: { email: { _eq: $email } }) {
            user_id
            password
          }
        }
      `;

        // Variables for the GraphQL query
        const variables = { email };

        // Make the GraphQL request to fetch the user's hashed password
        const response = await makeGraphQLRequest(getUserQuery, variables);

        // Extract the user information from the response
        const user = response.data.users[0];

        if (!user)
        {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        // Compare the provided password with the stored hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch)
        {
            // Passwords match, generate a JWT token (you need to implement this function)
            const token = generateToken(user.user_id); // Assuming you have a function to generate JWT tokens

            res.json({ success: true, token });
        } else
        {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }
    } catch (error)
    {
        console.error('Error logging in:', error);
        res.status(500).json({ success: false, message: 'Error logging in.' });
    }
};

module.exports = {
    registerUser,
    loginUser
};
