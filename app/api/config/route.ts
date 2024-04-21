import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Document, ObjectId, WithId } from "mongodb";

export async function GET(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("Kerafresh");
    const config = await db
      .collection("Config")
      .findOne({ _id: new ObjectId("6623272fe20d2a3ba88c817b") });
    console.log("fetching Config", config);
    return NextResponse.json(config);
  } catch (error) {
    console.log("[CATEGORIES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
