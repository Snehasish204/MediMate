const nodemailer = require("nodemailer");

// Create a transporter object
const transporter = nodemailer.createTransport({
  service: "gmail", // or use another SMTP service
  secure: true,
  port : 465,
  auth: {
    user: "tiyasavsnpatra2006@gmail.com", // Replace with your email
    pass: "ikcmmoscsjauwseu", // Use an App Password if using Gmail
  },
});

// Function to send email
const sendEmail = async (to, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: '"MediMate" <tiyasavsnpatra2006@gmail.com>',
      to,
      subject,
      text,
    });
    console.log("Email sent: ", info.messageId);
  } catch (error) {
    console.error("Error sending email: ", error);
  }
};

module.exports = sendEmail;
