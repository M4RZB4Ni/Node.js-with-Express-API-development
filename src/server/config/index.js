const bunyan = require('bunyan');

const loggers = {
    development: () => bunyan.createLogger({ name: 'development', level: 'debug' }),
    production: () => bunyan.createLogger({ name: 'production', level: 'info' }),
    test: () => bunyan.createLogger({ name: 'test', level: 'fatal' }),
};

module.exports = {
    development: {
        log: loggers.development
    },
    production: {
        log: loggers.production
    },
    test: {
        log: loggers.test
    }

};