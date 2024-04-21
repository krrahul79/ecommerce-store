import { NextResponse } from "next/server";

import clientPromise from "@/lib/mongodb";

import { Document, ObjectId, WithId } from "mongodb";
import { ChildProduct } from "@/types";

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    const client = await clientPromise;

    const db = client.db("Kerafresh");
    if (params.productId) {
      const product = await db
        .collection("Products")
        .findOne({ _id: new ObjectId(params.productId) });

      if (product) {
        if (product.childProducts && product.childProducts.length > 0) {
          const childProductsArray: WithId<Document>[] = [];
          // Fetch child products using Promise.all() to wait for all child product fetches to complete
          await Promise.all(
            product.childProducts.map(async (childProductId: string) => {
              const childProduct = await db
                .collection("Products")
                .findOne({ _id: new ObjectId(childProductId) });
              if (childProduct) {
                childProductsArray.push(childProduct);
              }
            })
          );
          childProductsArray.sort(
            (a, b) => Number(a.calculateSize) - Number(b.calculateSize)
          );
          if (childProductsArray.length > 0) {
            product.newprice = childProductsArray[0].newprice;
            product.oldprice = childProductsArray[0].oldprice;
          }
          product.childProducts = childProductsArray;
        }
      } else {
        // Handle the case where product is null
        console.log("Product not found");
      }
      // Return the product after all sorting and updates
      return NextResponse.json(product);
    }
  } catch (error) {
    console.log("[PRODUCT_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
// export async function DELETE(
//   req: Request,
//   { params }: { params: { productId: string; storeId: string } }
// ) {
//   try {
//     // const { userId } = auth();
//     const userId = "user_2bYBYCjrQzapn8M7vHj8qIQIK9v";

//     if (!userId) {
//       return new NextResponse("Unauthenticated", { status: 403 });
//     }

//     if (!params.productId) {
//       return new NextResponse("Product id is required", { status: 400 });
//     }

//     const storeByUserId = await prismadb.store.findFirst({
//       where: {
//         id: params.storeId,
//         userId,
//       },
//     });

//     if (!storeByUserId) {
//       return new NextResponse("Unauthorized", { status: 405 });
//     }

//     const product = await prismadb.product.delete({
//       where: {
//         id: params.productId,
//       },
//     });

//     return NextResponse.json(product);
//   } catch (error) {
//     console.log("[PRODUCT_DELETE]", error);
//     return new NextResponse("Internal error", { status: 500 });
//   }
// }

export async function PATCH(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    //const { userId } = auth();
    const client = await clientPromise;
    const db = client.db("Kerafresh");

    const body = await req.json();

    console.log("product patch body", body);

    const {
      calculateSize,
      categoryId,
      childProducts,
      images,
      isArchived,
      isFeatured,
      name,
      newprice,
      oldprice,
      typeToDisplay,
      _id,
    } = body;

    let childProductsArray: string[] = [];

    await Promise.all(
      childProducts.map(async (product: ChildProduct) => {
        if (product && product._id && product._id != "") {
          childProductsArray.push(product._id);
          const result = await db.collection("Products").updateOne(
            { _id: new ObjectId(product._id) },
            {
              $set: {
                oldprice: parseFloat(String(product.oldprice)),
                newprice: parseFloat(String(product.newprice)),
                showSize: product.showSize,
                calculateSize: parseInt(String(product.calculateSize)),
                isChildProduct: true,
                createdAt: new Date(),
              },
            }
          );
        } else {
          const collection = db.collection("Products");
          const result = await collection.insertOne({
            oldprice: parseFloat(String(product.oldprice)),
            newprice: parseFloat(String(product.newprice)),
            showSize: product.showSize,
            calculateSize: parseInt(String(product.calculateSize)),
            isChildProduct: product.isChildProduct,
            createdAt: new Date(),
          });
          childProductsArray.push(result.insertedId.toString());
        }
      })
    );

    const result = await db.collection("Products").updateOne(
      { _id: new ObjectId(params.productId) },
      {
        $set: {
          calculateSize: parseInt(String(calculateSize)),
          categoryId,
          childProducts: childProductsArray,
          images,
          isArchived,
          isFeatured,
          name,
          newprice: parseFloat(String(newprice)),
          oldprice: parseFloat(String(oldprice)),
          typeToDisplay,
          createdAt: new Date(),
        },
      }
    );

    const updatedProduct = await db
      .collection("Products")
      .findOne({ _id: new ObjectId(params.productId) });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.log("[PRODUCT_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
