import Stripe from "stripe";

export const config = {
  path: "/api/stripe/webhook"
};

export default async (req, context) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET || "", { apiVersion: "2023-10-16" });
  const sig = req.headers.get("stripe-signature");
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

  let event;
  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(rawBody, sig, whSecret);
  } catch (err) {
    return new Response(JSON.stringify({ error: `Webhook signature verification failed: ${err.message}` }), { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        // TODO: handle success
        break;
      default:
        break;
    }
    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};