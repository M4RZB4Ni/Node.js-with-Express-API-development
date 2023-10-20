const Joi = require('joi');
const { AppError } = require('../utils/appError');

const verifyRegister = async (req, res, next) =>
{
    const { userName: username, userMail: email, password: password } = req.body;

    const schema = Joi.object({
        userName: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required(),

        pass: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9_-]{3,30}$')),

        userEMail: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    });
    await schema.validateAsync({ userName: username, pass: password, userEMail: email }).then((value) =>
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

        pass: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9_-]{3,30}$')),

        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required()
    });
    await schema.validateAsync({ pass: password, email: email }).then((value) =>
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