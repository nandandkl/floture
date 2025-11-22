import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Floture Newsletter" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "You're Subscribed! 🌸",
      html: `



        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Welcome to the Floture Newsletter</title>
        </head>
        <body style="margin:0; padding:0; background-color:#f5f5f5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">

            <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px; background-color:#f5f5f5;">
                <tr>
                    <td align="center">

                        <!-- Main Container -->
                        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#E8ECDE; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.05); overflow:hidden;">

                            <!-- Logo -->
                            <tr>
                                <td style="padding:48px 48px 32px 48px;">
                                    <img src="${process.env.NEXT_PUBLIC_BASE_URL}/logo.png"
                                        alt="Floture"
                                        style="width:56px; height:56px;" />
                                </td>
                            </tr>

                            <!-- Title -->
                            <tr>
                                <td style="padding:0 48px 24px 48px;">
                                    <h1 style="margin:0; font-size:28px; font-weight:700; color:#000;">
                                        Welcome to the Floture Newsletter!
                                    </h1>
                                </td>
                            </tr>

                            <!-- Divider -->
                            <tr>
                                <td style="padding:0 48px;">
                                    <div style="height:1px; background-color:#3a4c40;"></div>
                                </td>
                            </tr>

                            <!-- Body -->
                            <tr>
                                <td style="padding:32px 48px;">
                                    
                                    <p style="margin:0; font-size:16px; line-height:1.6; color:#1a1a1a;">
                                        Thank you for subscribing! You're officially part of the Floture community — where technology meets nature. 🌿
                                    </p>

                                    <p style="margin:20px 0 0 0; font-size:16px; line-height:1.6; color:#1a1a1a;">
                                        As a subscriber, you'll receive:
                                    </p>

                                    <ul style="margin:20px 0 0 20px; padding:0; color:#1a1a1a; font-size:14px; line-height:1.7;">
                                        <li>New features for AI-based flower recognition</li>
                                        <li>Early previews of upcoming tools & updates</li>
                                        <li>Tips and insights on flora & nature</li>
                                        <li>Special announcements and community projects</li>
                                    </ul>

                                    <p style="margin:24px 0 0 0; font-size:16px; line-height:1.6; color:#1a1a1a;">
                                        We're thrilled to have you with us. Your inbox will now bloom with updates! 🌼
                                    </p>
                                </td>
                            </tr>

                            <!-- Button -->
                            <tr>
                                <td style="padding:0 48px 32px 48px;">
                                    <a href="${process.env.NEXT_PUBLIC_BASE_URL}"
                                    style="display:inline-block; padding:14px 32px; background-color:#3A6600; color:#fff; text-decoration:none; border-radius:8px; font-size:16px; font-weight:600;">
                                        Explore Floture
                                    </a>
                                </td>
                            </tr>

                            <!-- Divider -->
                            <tr>
                                <td style="padding:0 48px;">
                                    <div style="height:1px; background-color:#3a4c40;"></div>
                                </td>
                            </tr>

                            <!-- Footer -->
                            <tr>
                                <td style="padding:32px 48px 48px 48px;">
                                    <p style="margin:0; font-size:14px; color:#666;">
                                        You received this email because you subscribed to the Floture Newsletter.
                                    </p>

                                    <p style="margin:12px 0 0 0; font-size:14px; color:#666;">
                                        If this wasn't you, feel free to ignore this message.
                                    </p>

                                    <p style="margin:24px 0 0 0; font-size:13px; color:#999;">
                                        <b>Floture</b> · AI-powered flower identification
                                    </p>
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
    return NextResponse.json(
      { error: "Could not send email." },
      { status: 500 }
    );
  }
}
