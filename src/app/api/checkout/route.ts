import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.warn(
    "STRIPE_SECRET_KEY is not set. The /api/checkout endpoint will not work until you configure it."
  );
}

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
    apiVersion: "2026-01-28.clover",
  })
  : null;

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export async function POST(req: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe is not configured on the server." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const cart: CartItem[] = Array.isArray(body?.cart) ? body.cart : [];
    const purchaseUuid = typeof body?.purchase_uuid === "string" ? body.purchase_uuid.trim() : null;

    if (!cart.length) {
      return NextResponse.json(
        { error: "Cart is empty." },
        { status: 400 }
      );
    }

    if (!purchaseUuid) {
      return NextResponse.json(
        { error: "Missing purchase_uuid (user/cart UUID)." },
        { status: 400 }
      );
    }

    const lineItems = cart.map((item) => ({
      quantity: item.quantity || 1,
      price_data: {
        currency: "nok",
        product_data: {
          name: item.name,
          metadata: {
            record_id: String(item.id),
          },
        },
        unit_amount: Math.round(item.price * 100),
      },
    }));

    const origin =
      req.headers.get("origin") ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      client_reference_id: purchaseUuid,
      line_items: lineItems,
      success_url: `${origin}/success`,
      cancel_url: `${origin}/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creating Stripe Checkout Session", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

