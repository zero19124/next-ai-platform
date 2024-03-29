import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";

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
  const metadata = session?.metadata;
  // console.log(event.type, "webhook-25", event.data.object);

  if (event.type === "checkout.session.completed") {
    console.log(event.type, "webhook-25", event.data.object);
    console.log("metadata", metadata, "metadata");
    if (!metadata) {
      console.log("metadata is null");
    }
    if (metadata?.paymentType === "payment") {
      await prismadb.userApiLimit.update({
        where: {
          userId: metadata.buyerId,
        },
        data: {
          maxFreeCount: { increment: 5 },
        },
      });
      return new NextResponse(null, { status: 200 });
    }
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    if (!session?.metadata?.userId) {
      return new NextResponse("User id is required", { status: 400 });
    }

    await prismadb.userSubscription.create({
      data: {
        userId: session?.metadata?.userId,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    });
  }

  if (event.type === "invoice.payment_succeeded") {
    if (metadata?.paymentType === "payment") {
      return;
    }
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );
    console.log(
      "payment_succeeded",
      subscription.id,
      "priceid",
      subscription.items.data[0].price.id,
      +"time",
      subscription.current_period_end * 1000
    );

    await prismadb.userSubscription.update({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      data: {
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    });
  }

  return new NextResponse(null, { status: 200 });
}
