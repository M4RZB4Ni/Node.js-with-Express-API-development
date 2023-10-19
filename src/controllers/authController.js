const { makeGraphQLRequest } = require('../utils/graphqlRequests');
const { hashPassword } = require('../utils/hashHelper');

const registerUser = async (req, res) =>
{
    try
    {
        // Extract username, email, and password from request body
        const { userName, userMail, password } = req.body;

        // Check if required fields are provided
        if (!userName || !userMail || !password)
        {
            return res.status(400).json({ success: false, message: 'Please provide username, email, and password.' });
        }

        // Hash the password
        const hashedPassword = await hashPassword(password);

        // GraphQL mutation to create a new user
        const operationsDoc = `
        mutation InsertUser($userName: String, $password: String, $userMail: String) {
            insert_User(objects: {username: $userName, password: $password, email: $userMail}) {
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
            userName,
            userMail,
            password: hashedPassword // Store the hashed password
        };

        // Make the GraphQL request to create a new user
        const { errors, data } = await makeGraphQLRequest(operationsDoc, 'InsertUser', variables);

        // Extract the user information from the response
        if (errors)
        {
            // Handle errors
            console.error(errors);
            res.status(500).json({ success: false, message: errors });
        }
        if (data.insert_User)
        {
            const returningData = data.insert_User.returning;

            if (returningData && returningData.length > 0)
            {
                const firstUser = returningData[0];
                const email = firstUser.email;
                const password = firstUser.password;
                const username = firstUser.username;
                const user_id = firstUser.user_id;

                res.json({ success: true, user_id, username: username, email: email });

            }
        }

        res.json({ success: true, UserDefined:true });
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
          users(where: { email: { _eq: ${email} } }) {
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
