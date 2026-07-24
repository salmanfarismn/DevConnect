const nodemailer = require("nodemailer");
const crypto = require("crypto");

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
 

function generateOtp() {
    return crypto.randomInt(100000, 999999);
}

async function sendMail(email, otp) {
    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: "Verify Your Email Address – OTP Code",
            text: `
                Hello,

                Thank you for signing up with DevHire. To complete your email verification, please use the One‑Time Password (OTP) below:

                Your OTP Code: ${otp}

                This code will expire in 5 minutes. Please enter it in the verification page to activate your account.

                If you did not request this verification, please ignore this email.

                Best regards,
                DevHire Team
            `,
        });

        console.log("Message sent: %s", info.messageId);
        // Preview URL is only available when using an Ethereal test account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (err) {
        console.error("Error while sending mail:", err);
    }
}

module.exports = {generateOtp, sendMail};