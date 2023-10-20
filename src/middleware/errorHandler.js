// Error handling middleware function
const errorHandler = (err, req, res, next) =>
{
    // Check if the error is a known application error with a status code
    if (err.statusCode)
    {
        return res.status(err.statusCode).json({ error: err.message });
    }

    // For unexpected errors, log the error and return a 500 Internal Server Error response
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
};

module.exports = {
    errorHandler
};