import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { auth } from "@clerk/nextjs";
// export async function GET(req: Request) {
//   try {
//     const body = await req.json();

//     const { name, image, priority } = body;
//     const client = await clientPromise;
//     const db = client.db("Kerafresh");
//     const collection = db.collection("Categories");
//     const result = await collection.insertOne({
//       name,
//       image,
//       priority,
//       products: [],
//     });

//     // Fetch the newly inserted category
//     const category = await collection.findOne({ _id: result.insertedId });

//     return NextResponse.json(category);
//   } catch (error) {
//     console.log("[CATEGORIES_POST]", error);
//     return new NextResponse("Internal error", { status: 500 });
//   }
// }

export async function GET(req: Request) {
  try {
    const { orgRole } = auth();
    if (orgRole === "admin") {
      return NextResponse.json({ isAdmin: true });
    }
    return NextResponse.json({ isAdmin: false });
  } catch (error) {
    console.log("[CATEGORIES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
