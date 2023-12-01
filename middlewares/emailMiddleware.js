require('dotenv').config();
const nodemailer = require('nodemailer');

// Create reusable transporter object using environment variables

const transporter = nodemailer.createTransport({
  service: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',  // convert string to boolean
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});


const sendMail = (email, callback) => {
  try {
    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_ADDRESS}>`,
      to: email.to,
      subject: email.subject,
      text: email.text,
      html: email.html,
      attachments: email.attachments,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
        return callback(error);
      }
      console.log("Email sent:", info.messageId);
      return callback(null, info);
    });
  } catch (error) {
    return callback(error);
  }
};


module.exports = sendMail;
