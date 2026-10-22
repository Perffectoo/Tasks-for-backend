import { EventEmitter } from "events";
import { sendEmail } from "../email/nodemailer.emai.js";
import { emailSubect } from "../enums/email.enum.js";
import { template } from "../email/generateHTML.js";

export const emailEvent = new EventEmitter();

emailEvent.on("confirmEmail", async (data) => {
  await sendEmail({
    to: data.to,
    subject: emailSubect.confirmEmail,
    html: template(data.otp, data.firstName, emailSubect.confirmEmail),
  }).catch((err) => {
    console.log("Error sending email:", err);
  });
});


emailEvent.on("forgetPassword", async (data) => {
  await sendEmail({
    to: data.to,
    subject: emailSubect.resetPassword,
    html: template(data.otp, data.firstName, emailSubect.resetPassword),
  }).catch((err) => {
    console.log("Error sending forget password email:", err);
  });
});
