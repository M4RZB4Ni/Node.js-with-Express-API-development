const Joi = require('joi');
const { AppError } = require('../utils/appError');

const verifyRegister = async (req, res, next) =>
{
    const { username: username, userMail: email, password: password } = req.body;

    const schema = Joi.object({
        username: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required(),

        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9_-]{3,30}$')),

        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    });
    await schema.validateAsync({ username: username, password: password, email: email }).then((value) =>
    {
        next();

    }).catch((err) =>
    {
        next(new AppError(err.details[0].message, 400));

    });
};

const verifyLogin = async (req, res, next) =>
{
    const { email: email, password: password } = req.body;

    const schema = Joi.object({

        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9_-]{3,30}$')),

        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required()
    });
    await schema.validateAsync({ password: password, email: email }).then((value) =>
    {
        next();

    }).catch((err) =>
    {
        next(new AppError(err.details[0].message, 400));

    });



};

module.exports = {
    verifyRegister,
    verifyLogin
};