
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // Validate email
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    // Connect to DB
    const client = await clientPromise;
    const db = client.db("flotureDB");

    // Check if user exists
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      // Avoid revealing whether email exists
      return NextResponse.json({
        message: "If an account exists, you will receive a reset email",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // Save token to DB
    await db.collection("users").updateOne(
      { email },
      {
        $set: {
          resetPasswordToken: hashedToken,
          resetPasswordExpiry: resetTokenExpiry,
        },
      }
    );

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password?token=${resetToken}`;

    // Nodemailer transporter (same as signin route)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send reset email
    await transporter.sendMail({
      from: `"Floture" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset your password - Floture",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset your password</title>
        </head>
        <body style="margin:0; padding:0; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color:#f5f5f5;">
          <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px; background-color:#f5f5f5;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color:#E8ECDE; border-radius:12px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                  <tr>
                    <td style="padding:48px;">
                      <h1 style="font-size:28px; color:#000; margin-bottom:24px;">Reset Your Password</h1>
                      <p style="font-size:16px; color:#1a1a1a;">Hi <b>${user.name || "User"}</b>,</p>
                      <p style="font-size:16px; color:#1a1a1a; margin-top:12px;">
                        We received a request to reset your password. Click the button below to create a new password. This link is valid for 1 hour.
                      </p>
                      <a href="${resetUrl}" style="display:inline-block; margin-top:24px; padding:14px 32px; background-color:#3A6600; color:#fff; text-decoration:none; border-radius:8px; font-weight:600;">
                        Reset Password
                      </a>
                      <p style="font-size:14px; color:#666; margin-top:24px;">
                        If the button doesn't work, copy and paste this link into your browser: <br/>
                        <a href="${resetUrl}" style="color:#2563eb; word-break:break-all;">${resetUrl}</a>
                      </p>
                      <p style="font-size:13px; color:#999; margin-top:24px;">Floture · AI-powered flower identification</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    return NextResponse.json({ message: "Password reset email sent successfully" });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}

