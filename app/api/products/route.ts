import { NextResponse } from "next/server";

// import prismadb from "@/lib/prismadb";

import clientPromise from "@/lib/mongodb";

import { Document, ObjectId, WithId } from "mongodb";

// export async function POST(
//   req: Request,
//   { params }: { params: { storeId: string } }
// ) {
//   try {
//     // const { userId } = auth();
//     const userId = "user_2bYBYCjrQzapn8M7vHj8qIQIK9v";
//     const body = await req.json();

//     const {
//       name,
//       price,
//       categoryId,
//       images,
//       isFeatured,
//       isArchived,
//       measure,
//       unit,
//     } = body;

//     if (!userId) {
//       return new NextResponse("Unauthenticated", { status: 403 });
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

//     if (!params.storeId) {
//       return new NextResponse("Store id is required", { status: 400 });
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

//     const product = await prismadb.product.create({
//       data: {
//         name,
//         price,
//         isFeatured,
//         isArchived,
//         categoryId,
//         measure,
//         unit,
//         storeId: params.storeId,
//         images: {
//           createMany: {
//             data: [...images.map((image: { url: string }) => image)],
//           },
//         },
//       },
//     });

//     return NextResponse.json(product);
//   } catch (error) {
//     console.log("[PRODUCTS_POST]", error);
//     return new NextResponse("Internal error", { status: 500 });
//   }
// }

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const isFeatured = searchParams.get("isFeatured");
    console.log(categoryId);
    let products: string | any[] = [];
    const client = await clientPromise;
    const db = client.db("Kerafresh");
    if (categoryId) {
      const category = await db
        .collection("Categories")
        .findOne({ _id: new ObjectId(categoryId) });

      if (category) {
        // If the category exists, extract the product IDs from the category document
        const productIds = category.products;
        // Fetch the products using the extracted product IDs
        products = await db
          .collection("Products")
          .find({ _id: { $in: productIds } })
          .toArray();

        console.log(products); // Log the fetched products

        // Check if at least one product is found
        if (products.length > 0) {
          console.log(
            "At least one product found for the provided category _id."
          );
        } else {
          console.log("No products found for the provided category _id.");
        }
      } else {
        console.log("Category not found for the provided _id.");
      }
    } else {
      products = await db
        .collection("Products")
        .find({})
        .sort({ metacritic: -1 })
        .limit(10)
        .toArray();
    }

    // Fetch child products for each product asynchronously
    await Promise.all(
      products.map(async (product) => {
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
          product.childProducts = childProductsArray;
        }
      })
    );

    console.log("products", products);
    return NextResponse.json(products);
  } catch (error) {
    console.log("[PRODUCTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
