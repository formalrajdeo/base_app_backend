import { sendEmail } from "./send-email.js"

interface EmailConfirmationData {
  user: {
    name: string
    email: string
  }
  newEmail: string
  url: string
}

export async function sendEmailConfirmationEmail({ user, url, newEmail }: EmailConfirmationData) {
  await sendEmail({
    to: user.email,
    subject: "Confirm Your Email Change Request",
    html: `
     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Confirm Your Email Change</h2>
        <p>Hello ${user.name},</p>
        <p>We received a request to change the email associated with your account.</p>
        <p><strong>Current Email:</strong> ${user.email}<br/>
           <strong>New Email:</strong> ${newEmail}</p>
        <p>To confirm this change, please click the button below:</p>
        <a href="${url}" style="background-color: #28a745; color: white; padding: 12px 24px; 
           text-decoration: none; border-radius: 4px; display: inline-block; margin: 16px 0;">
           Confirm Email Change
        </a>
        <p>If you did not request this change, please ignore this email. Your current email (${user.email}) will remain active.</p>
        <p>This link will expire in 24 hours.</p>
        <p>Best regards,<br>Your App Team</p>
      </div>
    `,
    text: `Hello ${user.name},\n\nWe received a request to change the email address associated with your account to this email (${user.email}).\n\nTo confirm this change, please click this link: ${url}\n\nIf you did NOT request this change, you can safely ignore this email.\n\nThis confirmation link will expire in 24 hours.\n\nBest regards,\nYour App Team`,
  })
}
