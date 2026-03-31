import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "mailhog",
  port: Number(process.env.SMTP_PORT) || 1025,
  secure: false, // MailHog doesn’t use TLS
})

transporter
  .verify()
  .then(() => console.log("SMTP connection successful"))
  .catch((err: any) => console.error("SMTP connection error", err))

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string
  subject: string
  html: string
  text: string
}) {
  const info = await transporter.sendMail({
    from: "no-reply@dhuen.com", // any sender you like
    to,
    subject,
    text,
    html,
  })

  console.log("Message sent:", info?.messageId)
}

/*
import { ServerClient } from "postmark"

const postmarkClient = new ServerClient(process.env.POSTMARK_SERVER_TOKEN!)

export function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string
  subject: string
  html: string
  text: string
}) {
  return postmarkClient.sendEmail({
    From: process.env.POSTMARK_FROM_EMAIL!,
    To: to,
    Subject: subject,
    HtmlBody: html,
    TextBody: text,
  })
}
*/
