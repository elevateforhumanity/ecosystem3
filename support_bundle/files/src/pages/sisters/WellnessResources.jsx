import React from "react";

export default function WellnessResources() {
  return (
    <main style={{ padding: 32, maxWidth: 800, margin: "0 auto" }}>
      <h1>Wellness Resources</h1>
      <p>
        Find helpful resources for your physical, mental, and emotional wellness.
      </p>
      <ul>
        <li>
          <a
            href="https://www.mentalhealth.gov/"
            target="_blank"
            rel="noopener noreferrer"
          >
            MentalHealth.gov
          </a>
        </li>
        <li>
          <a
            href="https://www.cdc.gov/mentalhealth/stress-coping/"
            target="_blank"
            rel="noopener noreferrer"
          >
            CDC: Coping with Stress
          </a>
        </li>
        <li>
          <a
            href="https://www.nimh.nih.gov/health/topics/caring-for-your-mental-health"
            target="_blank"
            rel="noopener noreferrer"
          >
            NIMH: Caring for Your Mental Health
          </a>
        </li>
      </ul>
      {/* TODO: Add more local and campus resources */}
    </main>
  );
}