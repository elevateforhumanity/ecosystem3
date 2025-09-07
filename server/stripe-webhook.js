/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/
const express = require("express");
const bodyParser = require("body-parser");
const Stripe = require("stripe");
const twilio = require("twilio");

const stripe = Stripe("sk_test_your_stripe_secret_key"); // Use your real Stripe secret key
const twilioClient = twilio("TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN"); // Use your Twilio credentials

const app = express();
app.use(bodyParser.raw({ type: "application/json" }));

app.post("/webhook", (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      "your_stripe_webhook_secret"
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    // Send SMS via Twilio
    twilioClient.messages
      .create({
        body: "A new payment was received on Elevate for Humanity!",
        from: "+1234567890", // Your Twilio number
        to: "+1987654321",   // Your personal phone number
      })
      .then(message => console.log("SMS sent:", message.sid))
      .catch(err => console.error("Twilio error:", err));
  }

  res.json({ received: true });
});

app.listen(4242, () => console.log("Webhook server running on port 4242"));