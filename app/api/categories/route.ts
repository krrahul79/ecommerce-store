import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import prismadb from "@/lib/prismadb";

// export async function POST(req: Request) {
//   try {
//     //const { userId } = auth();

//     const userId = "user_2bYBYCjrQzapn8M7vHj8qIQIK9v";
//     const body = await req.json();

//     const { name, imageUrl, priority } = body;

//     if (!userId) {
//       return new NextResponse("Unauthenticated", { status: 403 });
//     }

//     if (!name) {
//       return new NextResponse("Name is required", { status: 400 });
//     }

//     if (!imageUrl) {
//       return new NextResponse("Image is required", { status: 400 });
//     }

//     return NextResponse.json(category);
//   } catch (error) {
//     console.log("[CATEGORIES_POST]", error);
//     return new NextResponse("Internal error", { status: 500 });
//   }
// }

export async function GET(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("Kerafresh");
    const categories = await db.collection("Categories").find({}).toArray();

    return NextResponse.json(categories);
  } catch (error) {
    console.log("[CATEGORIES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
