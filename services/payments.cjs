const stripeKey = process.env.STRIPE_SECRET_KEY;
let stripe = null;
if (stripeKey) {
  try { stripe = require('stripe')(stripeKey, { apiVersion: '2023-10-16' }); } catch { stripe = null; }
}

async function createPaymentIntent({ amount, programId, userId, requestId }) {
  if (!stripe) {
    return {
      simulated: true,
      clientSecret: 'simulated_secret',
      paymentIntentId: 'pi_simulated',
      amount,
      programId
    };
  }
  const intent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    metadata: { programId, userId, requestId }
  }, { idempotencyKey: requestId });
  return {
    simulated: false,
    clientSecret: intent.client_secret,
    paymentIntentId: intent.id,
    amount,
    programId
  };
}

function listStripeConfiguredPrices() {
  return Object.keys(process.env)
    .filter(k => k.startsWith('STRIPE_PRICE_'))
    .reduce((acc, k) => { acc[k] = process.env[k]; return acc; }, {});
}

module.exports = { createPaymentIntent, listStripeConfiguredPrices };
