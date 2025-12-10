import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendOtpEmail = async (email, otp) => {
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
    <h2>Password Reset Request</h2>
    <p>Your OTP for resetting your password is:</p>

    <h1 style="font-size:32px; color:#d32f2f; letter-spacing:4px;">
      ${otp}
    </h1>

    <p>This OTP is valid for <strong>10 minutes</strong>.</p>

    <p>If you did not request a password reset, please ignore this email.</p>
  `;

  await transporter.sendMail({
    from: `"Event System" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset Password OTP",
    html,
  });
};
