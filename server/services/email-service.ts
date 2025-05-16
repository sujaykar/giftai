import { storage } from "../storage";
import nodemailer from "nodemailer";

// Create a test SMTP transporter for development
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email", // For development
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || "ethereal.user@ethereal.email", // Will fall back to ethereal for development
    pass: process.env.EMAIL_PASSWORD || "ethereal_password"
  }
});

// For production, use an actual service like SendGrid, Mailgun, etc.
// const transporter = nodemailer.createTransport({
//   service: "SendGrid",
//   auth: {
//     user: process.env.SENDGRID_USER,
//     pass: process.env.SENDGRID_API_KEY
//   }
// });

/**
 * Send an email notification for new recommendations
 */
export async function sendRecommendationEmail(
  userId: number,
  recipient: any,
  recommendationsCount: number
): Promise<void> {
  // Get user details
  const user = await storage.getUser(userId);
  if (!user) {
    throw new Error("User not found");
  }
  
  const domain = process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost:5000';
  const appUrl = domain.startsWith('http') ? domain : `https://${domain}`;
  
  // Prepare email content
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"GIFT AI" <notifications@gift-ai.com>',
    to: user.email,
    subject: `New gift recommendations for ${recipient.name}`,
    text: `
    Hello ${user.firstName},
    
    We've found ${recommendationsCount} new gift recommendations for ${recipient.name}!
    
    Check them out at: ${appUrl}/recipients/${recipient.id}
    
    The GIFT AI Team
    `,
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #E94F6E;">New Gift Recommendations</h2>
      <p>Hello ${user.firstName},</p>
      <p>We've found <strong>${recommendationsCount} new gift recommendations</strong> for ${recipient.name}!</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${appUrl}/recipients/${recipient.id}" style="background-color: #E94F6E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
          View Recommendations
        </a>
      </div>
      <p>Happy gifting!</p>
      <p>The GIFT AI Team</p>
    </div>
    `
  };
  
  // In development mode, log the email rather than sending it
  if (process.env.NODE_ENV === "development") {
    console.log("Email would be sent:", mailOptions);
    return;
  }
  
  // Send the email
  const info = await transporter.sendMail(mailOptions);
  console.log("Email sent:", info.messageId);
}
