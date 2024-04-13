import { NextResponse } from "next/server";

import clientPromise from "@/lib/mongodb";

import { Document, ObjectId, WithId } from "mongodb";

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
            (a, b) => Number(a.showsize) - Number(b.showsize)
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

// export async function PATCH(
//   req: Request,
//   { params }: { params: { productId: string; storeId: string } }
// ) {
//   try {
//     //const { userId } = auth();
//     const userId = "user_2bYBYCjrQzapn8M7vHj8qIQIK9v";

//     const body = await req.json();

//     const { name, price, categoryId, images, isFeatured, isArchived } = body;

//     if (!userId) {
//       return new NextResponse("Unauthenticated", { status: 403 });
//     }

//     if (!params.productId) {
//       return new NextResponse("Product id is required", { status: 400 });
//     }

//     if (!name) {
//       return new NextResponse("Name is required", { status: 400 });
//     }

//     if (!images || !images.length) {
//       return new NextResponse("Images are required", { status: 400 });
//     }

//     if (!price) {
//       return new NextResponse("Price is required", { status: 400 });
//     }

//     if (!categoryId) {
//       return new NextResponse("Category id is required", { status: 400 });
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

//     await prismadb.product.update({
//       where: {
//         id: params.productId,
//       },
//       data: {
//         name,
//         price,
//         categoryId,
//         images: {
//           deleteMany: {},
//         },
//         isFeatured,
//         isArchived,
//       },
//     });

//     const product = await prismadb.product.update({
//       where: {
//         id: params.productId,
//       },
//       data: {
//         images: {
//           createMany: {
//             data: [...images.map((image: { url: string }) => image)],
//           },
//         },
//       },
//     });

//     return NextResponse.json(product);
//   } catch (error) {
//     console.log("[PRODUCT_PATCH]", error);
//     return new NextResponse("Internal error", { status: 500 });
//   }
// }
