// A simple fallback email implementation using nodemailer
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // If we don't have authentic SMTP credentials, fallback to test console log
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn('=============================================');
        console.warn('⚠️ SMTP CREDENTIALS NOT PROVIDED IN .env ⚠️');
        console.warn('Simulating outgoing email to:', options.email);
        console.warn('Subject:', options.subject);
        console.warn('Message Body:\n', options.message);
        console.warn('=============================================');
        return true; // Simulate success
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    const message = {
        from: `${process.env.FROM_NAME || 'DWMS Platform'} <${process.env.FROM_EMAIL || 'noreply@dwms.com'}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    const info = await transporter.sendMail(message);
    console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
