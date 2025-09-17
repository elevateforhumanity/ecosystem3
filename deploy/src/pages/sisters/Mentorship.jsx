/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/

/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/

/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/

import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import NavBar from "../../components/NavBar";
import { Link } from "react-router-dom";

export default function Mentorship() {
  const [markedUpPrice, setMarkedUpPrice] = useState(null);
  const [loading, setLoading] = useState(true);

  // Replace with your actual product and partner account IDs
  const productId = "prod_XXXXXXXXXXXX";
  const partnerStripeAccountId = "acct_XXXXXXXXXXXX";

  useEffect(() => {
    fetch(`/api/checkout/product/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        setMarkedUpPrice(data.markedUpPrice);
        setLoading(false);
      });
  }, []);

  const handleBuyNow = async () => {
    const res = await fetch("/api/checkout/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        priceId: "price_XXXXXXXXXXXX", // Replace with actual priceId from backend
        partnerStripeAccountId,
      }),
    });
    const data = await res.json();
    window.location.href = data.url;
  };

  return (
    <>
      <Helmet>
        <title>Elevate for Humanity | Empowering Students Worldwide</title>
        <meta
          name="description"
          content="Accessible, high-quality education and mentorship for all. Join Elevate for Humanity and our sister sites to grow, connect, and make a difference."
        />
      </Helmet>
      <header>
        <NavBar />
      </header>
      <main id="main-content" tabIndex={-1} style={{ padding: 32 }}>
        <h1>Mentorship Hub</h1>
        <p>
          Connect with experienced mentors for career guidance, skill development,
          and personal growth. Explore our directory or sign up to become a mentor.
        </p>
        <img
          src="/images/student.jpg"
          alt="A diverse group of students collaborating on a project"
          style={{ width: "100%", height: "auto", borderRadius: 8 }}
        />
        <div style={{ margin: "24px 0" }}>
          {loading ? (
            <span>Loading price...</span>
          ) : (
            <button
              onClick={handleBuyNow}
              style={{
                background: "#1976d2",
                color: "#fff",
                padding: "16px 32px",
                borderRadius: 8,
                fontWeight: "bold",
                fontSize: 20,
                border: "none",
                cursor: "pointer",
              }}
            >
              Buy Now for ${markedUpPrice.toFixed(2)}
            </button>
          )}
        </div>
        <a
          href="https://buy.stripe.com/test_donation_link"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            background: "#388e3c",
            color: "#fff",
            padding: "16px 32px",
            borderRadius: 8,
            fontWeight: "bold",
            textDecoration: "none",
            fontSize: 20,
            marginTop: 24,
          }}
        >
          Donate Now & Support Scholarships
        </a>
        <div style={{ marginTop: 32 }}>
          <Link
            to="/courses"
            style={{
              display: "inline-block",
              background: "#1976d2",
              color: "#fff",
              padding: "16px 32px",
              borderRadius: 8,
              fontWeight: "bold",
              textDecoration: "none",
              fontSize: 20,
            }}
          >
            Course Library
          </Link>
        </div>
      </main>
      <footer>
        <p>
          &copy; {new Date().getFullYear()} Elevate for Humanity. All rights
          reserved.
        </p>
      </footer>
    </>
  );
}