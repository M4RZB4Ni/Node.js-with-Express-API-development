const { hashPassword, comparePassword } = require('../utils/hashHelper');
const { createUser, loginUserQuery } = require('../services/userService');
const { generateToken } = require('../middleware/authentication');
const { handleGraphQLErrors } = require('../middleware/responseHandler'); // Import from the response handler file

const { AppError } = require('../utils/appError');
const { handleServiceResponse } = require('../middleware/responseHandler');
const registerUser = async (req, res, next) =>
{
    try
    {
        const { username, email, password } = req.body;

        if (!username || !email || !password)
        {
            return next(new AppError('Please provide username, email, and password.', 400));
        }

        const hashedPassword = await hashPassword(password);
        const userCreationResult = await createUser(username, email, hashedPassword);

        if (userCreationResult.errors)
        {
            return handleGraphQLErrors(userCreationResult.errors, next);
        }

        const user = userCreationResult.data.insert_User.returning[0];
        const userResponse = {
            user_id: user.user_id,
            username: user.username,
            email: user.email,
            success: true,
        };
        // Inside the controller functions
        return handleServiceResponse(res, userResponse);

        // return res.status(200).json(userResponse);
    } catch (error)
    {
        console.error('Error registering user:', error);
        next(new AppError(`Error registering user. ${error}`, 500));
    }
};

const loginUser = async (req, res, next) =>
{
    try
    {
        const { email, password } = req.body;

        if (!email || !password)
        {
            return next(new AppError('Please provide email and password.', 400));
        }

        const userLoginRespose = await loginUserQuery(email);

        if (userLoginRespose.errors)
        {
            return handleGraphQLErrors(userLoginRespose.errors, next);
        }

        const user = userLoginRespose.data.User[0];
        if (!user)
        {
            return next(new AppError('Invalid email or password.', 401));
        }

        const passwordMatch = await comparePassword(password, user.password);

        if (passwordMatch)
        {
            const token = generateToken(user.user_id, email);
            return handleServiceResponse(res, token);
        } else
        {
            return next(new AppError('Invalid email or password.', 401));
        }
    } catch (error)
    {
        console.error('Error logging in:', error);
        next(new AppError('Error logging in.', 500));
    }
};


module.exports = {
    registerUser,
    loginUser,
};
