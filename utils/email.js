const nodemailer = require("nodemailer");

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});


async function sendEmail(to, subject, text) {
  try {
    const info = await transporter.sendMail({
      from: '${SMTP_USER}',
      to: to,
      subject: subject,
      text: text,
      html: `<b>${text}</b>`,
    });

    console.log("Message sent:", info.messageId);

    // Ethereal test account ke liye preview URL
    console.log(
      "Preview URL:",
      nodemailer.getTestMessageUrl(info)
    );

    return info;

  } catch (err) {
    console.error("Error while sending mail:", err);
  }
}

module.exports = sendEmail;