const axios = require('axios');


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
        console.log(response);
        return response.data;
    } catch (error)
    {
        console.error('Error making GraphQL request:', error);
        throw new Error('Error making GraphQL request');
    }
};

module.exports = {
    makeGraphQLRequest
};
