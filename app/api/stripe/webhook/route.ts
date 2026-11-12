import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const signingSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret || !signingSecret || !url || !serviceKey) {
    return NextResponse.json({ error: "Webhook is not configured." }, { status: 503 });
  }
  const stripe = new Stripe(secret);
  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing signature." }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(await request.text(), signature, signingSecret);
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
  }

  const supabase = createSupabaseClient(url, serviceKey, { auth: { persistSession: false } });
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.supabase_user_id || session.client_reference_id;
    if (userId && session.subscription) {
      const subscription = await stripe.subscriptions.retrieve(String(session.subscription));
      await supabase.from("profiles").update({
        membership_tier: subscription.status === "active" || subscription.status === "trialing" ? "premium" : "free",
        stripe_customer_id: String(session.customer),
        stripe_subscription_id: subscription.id,
        subscription_status: subscription.status
      }).eq("id", userId);
    }
  }
  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const userId = subscription.metadata.supabase_user_id;
    if (userId) {
      const active = subscription.status === "active" || subscription.status === "trialing";
      await supabase.from("profiles").update({
        membership_tier: active ? "premium" : "free",
        stripe_customer_id: String(subscription.customer),
        stripe_subscription_id: subscription.id,
        subscription_status: subscription.status
      }).eq("id", userId);
    }
  }
  return NextResponse.json({ received: true });
}
