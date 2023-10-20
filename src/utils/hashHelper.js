const bcrypt = require('bcrypt');

const hashPassword = async (password) =>
{
    try
    {
        const saltRounds = 10; // Salt rounds for bcrypt (10-12 recommended)
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error)
    {
        throw new Error('Error hashing password');
    }
};

const comparePassword = async (password, userPassword) =>
{
    return await bcrypt.compare(password, userPassword);
};


module.exports = {
    hashPassword,
    comparePassword
};
