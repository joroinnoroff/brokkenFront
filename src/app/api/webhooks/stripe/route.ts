/**
 * Stripe webhook: handles checkout events.
 * - checkout.session.completed: creates purchases, marks records as Sold
 * - checkout.session.expired / payment_intent.payment_failed: logged (no record change)
 */
import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const backendUrl = process.env.NEXT_PUBLIC_API_URL;

const stripe =
  stripeSecretKey &&
  new Stripe(stripeSecretKey, { apiVersion: "2026-01-28.clover" });

export async function POST(req: NextRequest) {
  if (!stripe || !webhookSecret) {
    console.warn("Stripe or STRIPE_WEBHOOK_SECRET not configured");
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 500 }
    );
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.expired":
      console.log("[Stripe] checkout.session.expired", (event.data.object as Stripe.Checkout.Session).id);
      return NextResponse.json({ received: true });
    case "payment_intent.payment_failed":
      console.log("[Stripe] payment_intent.payment_failed", (event.data.object as Stripe.PaymentIntent).id);
      return NextResponse.json({ received: true });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const purchaseUuid = session.client_reference_id;
  if (!purchaseUuid) {
    console.error("checkout.session.completed missing client_reference_id");
    return NextResponse.json({ received: true });
  }

  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    expand: ["data.price.product"],
  });

  const recordIds: number[] = [];

  for (const item of lineItems.data) {
    const product = item.price?.product;
    if (
      product &&
      typeof product === "object" &&
      !("deleted" in product) &&
      product.metadata?.record_id
    ) {
      const id = parseInt(product.metadata.record_id, 10);
      if (!Number.isNaN(id)) {
        recordIds.push(id);
      }
    }
  }

  if (recordIds.length === 0) {
    console.warn("No record_ids in line item metadata for session", session.id);
    return NextResponse.json({ received: true });
  }

  if (!backendUrl) {
    console.warn("NEXT_PUBLIC_API_URL not set; skipping backend updates");
    return NextResponse.json({ received: true });
  }

  try {
    const res = await fetch(`${backendUrl}/purchases`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        purchase_uuid: purchaseUuid,
        record_ids: recordIds,
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error("Backend purchases error", res.status, text);
    }
  } catch (err) {
    console.error("Failed to create purchases on backend", err);
  }

  for (const recordId of recordIds) {
    try {
      const updateRes = await fetch(`${backendUrl}/records?id=${recordId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availability: "Sold" }),
      });
      if (!updateRes.ok) {
        console.error("Failed to mark record as Sold", recordId, await updateRes.text());
      }
    } catch (err) {
      console.error("Failed to update record availability", recordId, err);
    }
  }

  return NextResponse.json({ received: true });
}
