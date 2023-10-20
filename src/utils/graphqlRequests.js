const axios = require('axios');
const makeGraphQLRequest = async (query, operationName, variables) =>
{
    try
    {

        const response = await axios.post('https://moving-collie-31.hasura.app/v1/graphql', {
            query,
            operationName,
            variables
        },
            {
                headers: {
                    'x-hasura-admin-secret': `Vahfc1kHrNTfqlci0NRLFShisZ32PhPyPCp9n4sPBKqVL1ycMV1ogyBANLTWSglA`
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
