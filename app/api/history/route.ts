import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const runtime = "nodejs";

// GET /api/history - Fetch history for a user
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("flotureDB");

        const history = await db
            .collection("histories")
            .find({ email })
            .sort({ timestamp: -1 })
            .toArray();

        return NextResponse.json(history);
    } catch (err) {
        console.error("Fetch history error:", err);
        return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
    }
}

// POST /api/history - Save a new history item
export async function POST(req: Request) {
    try {
        const { email, flower, confidence, image } = await req.json();

        if (!email || !flower) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("flotureDB");

        const newItem = {
            email,
            flower,
            confidence,
            image,
            timestamp: new Date().toISOString(),
        };

        await db.collection("histories").insertOne(newItem);

        return NextResponse.json({ success: true, item: newItem });
    } catch (err) {
        console.error("Save history error:", err);
        return NextResponse.json({ error: "Failed to save history" }, { status: 500 });
    }
}

// DELETE /api/history - Delete history
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");
        const id = searchParams.get("id");

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("flotureDB");

        if (id) {
            // Delete specific item
            await db.collection("histories").deleteOne({ _id: new ObjectId(id), email });
        } else {
            // Clear all history for user
            await db.collection("histories").deleteMany({ email });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Delete history error:", err);
        return NextResponse.json({ error: "Failed to delete history" }, { status: 500 });
    }
}
