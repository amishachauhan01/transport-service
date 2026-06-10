const transporter = require("../config/mailer");

const sendMail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });

    console.log("📩 EMAIL SENT SUCCESS:");
    console.log("Message ID:", info.messageId);
    console.log("Response:", info.response);

    return info;

  } catch (error) {
    console.log("❌ EMAIL ERROR:");
    console.log(error.message);

    throw error; // important for debugging
  }
};

module.exports = sendMail;