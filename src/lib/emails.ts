import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";
import { env } from "@/env";

const prodTransport = nodemailer.createTransport({
  host: "smtp.mandrillapp.com",
  port: 587,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASSWORD,
  },
});

const devTransport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASSWORD,
  },
});

const transporter =
  env.NODE_ENV === "production" ? prodTransport : devTransport;

type SendMailOptions = {
  to: string;
  subject: string;
  html: string;
};

export function renderTemplate(
  templateName: string,
  variables: Record<string, string>,
) {
  const folderPath = path.join(process.cwd(), "src", "mailer", "templates");
  if (!fs.existsSync(folderPath)) {
    throw new Error(`Templates folder not found at path: ${folderPath}`);
  }

  // Path ke file HTML template
  const filePath = path.join(folderPath, `${templateName}.html`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Template file not found: ${filePath}`);
  }

  // Baca file HTML
  let html = fs.readFileSync(filePath, "utf-8");

  Object.keys(variables).forEach((key) => {
    const re = new RegExp(`{{\\s*${key}\\s*}}`, "g");
    html = html.replace(re, variables[key] || "");
  });

  return html;
}

export async function sendEmail({ to, subject, html }: SendMailOptions) {
  try {
    const result = await transporter.sendMail({
      from: env.SUPPORT_EMAIL,
      to,
      subject,
      html,
    });
    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

export async function sendForgotPasswordEmail({
  to,
  data,
  url,
}: {
  to: string;
  data?: Record<string, string>;
  url: string;
}) {
  const html = renderTemplate("resetPassword", {
    ...data,
    url,
  });
  await sendEmail({ to, subject: "Reset Password", html });
}
