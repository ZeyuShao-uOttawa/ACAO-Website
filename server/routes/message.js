const express = require('express');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate limit to 5 requests per minute
const limiter1 = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 5,
    message: { success: false, msg: "Too many requests in a minute. Try again later." }
})

// Rate limit to 20 requests per hour
const limiter2 = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 20,
    message: { success: false, msg: "Too many requests in an hour. Try again later." }
})

router.post('/send', limiter1, limiter2, async (req, res) => {
    try {
        const { email, message } = req.body;
        
        // Ensure messages are free of injections
        const safeEmail = escapeHtml(email.trim());
        const safeMessage = escapeHtml(message.trim());
        
        // Setup transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Send mail
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.TO_EMAIL,
            subject: "New Message from " + safeEmail,
            replyTo: safeEmail,
            html: `
                <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
                        <tr>
                            <td style="background: #ff8ba0; color: white; padding: 16px; font-size: 18px; font-weight: bold;">
                                New Contact Form Message
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 20px; color: #333;">
                                <p style="margin: 0 0 12px 0; font-size: 16px;">
                                    <strong>From:</strong> ${safeEmail}
                                </p>
                                <p style="margin: 0 0 12px 0; font-size: 16px;">
                                    <strong>Message:</strong>
                                </p>
                                <div style="background: #f4f4f4; padding: 12px; border-radius: 6px; font-size: 15px; line-height: 1.5; white-space: pre-line;">
                                    ${safeMessage}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td style="background: #f1f1f1; padding: 12px; font-size: 12px; color: #666; text-align: center;">
                                This message was sent from your website’s contact form.
                            </td>
                        </tr>
                    </table>
                </div>
            `
        });

        res.status(200).json({ success: true, msg: "Message sent!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: "Failed to send message" });
    }
});

function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

module.exports = router;