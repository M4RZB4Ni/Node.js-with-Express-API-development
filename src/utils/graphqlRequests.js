const axios = require('axios');

const makeGraphQLRequest = async (query, variables = {}) =>
{
    try
    {
        const response = await axios.post('https://moving-collie-31.hasura.app/v1/graphql', {
            query,
            variables
        });

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
