import nodemailer from "nodemailer";
import { USER_EMAIL, USER_PASSWORD } from "../../../Config/config.service.js";

export async function sendEmail({
  to = "",
  subject = "",
  text = "",
  html = "",
  cc = "",
  bcc = "",
  attachments = [],
}) {
  // Create a transporter using SMTP
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: USER_EMAIL,
      pass: USER_PASSWORD,
    },
  });

  try {
    // Send the email
    const info = await transporter.sendMail({
      from: USER_EMAIL,
      to,
      subject,
      text,
      html,
      cc,
      bcc,
      attachments,
    });
    console.log("Email sent: " + info.messageId + " to " + to);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
