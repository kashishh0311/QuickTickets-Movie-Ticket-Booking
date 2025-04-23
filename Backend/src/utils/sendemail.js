import nodemailer from "nodemailer";
const sendEmail = async ({ email, subject, message }) => {
  if (!email) {
    console.error("❌ Error: No recipient email provided!");
    throw new Error("Recipient email is missing.");
  }

  console.log("📩 Sending email to:", email);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    text: message,
  };

  await transporter.sendMail(mailOptions);
  console.log("✅ Email sent successfully!");
};

export default sendEmail;
