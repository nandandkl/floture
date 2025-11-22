import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) return NextResponse.json({ error: "Invalid token" }, { status: 400 });

  const client = await clientPromise;
  const db = client.db("flotureDB");

  const user = await db.collection("users").findOne({ verificationToken: token });
  if (!user) return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });

  await db.collection("users").updateOne(
    { _id: user._id },
    { $set: { verified: true }, $unset: { verificationToken: "" } }
  );

  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login?verified=true`);
}


