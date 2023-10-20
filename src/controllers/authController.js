const { hashPassword, comparePassword } = require('../utils/hashHelper');
const { createUser, loginUserQuery } = require('../services/userService');
const { generateToken } = require('../middleware/authentication');
const { AppError } = require('../utils/appError');

const registerUser = async (req, res) =>
{
    try
    {
        const { userName: username, userMail: email, password } = req.body;

        if (!username || !email || !password)
        {
            next(new AppError('Please provide username, email, and password.', 500));

            // return res.status(400).json({ success: false, message: 'Please provide username, email, and password.' });
        }

        const hashedPassword = await hashPassword(password);

        const userCreationResult = await createUser(username, email, hashedPassword);

        if (userCreationResult.errors)
        {
            // Handle GraphQL errors
            console.error('GraphQL errors:', userCreationResult.error);
            next(new AppError(userCreationResult.errors, 500));
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
        next(new AppError('Error registering user.', 500));

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
            next(new AppError('Please provide email and password.', 400));

        }

        const userLoginRespose = await loginUserQuery(email);

        if (userLoginRespose.errors)
        {
            // Handle GraphQL errors
            console.error('GraphQL errors:', userLoginRespose.error);
            next(new AppError(userLoginRespose.errors, 500));


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
                next(new AppError('Invalid email or password.', 401));

            }

        }

    } catch (error)
    {
        console.error('Error logging in:', error);
        next(new AppError('Error logging in.', 500));
    }
};

module.exports = {
    registerUser,
    loginUser
};
