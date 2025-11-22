import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcrypt";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const client = await clientPromise;
    const db = client.db("flotureDB");

    const user = await db.collection("users").findOne({ email });
    if (!user) return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });
    if (!user.verified) return NextResponse.json({ error: "Please verify your email first" }, { status: 400 });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });

    return NextResponse.json({ user: { email: user.email, name: user.name } });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
