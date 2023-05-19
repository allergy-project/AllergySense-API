// If Want to Send Email
const nodemailer = require("nodemailer");

const sendEmail = async (target, subject, message) => {
  // Create Transporter
  const Transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.APP_PASSWORD_EMAIL,
    },
  });

  // Create Options
  const options = {
    from: `AllergySense<${process.env.EMAIL}>`,
    to: target,
    subject: subject,
    html: message,
  };

  try {
    await Transporter.sendMail(options);
    console.log("Email Send Success!")
    return true;
  } catch (error) {
    console.log("error: "+error.message);
    throw new Error("Failed To Send Email!");
  }
};

module.exports = sendEmail;