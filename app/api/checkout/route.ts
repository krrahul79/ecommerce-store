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
  const { products, deliveryCharge, customerInfo } = await req.json(); // Fetch formData from the request

  console.log("products", products);
  console.log("formData", customerInfo); // Log formData for debugging

  if (!products || products.length === 0) {
    return new NextResponse("Product ids are required", { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db("Kerafresh");

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  let totalAmount = 0;

  const productPromises = products.map(async (productItem: any) => {
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
    totalAmount += productItem.product.newprice * productItem.quantity;
  });

  await Promise.all(productPromises);

  // Create order document only after products are processed
  const document = {
    isPaid: false,
    deliveryCharge: deliveryCharge,
    totalAmount: parseFloat(totalAmount.toFixed(2)),
    orderItems: products,
  };

  try {
    const collection = await db.collection("Orders");
    const result = await collection.insertOne(document);
    const orderId = result.insertedId;

    console.log(`Inserted ${orderId} document into the collection`);

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
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
        address: JSON.stringify(customerInfo.address), // Optionally stringify address object if needed
      },
      shipping_address_collection: {
        allowed_countries: ["GB"], // Specify allowed countries
      },
      customer_email: customerInfo.email,
    });

    return NextResponse.json(
      { url: session.url },
      {
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return new NextResponse("Failed to create order", { status: 500 });
  }
}
