const config = require('../server/config/index.js')[process.env.NODE_ENV];
const log = config.log();

class AppError extends Error
{

    constructor (message, statusCode)
    {
        log.fatal(message);
        super(message);
        this.statusCode = statusCode;
    }
}

module.exports = {
    AppError
};
