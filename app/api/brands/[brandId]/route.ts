import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Document, ObjectId, WithId } from "mongodb";

export async function GET(
  req: Request,
  { params }: { params: { brandId: string } }
) {
  try {
    if (!params.brandId) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    const client = await clientPromise;

    const db = client.db("Kerafresh");
    const brand = await db
      .collection("Brands")
      .findOne({ _id: new ObjectId(params.brandId) });

    return NextResponse.json(brand);
  } catch (error) {
    console.log("[CATEGORY_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { brandId: string } }
) {
  try {
    //const { userId } = auth();

    if (!params.brandId) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    const client = await clientPromise;

    const db = client.db("Kerafresh");

    const result = await db
      .collection("Brands")
      .deleteOne({ _id: new ObjectId(params.brandId) });

    return NextResponse.json({});
  } catch (error) {
    console.log("[CATEGORY_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { brandId: string } }
) {
  try {
    //const { userId } = auth();
    const body = await req.json();

    const { name, image, priority } = body;

    if (!image) {
      return new NextResponse("Image is required", { status: 400 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!params.brandId) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    const client = await clientPromise;

    const db = client.db("Kerafresh");

    const result = await db
      .collection("Brands")
      .updateOne(
        { _id: new ObjectId(params.brandId) },
        { $set: { name, image, priority, createdAt: new Date() } }
      );

    const updatedCategory = await db
      .collection("Brands")
      .findOne({ _id: new ObjectId(params.brandId) });
    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.log("[CATEGORY_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
