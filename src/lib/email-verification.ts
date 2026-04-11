import crypto from "crypto";
import nodemailer from "nodemailer";

const DEFAULT_TOKEN_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

export function isEmailVerificationConfigured() {
  return (
    !!process.env.SMTP_HOST &&
    !!process.env.SMTP_USER &&
    !!process.env.SMTP_PASS
  );
}

export function createEmailVerificationToken(ttlMs = DEFAULT_TOKEN_TTL_MS) {
  const plainToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto
    .createHash("sha256")
    .update(plainToken)
    .digest("hex");

  return {
    plainToken,
    tokenHash,
    expiresAt: new Date(Date.now() + ttlMs),
  };
}

export function hashEmailVerificationToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function getBaseUrl() {
  const url = process.env.AUTH_URL || process.env.NEXTAUTH_URL;
  if (!url) {
    if (process.env.NODE_ENV === "production") {
      console.error(
        "[email-verification] AUTH_URL / NEXTAUTH_URL is not set in production. " +
          "Verification links will point to localhost and will not work for users. " +
          "Set AUTH_URL in your environment variables."
      );
    }
    return "http://localhost:3000";
  }
  return url;
}

function buildVerificationUrl(email: string, plainToken: string) {
  const url = new URL("/auth/verify-email", getBaseUrl());
  url.searchParams.set("email", email);
  url.searchParams.set("token", plainToken);
  return url.toString();
}

export async function sendVerificationEmail(params: {
  to: string;
  name?: string;
  plainToken: string;
}) {
  const { to, name, plainToken } = params;
  const verificationUrl = buildVerificationUrl(to, plainToken);

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || "NUSlat <no-reply@nuslat.local>";

  if (!isEmailVerificationConfigured() || !host || !user || !pass) {
    console.warn(
      "SMTP not configured. Verification email not sent. Use this URL manually:",
      verificationUrl
    );
    return { sent: false, verificationUrl };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });

  const appName = "NUSlat";
  const safeName = (name || "there").trim();
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1D1D1F; line-height: 1.6;">
      <h2 style="margin-bottom: 8px;">Verify your email</h2>
      <p>Hi ${safeName},</p>
      <p>Welcome to ${appName}. Please confirm your email address to activate your account.</p>
      <p style="margin: 24px 0;">
        <a href="${verificationUrl}" style="background:#1D1D1F;color:#fff;text-decoration:none;padding:12px 18px;border-radius:12px;display:inline-block;font-weight:600;">Verify Email</a>
      </p>
      <p>If the button does not work, copy and paste this link:</p>
      <p style="word-break: break-all; color: #555;">${verificationUrl}</p>
      <p>This link expires in 24 hours.</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from,
      to,
      subject: "Verify your NUSlat account",
      html,
      text: `Verify your email: ${verificationUrl}`,
    });

    return { sent: true, verificationUrl };
  } catch (error) {
    console.error("Failed to send verification email:", error);
    return { sent: false, verificationUrl };
  }
}
