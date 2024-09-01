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
  console.log("Inside the email webhook");
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
    const deliveryCharge = orders?.deliveryCharge;
    const totalAmount = orders?.totalAmount;
    orders?.orderItems.forEach((item) => {
      const productName = item.product.name;
      const price = item.product.newprice;
      const quantity = item.quantity;

      orderedProductsHTML += `
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">${productName}</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${quantity}</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">£${price} each</td>
            </tr>`;
    });

    orderedProductsHTML += `
    <tr>
        <td colspan="2" style="padding: 8px; border: 1px solid #ddd; text-align: right;">Delivery Charge:</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">£${deliveryCharge}</td>
    </tr>`;
    orderedProductsHTML += `
    <tr>
        <td colspan="2" style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: bold;">Total Amount:</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center; font-weight: bold;">£${totalAmount}</td>
    </tr>`;

    const orderDetailsHTML = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #5a9;">Thank you for your order!</h2>
        <p><strong>Order ID:</strong> ${session?.metadata?.orderId}</p>
        <p><strong>Delivery Address:</strong> ${addressString}</p>
        <p><strong>Contact Phone:</strong> ${
          session?.customer_details?.phone || "N/A"
        }</p>
        <table style="border-collapse: collapse; width: 100%; margin-top: 20px;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Product Name</th>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Quantity</th>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${orderedProductsHTML}
          </tbody>
        </table>
        <p style="margin-top: 20px;">We appreciate your business and hope you enjoy your purchase!</p>
      </div>
    `;

    sgMail.setApiKey(uri);
    const msg1 = {
      to: "kerafresh1@gmail.com", // Change to your recipient
      from: "kerafresh1@gmail.com", // Change to your verified sender
      subject: "Order confirmation",
      html: orderDetailsHTML,
    };
    sgMail
      .send(msg1)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });
    const msg2 = {
      to: session?.customer_details?.email?.toString(), // Change to your recipient
      from: "kerafresh1@gmail.com", // Change to your verified sender
      subject: "Order confirmation",
      html: orderDetailsHTML,
    };
    sgMail
      .send(msg2)
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
