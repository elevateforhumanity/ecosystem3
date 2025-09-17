// Stripe Checkout API for Elevate Store
// Deploy this to Vercel, Netlify Functions, or any serverless platform

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Product configuration with license types
const PRODUCTS = {
  'landing-template': {
    name: 'Landing Page Demo Template',
    price: 39,
    license_type: 'basic',
    download_files: ['landing-template.zip'],
    description: 'Prebuilt Elevate-style demo template with sister sites navigation'
  },
  'workbooks': {
    name: 'Workforce Workbooks Bundle',
    price: 29,
    license_type: 'digital',
    download_files: ['workforce-workbooks.zip'],
    description: '50+ professional PDF templates for career readiness and training'
  },
  'ai-course-creator': {
    name: 'AI Course Creator License',
    price: 199,
    license_type: 'annual',
    download_files: ['ai-course-creator.zip', 'api-keys.txt'],
    description: 'Annual license for AI-powered course generation system'
  },
  'site-clone': {
    name: 'Site Clone Package',
    price: 399,
    license_type: 'standard',
    download_files: ['elevate-site-clone.zip', 'setup-guide.pdf'],
    description: 'Complete source code with basic features and documentation'
  },
  'white-label': {
    name: 'White-Label Bundle',
    price: 599,
    license_type: 'commercial',
    download_files: ['white-label-platform.zip', 'branding-kit.zip', 'setup-guide.pdf'],
    description: 'Full platform with custom branding capabilities'
  },
  'enterprise': {
    name: 'Enterprise License System',
    price: 1299,
    license_type: 'enterprise',
    download_files: ['enterprise-platform.zip', 'license-system.zip', 'docker-config.zip'],
    description: 'Advanced features with enterprise license protection'
  },
  'done-for-you': {
    name: 'Done-for-You Setup',
    price: 1999,
    license_type: 'service',
    download_files: [], // Service-based, no immediate downloads
    description: 'Complete setup service with 30-day support'
  },
  'license-pack': {
    name: '10 License Certificates',
    price: 149,
    license_type: 'reseller',
    download_files: ['license-certificates.zip'],
    description: 'Pre-generated license certificates for resale'
  },
  'theme-pack': {
    name: 'Admin UI Theme Pack',
    price: 79,
    license_type: 'addon',
    download_files: ['admin-themes.zip'],
    description: '3 modern admin panel themes with dark mode'
  },
  'mobile-app': {
    name: 'Mobile App Builder',
    price: 299,
    license_type: 'addon',
    download_files: ['mobile-app-builder.zip', 'react-native-templates.zip'],
    description: 'React Native app generator with templates'
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Invalid items' });
    }

    // Validate items and calculate total
    const lineItems = [];
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = PRODUCTS[item.id];
      if (!product) {
        return res.status(400).json({ error: `Invalid product: ${item.id}` });
      }

      // Verify price matches
      if (item.price !== product.price) {
        return res.status(400).json({ error: `Price mismatch for ${item.id}` });
      }

      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            description: product.description,
            metadata: {
              product_id: item.id,
              license_type: product.license_type
            }
          },
          unit_amount: product.price * 100, // Stripe uses cents
        },
        quantity: 1,
      });

      totalAmount += product.price;
      orderItems.push({
        product_id: item.id,
        product_name: product.name,
        price: product.price,
        license_type: product.license_type,
        download_files: product.download_files
      });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cancel`,
      metadata: {
        order_items: JSON.stringify(orderItems),
        total_amount: totalAmount.toString()
      },
      customer_email: req.body.email || undefined,
      billing_address_collection: 'required',
    });

    // Store pending order in database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        stripe_session_id: session.id,
        status: 'pending',
        total_amount: totalAmount,
        items: orderItems,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      // Continue anyway - we can recover from webhook
    }

    res.status(200).json({ id: session.id });

  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Webhook handler for payment completion
export async function webhookHandler(req, res) {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      await handlePaymentSuccess(event.data.object);
      break;
    case 'checkout.session.expired':
      await handlePaymentExpired(event.data.object);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).json({ received: true });
}

async function handlePaymentSuccess(session) {
  try {
    // Update order status
    const { data: order, error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'completed',
        stripe_payment_intent: session.payment_intent,
        customer_email: session.customer_details?.email,
        customer_name: session.customer_details?.name,
        billing_address: session.customer_details?.address,
        completed_at: new Date().toISOString()
      })
      .eq('stripe_session_id', session.id)
      .select()
      .single();

    if (updateError) {
      console.error('Order update error:', updateError);
      return;
    }

    // Generate licenses for each item
    const licenses = [];
    for (const item of order.items) {
      const license = await generateLicense(order, item);
      licenses.push(license);
    }

    // Send delivery email with download links
    await sendDeliveryEmail(order, licenses);

    console.log(`Order ${order.id} completed successfully`);

  } catch (error) {
    console.error('Payment success handling error:', error);
  }
}

async function handlePaymentExpired(session) {
  try {
    await supabase
      .from('orders')
      .update({
        status: 'expired',
        expired_at: new Date().toISOString()
      })
      .eq('stripe_session_id', session.id);

    console.log(`Order expired for session ${session.id}`);
  } catch (error) {
    console.error('Payment expiry handling error:', error);
  }
}

async function generateLicense(order, item) {
  const licenseKey = generateLicenseKey();
  const expiryDate = calculateExpiryDate(item.license_type);
  
  // Create license record
  const { data: license, error: licenseError } = await supabase
    .from('licenses')
    .insert({
      license_key: licenseKey,
      order_id: order.id,
      product_id: item.product_id,
      license_type: item.license_type,
      customer_email: order.customer_email,
      customer_name: order.customer_name,
      status: 'active',
      expires_at: expiryDate,
      download_files: item.download_files,
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  if (licenseError) {
    console.error('License creation error:', licenseError);
    throw licenseError;
  }

  return license;
}

function generateLicenseKey() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const segments = [];
  
  for (let i = 0; i < 4; i++) {
    let segment = '';
    for (let j = 0; j < 4; j++) {
      segment += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    segments.push(segment);
  }
  
  return segments.join('-');
}

function calculateExpiryDate(licenseType) {
  const now = new Date();
  
  switch (licenseType) {
    case 'annual':
      return new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
    case 'enterprise':
      return new Date(now.getFullYear() + 3, now.getMonth(), now.getDate());
    case 'service':
      return new Date(now.getFullYear() + 5, now.getMonth(), now.getDate());
    default:
      return null; // Lifetime license
  }
}

async function sendDeliveryEmail(order, licenses) {
  // Email delivery implementation
  // Use SendGrid, AWS SES, or similar service
  
  const emailData = {
    to: order.customer_email,
    subject: 'Your Elevate Platform Purchase - Download Links & Licenses',
    html: generateDeliveryEmailHTML(order, licenses)
  };

  // Send email (implement with your preferred service)
  console.log('Email would be sent:', emailData);
}

function generateDeliveryEmailHTML(order, licenses) {
  return `
    <h1>Thank you for your Elevate Platform purchase!</h1>
    <p>Dear ${order.customer_name},</p>
    <p>Your order has been processed successfully. Here are your download links and license keys:</p>
    
    ${licenses.map(license => `
      <div style="border: 1px solid #ddd; padding: 15px; margin: 10px 0;">
        <h3>${license.product_id}</h3>
        <p><strong>License Key:</strong> ${license.license_key}</p>
        <p><strong>Download Files:</strong></p>
        <ul>
          ${license.download_files.map(file => `
            <li><a href="${process.env.DOWNLOAD_BASE_URL}/${license.license_key}/${file}">${file}</a></li>
          `).join('')}
        </ul>
        ${license.expires_at ? `<p><strong>Expires:</strong> ${license.expires_at}</p>` : '<p><strong>License:</strong> Lifetime</p>'}
      </div>
    `).join('')}
    
    <p>Need help? Contact support@elevateforhumanity.com</p>
    <p>Best regards,<br>The Elevate Team</p>
  `;
}