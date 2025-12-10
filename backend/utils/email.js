import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendRegistrationEmail = async (email, name, event, qrCode) => {
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
    <h2>Hello ${name},</h2>
    <p>You have successfully registered for:</p>
    <h3>${event.title}</h3>
    <p><strong>Date:</strong> ${new Date(event.date).toDateString()}</p>
    <p><strong>Venue:</strong> ${event.venue}</p>

    <p>Your QR Code (show at event entry):</p>
    <img src="cid:qrImage" width="220" style="border:1px solid #ddd; padding:5px; border-radius:8px;" />

    <br /><br />
    <p>Thank you,<br/>College Event Management Team</p>
  `;

  await transporter.sendMail({
    from: `"Event System" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Event Registration Confirmation",
    html,
    attachments: [
      {
        filename: "qrcode.png",
        content: qrCode.split("base64,")[1], // extract pure base64
        encoding: "base64",
        cid: "qrImage", // must match <img src="cid:qrImage">
      },
    ],
  });
};

