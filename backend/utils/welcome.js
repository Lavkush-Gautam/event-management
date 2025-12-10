import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendUserWelcomeEmail = async (email, name) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const html = `
  <div style="font-family: Arial; padding: 20px;">
    <h2>Welcome ${name} </h2>

    <p>Thank you for registering on the <strong>College Event Management System</strong>.</p>

    <p>You can now explore, register for events, view tickets, and more!</p>

    <br />
    <p>We're excited to have you on board.</p>

    <br /><br />

    <p>If you didn’t create this account, please ignore this email.</p>

    <p>Regards,<br/>College Event Management Team</p>
  </div>
  `;

  await transporter.sendMail({
    from: `"Event System" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Welcome to the Event Management System ",
    html,
  });
};
