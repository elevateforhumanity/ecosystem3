/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/
import React from "react";
import { Helmet } from "react-helmet";
import MentorDirectory from "./sisters/MentorDirectory";

export default function ThankYou() {
  return (
    <main style={{ padding: 32, maxWidth: 700, margin: "0 auto" }}>
      <Helmet>
        <title>Thank You | Elevate for Humanity</title>
        <meta
          name="description"
          content="Thank you for your purchase! Your order has been received. Check your email for next steps and setup instructions."
        />
      </Helmet>
      <h1>Thank You for Your Purchase!</h1>
      <p>
        Your order has been received. Check your email for next steps and setup instructions.<br />
        Need help? Email <a href="mailto:support@elevateforhumanity.org">support@elevateforhumanity.org</a>
      </p>
      {/* TODO: Add links to return to home or explore more programs */}
    </main>
  );
}

/*
# Elevate for Humanity LMS Codebase

## Quick Sale – Get Your Own Government-Ready LMS

**Live Demo:** [https://elevateforhumanity.org/clone](https://elevateforhumanity.org/clone)

## Features
- DOL/DOE/DWD compliant
- Modular React/Node SPA
- Stripe Connect for payments and partner revenue split
- Durable blog integration
- Automated reporting (Excel/PDF)
- Chat (Tidio) and Twilio SMS
- All compliance/legal pages included
- Documentation, setup support, and demo content

## How to Buy
1. Go to [https://elevateforhumanity.org/clone](https://elevateforhumanity.org/clone)
2. Click “Buy Now” for instant purchase or “Contact Sales” for questions.
3. After purchase, you’ll receive setup instructions and support.

## License Notice
No resale, sublicensing, or redistribution. All rights reserved. See LICENSE file for full terms.
*/