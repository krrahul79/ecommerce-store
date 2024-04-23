import { NextResponse } from "next/server";

// import prismadb from "@/lib/prismadb";

import clientPromise from "@/lib/mongodb";

import { Document, ObjectId, WithId } from "mongodb";
import { ChildProduct } from "@/types";

export async function POST(req: Request, {}: {}) {
  try {
    // const { userId } = auth();
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
      })
    );
    const collection = await db.collection("Products");
    const result = await collection.insertOne({
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
    });

    const updatedProduct = await db
      .collection("Products")
      .findOne({ _id: new ObjectId(result.insertedId) });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.log("[PRODUCTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const brandId = searchParams.get("brandId") || undefined;
    const isFeatured = searchParams.get("isFeatured") || undefined;
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
    } else if (brandId) {
      const brand = await db
        .collection("Brands")
        .findOne({ _id: new ObjectId(brandId) });

      if (brand) {
        // If the category exists, extract the product IDs from the category document
        const productIds = brand.products;
        // Fetch the products using the extracted product IDs
        products = await db
          .collection("Products")
          .find({ _id: { $in: productIds } })
          .toArray();

        console.log(products); // Log the fetched products

        // Check if at least one product is found
        if (products.length > 0) {
          console.log("At least one product found for the provided Brand _id.");
        } else {
          console.log("No products found for the provided Brand _id.");
        }
      } else {
        console.log("Brand not found for the provided _id.");
      }
    } else if (isFeatured) {
      products = await db
        .collection("Products")
        .find({ isFeatured: true })
        .sort({ created: 1 })
        .toArray();
    } else {
      products = await db
        .collection("Products")
        .find({ isChildProduct: false })
        .sort({ created: 1 })
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
