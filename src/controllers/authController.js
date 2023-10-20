const { hashPassword, comparePassword } = require('../utils/hashHelper');
const { createUser, loginUserQuery } = require('../services/userService');
const { generateToken } = require('../middleware/authentication');

const registerUser = async (req, res) =>
{
    try
    {
        const { userName: username, userMail: email, password } = req.body;

        if (!username || !email || !password)
        {
            return res.status(400).json({ success: false, message: 'Please provide username, email, and password.' });
        }

        const hashedPassword = await hashPassword(password);

        const userCreationResult = await createUser(username, email, hashedPassword);

        if (userCreationResult.errors)
        {
            // Handle GraphQL errors
            console.error('GraphQL errors:', userCreationResult.error);
            return res.status(500).json({ success: false, message: userCreationResult.errors });
        }

        if (userCreationResult.data)
        {
            const user = userCreationResult.data.insert_User.returning[0];
            const userResponse = {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                success: true,
            };
            return res.json(userResponse);
        }

        return res.json({ success: false, UserDefined: true });
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

        const userLoginRespose = await loginUserQuery(email);

        if (userLoginRespose.errors)
        {
            // Handle GraphQL errors
            console.error('GraphQL errors:', userLoginRespose.error);
            return res.status(500).json({ success: false, message: userLoginRespose.errors });
        }

        if (userLoginRespose.data)
        {
            const userStoredPass = userLoginRespose.data.User[0].password;

            console.log('GraphQL user:', userStoredPass);


            const passwordMatch = await comparePassword(password, userStoredPass);

            if (passwordMatch)
            {
                // Passwords match, generate a JWT token (you need to implement this function)
                console.log('');
                const token = generateToken(userLoginRespose.data.User[0].user_id, email); // Assuming you have a function to generate JWT tokens

                return res.json({ success: true, token });
            } else
            {
                return res.status(401).json({ success: false, message: 'Invalid email or password.' });
            }

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
