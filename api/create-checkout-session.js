// 🛒 Stripe Checkout Session Creation API
// Integrates with our complete license system (webhook.js + email + MongoDB)

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Product catalog matching our webhook system
const PRODUCT_CATALOG = {
  'price_1DemoTemplate': {
    name: 'Landing Page Demo Template',
    price: 39,
    license_type: 'single_use',
    description: 'Complete HTML template with sister-site navigation'
  },
  'price_1Workbooks': {
    name: 'PDF Workbook Bundle',
    price: 29,
    license_type: 'commercial',
    description: '50+ professional training PDFs'
  },
  'price_1SiteClone': {
    name: 'Site Clone Package',
    price: 399,
    license_type: 'commercial',
    description: 'Complete source code with documentation'
  },
  'price_1WhiteLabel': {
    name: 'White-Label Platform',
    price: 599,
    license_type: 'reseller',
    description: 'Full platform with custom branding'
  },
  'price_1Enterprise': {
    name: 'Enterprise License System',
    price: 1299,
    license_type: 'enterprise',
    description: 'Advanced features with enterprise license protection'
  },
  'price_1DFYSetup': {
    name: 'Done-for-You Setup',
    price: 1999,
    license_type: 'service',
    description: 'Complete setup service with 30-day support'
  }
};

export default async function handler(req, res) {
  // CORS headers for frontend integration
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, priceId, productName, price } = req.body;

    // Validate input
    if (!email || !priceId) {
      return res.status(400).json({ 
        error: 'Missing required fields: email and priceId' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Invalid email format' 
      });
    }

    // Validate product exists
    const product = PRODUCT_CATALOG[priceId];
    if (!product) {
      return res.status(400).json({ 
        error: `Invalid product ID: ${priceId}` 
      });
    }

    // Verify price matches (security check)
    if (price && price !== product.price) {
      return res.status(400).json({ 
        error: 'Price mismatch detected' 
      });
    }

    console.log(`🛒 Creating checkout session for ${email} - ${product.name}`);

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      mode: 'payment',
      metadata: {
        product_id: priceId,
        product_name: product.name,
        license_type: product.license_type,
        customer_email: email
      },
      success_url: `${req.headers.origin || 'https://www.elevateforhumanity.org'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin || 'https://www.elevateforhumanity.org'}/cancel`,
      billing_address_collection: 'required',
      payment_intent_data: {
        description: `Elevate Platform License: ${product.name}`,
        metadata: {
          product_id: priceId,
          license_type: product.license_type
        }
      }
    });

    console.log(`✅ Checkout session created: ${session.id}`);

    // Return session ID to frontend
    res.status(200).json({ 
      sessionId: session.id,
      product: {
        name: product.name,
        price: product.price,
        license_type: product.license_type
      }
    });

  } catch (error) {
    console.error('❌ Checkout session creation failed:', error);
    
    // Return user-friendly error message
    let errorMessage = 'Failed to create checkout session';
    
    if (error.type === 'StripeCardError') {
      errorMessage = 'Payment method error';
    } else if (error.type === 'StripeRateLimitError') {
      errorMessage = 'Too many requests, please try again later';
    } else if (error.type === 'StripeInvalidRequestError') {
      errorMessage = 'Invalid request parameters';
    } else if (error.type === 'StripeAPIError') {
      errorMessage = 'Payment service temporarily unavailable';
    }

    res.status(500).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// For Express.js integration (alternative export)
module.exports = async function createCheckoutSession(req, res) {
  return handler(req, res);
};