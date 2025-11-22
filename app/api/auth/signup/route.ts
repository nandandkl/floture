export const runtime = "nodejs";

import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    const hashedPassword = await bcrypt.hash(password, 10);

    const client = await clientPromise;
    const db = client.db("flotureDB");

    // Check if email exists
    const existing = await db.collection("users").findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    // Generate token
    const token = uuidv4();

    // Save user (unverified)
    await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      verified: false,
      verificationToken: token,
      createdAt: new Date(),
    });

    // Send email
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify?token=${token}`;

    await transporter.sendMail({
      from: `"Floture" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "You're Almost There! 🚀",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Confirm your account</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
                <tr>
                    <td align="center">
                        <!-- Main Container -->
                        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #E8ECDE; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow: hidden;">
                            
                            <!-- Logo Section -->
                            <tr>
                                <td style="padding: 48px 48px 32px 48px;">
                                    <table width="100%" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td align="left">
                                                <div style="width: 56px; height: 56px; display: inline-flex; align-items: center; justify-content: center;">
                                                    <img src="${process.env.NEXT_PUBLIC_BASE_URL}/logo.png" alt="Floture" style="width: 56px; height: 56px;" />
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>

                            <!-- Title Section -->
                            <tr>
                                <td style="padding: 0 48px 24px 48px;">
                                    <h1 style="margin: 0; font-size: 32px; font-weight: 700; color: #000000; line-height: 1.2;">
                                        Verify your account!
                                    </h1>
                                </td>
                            </tr>

                            <!-- Divider -->
                            <tr>
                                <td style="padding: 0 48px;">
                                    <div style="height: 1px; background-color: #3a4c40;"></div>
                                </td>
                            </tr>

                            <!-- Content Section -->
                            <tr>
                                <td style="padding: 32px 48px;">
                                    <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
                                        Hi <b>${name}</b>,
                                    </p>
                                    <p style="margin: 24px 0 0 0; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
                                        Confirm your email with the button below so we know it's really you. After this, your account will be fully activated and ready to use.
                                    </p>
                                </td>
                            </tr>

                            <!-- Button Section -->
                            <tr>
                                <td style="padding: 0 48px 32px 48px;">
                                    <table cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td align="left">
                                                <a href="${verifyUrl}" 
                                                  style="display: inline-block; padding: 14px 32px; background-color: #3A6600; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                                                    Verify
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>

                            <!-- Divider -->
                            <tr>
                                <td style="padding: 0 48px;">
                                    <div style="height: 1px; background-color: #3a4c40;"></div>
                                </td>
                            </tr>

                            <!-- Footer Section -->
                            <tr>
                                <td style="padding: 32px 48px 48px 48px;">
                                    <table width="100%" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td style="padding-bottom: 16px;">
                                                <p style="margin: 0; font-size: 14px; color: #666666;">
                                                    If the button doesn't work, copy and paste this link into your browser:
                                                </p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <a href="${verifyUrl}" style="color: #2563eb; font-size: 14px; word-break: break-all; text-decoration: none;">
                                                    ${verifyUrl}
                                                </a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding-top: 32px;">
                                                <p style="margin: 0; font-size: 13px; color: #999999;">
                                                    <b>floture</b> · AI-powered flower identification
                                                </p>
                                            </td>
                                        </tr>
                                    </table>
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
