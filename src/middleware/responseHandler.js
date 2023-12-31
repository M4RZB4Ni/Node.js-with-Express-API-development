const { AppError } = require('../utils/appError');

// Error handling middleware function
const errorHandler = (err, req, res, next) =>
{
    // Check if the error is a known application error with a status code
    if (err.statusCode)
    {
        return res.status(err.statusCode).json({ error: err.message });
    }

    // For unexpected errors, log the error and return a 500 Internal Server Error response
    res.status(500).json({ error: 'Internal Server Error' });
};

const handleServiceResponse = (res, serviceResult, successStatus = 200) =>
{
    if (serviceResult.errors)
    {
        // Handle GraphQL errors
        throw new AppError(serviceResult.errors[0].message, 500);
    }

    // if (serviceResult.data)
    // {
    if (res)
    {
        return res.status(successStatus).json({
            status: 'success',
            response: serviceResult,
        });
    }
    return serviceResult.data;
    // }

    throw new AppError('Operation failed.', 500);
};
const handleGraphQLErrors = (errors, next) =>
{
    return next(new AppError(errors[0].message, 500));
};


module.exports = {
    errorHandler,
    handleServiceResponse,
    handleGraphQLErrors
};