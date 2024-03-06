import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";

const settingsUrl = absoluteUrl("/settings");
const topUpUrl = absoluteUrl("/");

export async function GET(req: Request) {
  const url = new URL(req.url);

  const paymentType = url.searchParams.get("paymentType") || "subscript";
  console.log("paymentType", paymentType, url);

  try {
    const { userId } = auth();
    const user = await currentUser();
    const transaction = {
      amount: 1000,
      plan: "top up 10 credits",
      credits: 10,
      buyerId: userId,
    };
    console.log(user?.username, "user-strip-api", userId);
    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (paymentType === "payment") {
      const session = await stripe.checkout.sessions.create({
        success_url: topUpUrl,
        cancel_url: topUpUrl,
        customer_email: user.emailAddresses[0].emailAddress,
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "usd",
              unit_amount: transaction.amount,
              product_data: {
                name: transaction.plan,
              },
            },
            quantity: 1,
          },
        ],
        metadata: {
          ...transaction,
          paymentType,
        },
      });

      return new NextResponse(JSON.stringify({ url: session.url }));
    }

    const userSubscription = await prismadb.userSubscription.findUnique({
      where: {
        userId,
      },
    });

    if (userSubscription && userSubscription.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: userSubscription.stripeCustomerId,
        return_url: settingsUrl,
      });

      return new NextResponse(JSON.stringify({ url: stripeSession.url }));
    }

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: settingsUrl,
      cancel_url: settingsUrl,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: user.emailAddresses[0].emailAddress,
      line_items: [
        {
          price_data: {
            currency: "USD",
            product_data: {
              name: "Genius Pro",
              description: "Unlimited AI Generations",
            },
            unit_amount: 2000,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
      },
    });

    return new NextResponse(JSON.stringify({ url: stripeSession.url }));
  } catch (error) {
    console.log("[STRIPE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
