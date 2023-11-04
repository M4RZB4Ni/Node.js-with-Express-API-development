const axios = require('axios');
const { AppError } = require('../utils/appError');


const makeGraphQLRequest = async (query, operationName, variables) =>
{
    try
    {

        const response = await axios.post(process.env.HASURA_URL, {
            query,
            operationName,
            variables
        },
            {
                headers: {
                    'x-hasura-admin-secret': process.env.HASURA_SECRET
                }
            });
        return response.data;
    } catch (error)
    {
        throw new AppError('Error making GraphQL request', 500);

    }
};

module.exports = {
    makeGraphQLRequest
};
