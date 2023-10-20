const nodemailer = require('nodemailer');
require('dotenv').config();

/*
I've tried to use international services like sendBird but all of them suspended my account du US sanctions
Next I tried to use Iranian web services that services of found needs payments and the dont offer free services
I had to use google that it seems google changed own policies and does not work with this type.
*/

const sendEmailNotification = (email, postId) =>
{

    console.log(`EMAIL SENDER IS->${process.env.MAIL_ADDRESS}`);
    // Create a Nodemailer transporter with your Gmail account
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.MAIL_ADDRESS,
            pass: process.env.MAIL_PASSWORD,
        },
    });

    // Define the email message
    const mailOptions = {
        from: process.env.MAIL_ADDRESS,
        to: email,  // Recipient's email address
        subject: 'Hello from Your Blog Assistant',
        text: `a Post with id of ${postId} has been published with you account!`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) =>
    {
        if (error)
        {
            console.error('Error sending email: ', error);
        } else
        {
            console.log('Email sent: ', info.response);
        }
    });

};

module.exports = {
    sendEmailNotification
};
