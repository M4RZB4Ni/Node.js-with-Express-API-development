const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmailNotification = (email, postId) =>
{


    // Create a Nodemailer transporter with your Gmail account
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.MAIL_ADDRESS,  // Your Gmail email address
            pass: process.env.MAIL_PASSWORD,        // Your Gmail password or App Password (if using 2-factor authentication)
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
