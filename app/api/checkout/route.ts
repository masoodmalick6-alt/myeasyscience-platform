import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please log in first." }, { status: 401 });

  const secret = process.env.STRIPE_SECRET_KEY;
  const price = process.env.STRIPE_PREMIUM_PRICE_ID;
  const site = process.env.NEXT_PUBLIC_SITE_URL;
  if (!secret || !price || !site) return NextResponse.json({ error: "Membership payments are not configured yet." }, { status: 503 });

  const stripe = new Stripe(secret);
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price, quantity: 1 }],
    customer_email: user.email,
    client_reference_id: user.id,
    metadata: { supabase_user_id: user.id },
    subscription_data: { metadata: { supabase_user_id: user.id } },
    success_url: `${site}/membership?success=1`,
    cancel_url: `${site}/membership?canceled=1`
  });
  return NextResponse.json({ url: session.url });
}
