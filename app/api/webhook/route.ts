import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { Order } from "@/types";

import { stripe } from "@/lib/stripe";

import clientPromise from "@/lib/mongodb";
import { Document, ObjectId, WithId } from "mongodb";
import sgMail from "@sendgrid/mail";

if (!process.env.SENDGRID_API_KEY) {
  throw new Error('Invalid/Missing environment variable: "SENDGRID_API_KEY"');
}

const uri = process.env.SENDGRID_API_KEY;
export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const address = session?.customer_details?.address;

  const addressComponents = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country,
  ];

  const addressString = addressComponents.filter((c) => c !== null).join(", ");

  if (event.type === "checkout.session.completed") {
    const client = await clientPromise;
    const db = client.db("Kerafresh");
    console.log("session?.metadata?.orderId", session?.metadata?.orderId);
    const result = await db.collection("Orders").updateOne(
      { _id: new ObjectId(session?.metadata?.orderId) },
      {
        $set: {
          isPaid: true,
          address: addressString,
          phone: session?.customer_details?.phone || "",
        },
      }
    );

    let orders: Order | null = null;

    orders = (await db.collection("Orders").findOne({
      _id: new ObjectId(session?.metadata?.orderId),
    })) as Order | null;

    // let orderedProducts = [];
    // orders?.orderItems.map((item) => {
    //   const productName = item.product.name;
    //   const quantity = item.quantity;
    //   orderedProducts.push({ productName, quantity });
    // });

    let orderedProductsHTML = "";
    orders?.orderItems.forEach((item) => {
      const productName = item.product.name;
      const quantity = item.quantity;
      orderedProductsHTML += `
            <tr>
                <td>${productName}</td>
                <td>${quantity}</td>
            </tr>`;
    });

    const orderDetailsHTML = `
    <p><strong>Order ID:</strong> ${session?.metadata?.orderId}</p>
    <p><strong>Address:</strong> ${addressString}</p>
    <p><strong>Phone:</strong> ${session?.customer_details?.phone || ""}</p>
    <table border="1">
    <thead>
        <tr>
            <th>Product Name</th>
            <th>Quantity</th>
        </tr>
    </thead>
    <tbody>
        ${orderedProductsHTML}
    </tbody>
</table>
  `;

    sgMail.setApiKey(uri);
    const msg = {
      to: "kr.rahul79@gmail.com", // Change to your recipient
      from: "kr.rahul79@gmail.com", // Change to your verified sender
      subject: "Order confirmation",
      html: orderDetailsHTML,
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });

    console.log("result", result);
  }

  return new NextResponse(null, { status: 200 });
}
