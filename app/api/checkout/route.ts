import Stripe from "stripe";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

import { ObjectId } from "mongodb";

import { stripe } from "@/lib/stripe";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  const { products } = await req.json();

  console.log("products", products);

  if (!products || products.length === 0) {
    return new NextResponse("Product ids are required", { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db("Kerafresh");

  let deliveryCharge = 5.99;
  let minAmount = 50.0;
  const configData = await db.collection("Config").find({}).toArray();

  if (configData && configData.length > 0) {
    deliveryCharge = parseFloat(String(configData[0].deliveryCharge));
    minAmount = parseFloat(String(configData[0].minAmount));
  }

  //  console.log("products", products);

  //const orderItems = productsFetched;

  // Create order document only after products are fetched
  const collection = await db.collection("Orders");
  const document = {
    isPaid: false,
    orderItems: products,
  };

  // Insert the order document
  const result = await collection.insertOne(document);
  const orderId = result.insertedId;

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  var totalAmount = 0;
  products.forEach((productItem: any) => {
    line_items.push({
      quantity: productItem.quantity,
      price_data: {
        currency: "GBP",
        product_data: {
          name: productItem.product.name,
        },
        unit_amount: productItem.product.newprice * 100,
      },
    });
    totalAmount = totalAmount + productItem.product.newprice;
  });

  if (totalAmount > minAmount) {
    deliveryCharge = 0;
  }

  console.log(`Inserted ${result.insertedId} document into the collection`);
  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    billing_address_collection: "required",
    phone_number_collection: {
      enabled: true,
    },

    success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
    cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          display_name: "Delivery Charges",
          fixed_amount: {
            amount: deliveryCharge * 100,
            currency: "GBP",
          },
        },
      },
    ],
    metadata: {
      orderId: orderId.toString(),
    },
  });

  return NextResponse.json(
    { url: session.url },
    {
      headers: corsHeaders,
    }
  );
}
