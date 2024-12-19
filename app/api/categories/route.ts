import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, image, priority } = body;
    const client = await clientPromise;
    const db = client.db("Kerafresh");
    const collection = db.collection("Categories");
    const result = await collection.insertOne({
      name,
      image,
      priority,
      products: [],
      createdAt: new Date(),
    });

    // Fetch the newly inserted category
    const category = await collection.findOne({ _id: result.insertedId });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORIES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("Kerafresh");
    const categories = await db.collection("Categories").find({}) .sort({ priority: 1 }).toArray();
    console.log("fetching categories", categories);
    return NextResponse.json(categories);
  } catch (error) {
    console.log("[CATEGORIES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
