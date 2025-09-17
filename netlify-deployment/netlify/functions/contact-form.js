// Netlify Function for Contact Form Processing
exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body);
    const { name, email, phone, message, program, fundingInterest } = data;

    // Basic validation
    if (!name || !email || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid email format' })
      };
    }

    // Prepare email content
    const emailContent = `
New Contact Form Submission - Elevate for Humanity

Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Program Interest: ${program || 'Not specified'}
Funding Interest: ${fundingInterest ? 'Yes' : 'No'}

Message:
${message}

Submitted: ${new Date().toLocaleString()}
IP Address: ${event.headers['x-forwarded-for'] || 'Unknown'}
User Agent: ${event.headers['user-agent'] || 'Unknown'}
    `;

    // Send email using Netlify's built-in email service or external service
    // For now, we'll log and return success
    console.log('Contact form submission:', emailContent);

    // You can integrate with:
    // - SendGrid
    // - Mailgun
    // - AWS SES
    // - Or any email service

    // Example SendGrid integration (uncomment and configure):
    /*
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    const msg = {
      to: 'info@elevateforhumanity.org',
      from: 'noreply@elevateforhumanity.org',
      subject: 'New Contact Form Submission',
      text: emailContent,
      html: emailContent.replace(/\n/g, '<br>')
    };
    
    await sgMail.send(msg);
    */

    // Add to CRM or database if needed
    // Example: Airtable, Google Sheets, or database integration

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({
        success: true,
        message: 'Thank you for your interest! We will contact you within 24 hours.'
      })
    };

  } catch (error) {
    console.error('Contact form error:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error. Please try again or call us directly.'
      })
    };
  }
};